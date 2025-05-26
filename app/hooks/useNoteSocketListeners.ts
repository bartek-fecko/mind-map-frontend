import { useEffect } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useSocket } from '../providers/SocketProvider';
import { NotesSocketEvents } from '../store/socketEvents';
import { Note } from '../types/notes';

export const useNoteSocketListeners = () => {
  const { socket } = useSocket();

  const setNotes = useNoteStore((state) => state.setNotes);
  const addNote = useNoteStore((state) => state.addNote);
  const removeNote = useNoteStore((state) => state.removeNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const restoreNote = useNoteStore((state) => state.restoreNote);
  const removeAllNotes = useNoteStore((state) => state.removeAllNotes);

  useEffect(() => {
    if (!socket) return;

    socket?.on(NotesSocketEvents.GET_ALL, (notes: Note[]) => {
      setNotes(notes);
    });

    socket?.on(NotesSocketEvents.ADD, (note: Note) => {
      addNote(note);
    });

    socket?.on(NotesSocketEvents.REMOVE, (id: string) => {
      removeNote(id);
    });

    socket?.on(NotesSocketEvents.UPDATE, (note: Note) => {
      updateNote(note.id, note);
    });

    socket?.on(NotesSocketEvents.RESTORE, (note: Note) => {
      restoreNote(null, note);
    });

    socket?.on(NotesSocketEvents.REMOVE_ALL, () => {
      removeAllNotes();
    });

    return () => {
      socket?.off(NotesSocketEvents.ADD);
      socket?.off(NotesSocketEvents.REMOVE);
      socket?.off(NotesSocketEvents.UPDATE);
    };
  }, [addNote, removeNote, socket, updateNote, setNotes, restoreNote, removeAllNotes]);
};
