'use client';

import { RefObject } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSocket } from '../providers/SocketProvider';
import { NotesSocketEvents } from '../types/socketEvents';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types/notes';

export function useNotes(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { tool, setTool } = useToolbarStore();
  const notes = useNoteStore((state) => state.notes);
  const addStoreNote = useNoteStore((state) => state.addNote);
  const removeStoreNote = useNoteStore((state) => state.removeNote);
  const updateStoreNote = useNoteStore((state) => state.updateNote);
  const removeAllStoreNotes = useNoteStore((state) => state.removeAllNotes);

  const { boardId, socket } = useSocket();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'note') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toString();
    const y = (e.clientY - rect.top).toString();

    const maxZIndex = notes.reduce((max, note) => Math.max(max, note.zIndex || 0), 0);

    const newNote: Note = { id: uuidv4(), x, y, width: 200, height: 100, content: '', zIndex: maxZIndex + 1 };

    addStoreNote(newNote);
    const snapshot = JSON.parse(JSON.stringify(newNote));

    useHistoryStore.getState().pushAction({
      type: 'note-add',
      payload: snapshot,
      undo: () => {
        removeNote(snapshot.id);
      },
      redo: () => {
        const note = JSON.parse(JSON.stringify(snapshot));
        addStoreNote(note);
        socket.emit(NotesSocketEvents.ADD, {
          payload: { note, boardId },
        });
      },
    });

    socket.emit(NotesSocketEvents.ADD, {
      payload: { note: newNote, boardId },
    });

    setTool('none');
  };

  const updateNote = (note: Partial<Note>) => {
    const currentNote = useNoteStore.getState().notes.find((n) => n.id === note.id);
    if (!currentNote) return;

    const prevNote = JSON.parse(JSON.stringify(currentNote));
    const newNote = { ...prevNote, ...note };

    updateStoreNote(newNote.id, newNote);

    socket.emit(NotesSocketEvents.UPDATE, {
      payload: { id: newNote.id, note: newNote, boardId },
    });

    useHistoryStore.getState().pushAction({
      type: 'note-update',
      payload: { ...newNote },
      undo: () => {
        updateStoreNote(newNote.id, JSON.parse(JSON.stringify(prevNote)));
        socket.emit(NotesSocketEvents.UPDATE, {
          payload: { id: prevNote.id, note: prevNote, boardId },
        });
      },
      redo: () => {
        updateStoreNote(newNote.id, JSON.parse(JSON.stringify(newNote)));
        socket.emit(NotesSocketEvents.UPDATE, {
          payload: { id: newNote.id, note: newNote, boardId },
        });
      },
    });
  };

  const increaseZIndex = (id: string) => {
    return new Promise<void>((resolve) => {
      socket.emit(
        NotesSocketEvents.INCREASE_Z_INDEX,
        {
          payload: {
            id,
            boardId,
          },
        },
        () => resolve(),
      );
    });
  };

  const decreaseZIndex = (id: string) => {
    return new Promise<void>((resolve) => {
      socket.emit(
        NotesSocketEvents.DECREASE_Z_INDEX,
        {
          payload: {
            id,
            boardId,
          },
        },
        () => resolve(),
      );
    });
  };

  const removeNote = (id: string) => {
    removeStoreNote(id);
    socket.emit(NotesSocketEvents.REMOVE, {
      payload: { id, boardId },
    });
  };

  const removeAllNotes = () => {
    removeAllStoreNotes();
    socket.emit(NotesSocketEvents.REMOVE_ALL, {
      payload: boardId,
    });
  };

  return { handleCanvasClick, updateNote, increaseZIndex, decreaseZIndex, removeNote, removeAllNotes };
}
