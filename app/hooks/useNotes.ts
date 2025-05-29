'use client';

import { RefObject } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSocket } from '../providers/SocketProvider';
import { NotesSocketEvents } from '../store/socketEvents';
import { v4 as uuidv4 } from 'uuid';

export function useNotes(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { tool, setTool } = useToolbarStore();
  const { addNote, removeNote, removeAllNotes: removeAllStoreNotes } = useNoteStore();
  const { socket } = useSocket();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'note') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toString();
    const y = (e.clientY - rect.top).toString();

    const newNote = { id: uuidv4(), x, y, content: '' };

    addNote({ ...newNote });

    const snapshot = JSON.parse(JSON.stringify(newNote));

    useHistoryStore.getState().pushAction({
      type: 'note',
      payload: snapshot,
      undo: () => {
        removeNote(snapshot.id);
        socket.emit(NotesSocketEvents.REMOVE, snapshot.id);
      },
      redo: () => {
        const note = JSON.parse(JSON.stringify(snapshot));
        addNote(note);
        socket.emit(NotesSocketEvents.ADD, note);
      },
    });

    socket.emit(NotesSocketEvents.ADD, newNote);
    setTool('none');
  };

  const removeAllNotes = () => {
    removeAllStoreNotes();
    socket.emit(NotesSocketEvents.REMOVE_ALL);
  };

  return { handleCanvasClick, removeAllNotes };
}
