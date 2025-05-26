import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types/notes';

type NoteStore = {
  notes: Note[];
  removedNotes: Note[];
  addNote: (note: Partial<Note>) => Note;
  setNotes: (notes: Note[]) => void;
  updateNote: (id: string, changes: Partial<Note>) => void;
  removeNote: (id: string) => void;
  restoreNote: (id: string | null, note?: Note) => void;
  replaceNoteId: (tempId: string, newId: string) => void;
  removeAllNotes: () => void;
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  removedNotes: [],
  addNote: (note) => {
    const newId = uuidv4();
    const newNote = { id: newId, x: '100', y: '100', content: '', ...note };
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
    set((state) => {
      const noteToRemove = state.notes.find((n) => n.id === id);
      if (!noteToRemove) return state;
      return {
        notes: state.notes.filter((n) => n.id !== id),
        removedNotes: [...state.removedNotes.filter((n) => n.id !== id), noteToRemove],
      };
    }),
  restoreNote: (id, note) => {
    const { removedNotes, notes } = get();
    const noteToRestore = removedNotes.find((n) => n.id === id);
    const noteToAdd = noteToRestore ?? note;
    if (!noteToAdd) return;
    set({
      notes: [...notes.filter((n) => n.id !== noteToAdd.id), noteToAdd],
      removedNotes: removedNotes.filter((n) => n.id !== id),
    });
  },
  replaceNoteId: (tempId, newId) => {
    set((state) => ({
      notes: state.notes.map((note) => (note.id === tempId ? { ...note, id: newId } : note)),
      removedNotes: state.removedNotes.map((note) => (note.id === tempId ? { ...note, id: newId } : note)),
    }));
  },
  removeAllNotes: () => {
    set(() => ({ notes: [], removedNotes: [] }));
  },
}));
