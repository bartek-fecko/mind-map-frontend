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
  const {
    addNote,
    removeNote: removeStoreNote,
    updateNote: updateStoreNote,
    removeAllNotes: removeAllStoreNotes,
  } = useNoteStore();
  const { socket } = useSocket();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'note') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toString();
    const y = (e.clientY - rect.top).toString();

    const newNote = { id: uuidv4(), x, y, width: 200, height: 100, content: '' };

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

  const updateNote = (note: Partial<Note>) => {
    const currentNote = useNoteStore.getState().notes.find((n) => n.id === note.id);
    if (!currentNote) return;

    const prevNote = JSON.parse(JSON.stringify(currentNote));
    const newNote = { ...prevNote, ...note };

    updateStoreNote(newNote.id, newNote);
    socket.emit(NotesSocketEvents.UPDATE, newNote);

    useHistoryStore.getState().pushAction({
      type: 'note-update',
      payload: { ...newNote },
      undo: () => {
        updateStoreNote(newNote.id, JSON.parse(JSON.stringify(prevNote)));
        socket.emit(NotesSocketEvents.UPDATE, prevNote);
      },
      redo: () => {
        updateStoreNote(newNote.id, JSON.parse(JSON.stringify(newNote)));
        socket.emit(NotesSocketEvents.UPDATE, newNote);
      },
    });
  };

  const removeNote = (id: string) => {
    removeStoreNote(id);
    socket.emit(NotesSocketEvents.REMOVE, id);
  };

  const removeAllNotes = () => {
    removeAllStoreNotes();
    socket.emit(NotesSocketEvents.REMOVE_ALL);
  };

  return { handleCanvasClick, updateNote, removeNote, removeAllNotes };
}
