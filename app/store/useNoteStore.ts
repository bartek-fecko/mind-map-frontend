import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type Note = {
  id: string;
  x: number;
  y: number;
  content: string;
};

type NoteStore = {
  notes: Note[];
  removedNotes: Note[];
  addNote: (note: Partial<Note>) => Note;
  setNotes: (notes: Note[]) => void;
  updateNote: (id: string, changes: Partial<Note>) => void;
  removeNote: (id: string) => void;
  restoreNote: (id: string) => void;
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  removedNotes: [],
  addNote: (note) => {
    const newNote = { id: uuidv4(), x: 100, y: 100, content: '', ...note };
    set((state) => ({
      notes: [...state.notes, newNote],
    }));
    return newNote;
  },
  setNotes: (notes) => set({ notes }),
  updateNote: (id, changes) =>
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    })),
  removeNote: (id) =>
    set((state) => {
      const noteToRemove = state.notes.find((n) => n.id === id);
      if (!noteToRemove) return state;
      return {
        notes: state.notes.filter((n) => n.id !== id),
        removedNotes: [...state.removedNotes, noteToRemove],
      };
    }),
  restoreNote: (id) => {
    const { removedNotes, notes } = get();
    const noteToRestore = removedNotes.find((n) => n.id === id);
    if (!noteToRestore) return;

    set({
      notes: [...notes, noteToRestore],
      removedNotes: removedNotes.filter((n) => n.id !== id),
    });
  },
}));
