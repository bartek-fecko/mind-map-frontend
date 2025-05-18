import { create } from 'zustand';

type Tool = 'draw' | 'note' | 'eraser' | null;

type ToolbarStore = {
  tool: Tool;
  setTool: (tool: Tool) => void;
};

export const useToolbarStore = create<ToolbarStore>((set) => ({
  tool: 'draw',
  setTool: (tool) => set({ tool }),
}));
