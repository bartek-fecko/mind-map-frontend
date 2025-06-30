import { useEffect } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useSocket } from '../providers/SocketProvider';
import { NotesSocketEvents } from '../types/socketEvents';
import { Note } from '../types/notes';

export const useNoteSocketListeners = () => {
  const { boardId, socket } = useSocket();

  const setNotes = useNoteStore((state) => state.setNotes);
  const addNote = useNoteStore((state) => state.addNote);
  const removeNote = useNoteStore((state) => state.removeNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const removeAllNotes = useNoteStore((state) => state.removeAllNotes);

  useEffect(() => {
    if (!socket || !boardId) return;

    const handleGetAll = (notes: Note[]) => {
      setNotes(notes);
    };

    socket.on(NotesSocketEvents.GET_ALL, handleGetAll);
    socket.on(NotesSocketEvents.ADD, addNote);
    socket.on(NotesSocketEvents.REMOVE, removeNote);
    socket.on(NotesSocketEvents.UPDATE, (note: Note) => updateNote(note.id, note));
    socket.on(NotesSocketEvents.REMOVE_ALL, removeAllNotes);

    return () => {
      socket.off(NotesSocketEvents.GET_ALL, handleGetAll);
      socket.off(NotesSocketEvents.ADD, addNote);
      socket.off(NotesSocketEvents.REMOVE, removeNote);
      socket.off(NotesSocketEvents.UPDATE);
      socket.off(NotesSocketEvents.REMOVE_ALL);
    };
  }, [socket, boardId, setNotes, addNote, removeNote, updateNote, removeAllNotes]);

  useEffect(() => {
    if (!socket || !boardId) return;
    socket.emit(NotesSocketEvents.GET_ALL, { payload: { boardId } });
  }, [socket, boardId]);
};
