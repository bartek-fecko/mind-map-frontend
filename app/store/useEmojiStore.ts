import { create } from 'zustand';

export interface EmojiItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  emoji: string;
}

interface EmojiStore {
  emojis: EmojiItem[];
  addEmoji: (emoji: EmojiItem) => void;
  removeEmoji: (id: string) => void;
  removeAllEmojis: () => void;
  setEmojis: (emojis: EmojiItem[]) => void;
  updateEmoji: (id: string, updates: Partial<Omit<EmojiItem, 'id' | 'emoji'>>) => void;
}

export const useEmojiStore = create<EmojiStore>((set) => ({
  emojis: [],
  addEmoji: (emoji) => set((state) => ({ emojis: [...state.emojis, emoji] })),
  removeEmoji: (id) => set((state) => ({ emojis: state.emojis.filter((e) => e.id !== id) })),
  removeAllEmojis: () => set({ emojis: [] }),
  setEmojis: (emojis) => set({ emojis }),
  updateEmoji: (id, updates) =>
    set((state) => ({
      emojis: state.emojis.map((emoji) => (emoji.id === id ? { ...emoji, ...updates } : emoji)),
    })),
}));
