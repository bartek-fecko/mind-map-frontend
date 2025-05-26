import { create } from 'zustand';

interface HistoryAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>;
  undo: () => void;
  redo: () => void;
}

interface HistoryStore {
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  pushAction: (action: HistoryAction) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],
  pushAction: (action) => {
    set((state) => ({
      undoStack: [...state.undoStack, action],
      redoStack: [],
    }));
  },
  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    action.undo();
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [action, ...redoStack],
    });
  },
  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return;
    const action = redoStack[0];
    action.redo();
    set({
      undoStack: [...undoStack, action],
      redoStack: redoStack.slice(1),
    });
  },
  clear: () => set({ undoStack: [], redoStack: [] }),
}));
