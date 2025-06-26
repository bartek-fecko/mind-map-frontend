import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types/notes';

type NoteStore = {
  notes: Note[];
  editModeNoteId: string | null;
  setEditModeNoteId: (id: string | null) => void;
  addNote: (note: Partial<Note>) => Note;
  setNotes: (notes: Note[]) => void;
  updateNote: (id: string, changes: Partial<Note>) => void;
  removeNote: (id: string) => void;
  removeAllNotes: () => void;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  editModeNoteId: null,
  setEditModeNoteId: (id) => set({ editModeNoteId: id }),
  addNote: (note) => {
    const newId = uuidv4();
    const newNote = { id: newId, x: '100', y: '100', width: 150, height: 50, content: '', ...note };
    set((state) => ({
      notes: [...state.notes.filter((n) => n.id !== newNote.id), newNote],
    }));
    return newNote;
  },
  setNotes: (notes) => set({ notes }),
  updateNote: (id, changes) =>
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  removeAllNotes: () => {
    set(() => ({ notes: [] }));
  },
}));
