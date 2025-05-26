'use client';

import { RefObject } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSocket } from '../providers/SocketProvider';
import { NotesSocketEvents } from '../store/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { exclude } from '../utils/helpers';

function updateHistoryNoteId(tempId: string, realId: string) {
  const history = useHistoryStore.getState();
  history.undoStack.forEach((action) => {
    if (action.payload?.id === tempId) action.payload.id = realId;
  });
  history.redoStack.forEach((action) => {
    if (action.payload?.id === tempId) action.payload.id = realId;
  });
}

export function useNotes(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { tool, setTool } = useToolbarStore();
  const { addNote, removeNote, replaceNoteId, removeAllNotes: removeAllStoreNotes } = useNoteStore();
  const { socket, queueOfflineEvent } = useSocket();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'note') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toString();
    const y = (e.clientY - rect.top).toString();

    const tempId = uuidv4();
    const tempNote = { id: tempId, x, y, content: '' };
    const tempNoteWithoutId = exclude(tempNote, 'id');

    addNote(tempNote);

    useHistoryStore.getState().pushAction({
      type: 'note',
      payload: { ...tempNote },
      undo: () => {
        const action = useHistoryStore.getState().undoStack.at(-1);
        const id = action?.payload?.id;
        if (!id) return;

        removeNote(id);
        if (socket.connected) {
          socket.emit(NotesSocketEvents.REMOVE, id);
        } else {
          queueOfflineEvent({ type: NotesSocketEvents.REMOVE, payload: { id } });
        }
      },
      redo: () => {
        const redoStack = useHistoryStore.getState().redoStack;
        const note = redoStack.at(-1)?.payload;
        if (note) {
          addNote(note);
          if (socket.connected) {
            socket.emit(NotesSocketEvents.ADD, exclude(note, 'id'), (savedNote: typeof note) => {
              replaceNoteId(note.id, savedNote.id);
              updateHistoryNoteId(note.id, savedNote.id);
            });
          } else {
            queueOfflineEvent({ type: NotesSocketEvents.ADD, payload: { note } });
          }
        }
      },
    });

    if (socket.connected) {
      socket.emit(NotesSocketEvents.ADD, tempNoteWithoutId, (savedNote: typeof tempNote) => {
        replaceNoteId(tempId, savedNote.id);
        updateHistoryNoteId(tempId, savedNote.id);
      });
    } else {
      queueOfflineEvent({
        type: NotesSocketEvents.ADD,
        payload: { ...tempNote },
        callback: (savedNote: typeof tempNote) => {
          replaceNoteId(tempId, savedNote.id);
          updateHistoryNoteId(tempId, savedNote.id);
        },
      });
    }

    setTool('none');
  };

  const removeAllNotes = () => {
    removeAllStoreNotes();
    if (socket.connected) {
      socket.emit(NotesSocketEvents.REMOVE_ALL);
    } else {
      queueOfflineEvent({
        type: NotesSocketEvents.REMOVE_ALL,
      });
    }
  };

  return { handleCanvasClick, removeAllNotes };
}
