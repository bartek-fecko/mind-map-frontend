import { create } from 'zustand';

type Tool = 'draw' | 'eraser' | 'note' | 'emoji' | 'none';

type ToolbarStore = {
  tool: Tool;
  setTool: (tool: Tool) => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
};

export const useToolbarStore = create<ToolbarStore>((set) => ({
  tool: 'none',
  setTool: (next) =>
    set((state) => ({
      tool: state.tool === next ? 'none' : next,
    })),
  selectedEmoji: null,
  setSelectedEmoji: (emoji) => set({ selectedEmoji: emoji }),
}));
