import { create } from 'zustand';

export interface EmojiItem {
  id: string;
  x: string;
  y: string;
  emoji: string;
}

interface EmojiStore {
  emojis: EmojiItem[];
  addEmoji: (emoji: EmojiItem) => void;
  removeEmoji: (id: string) => void;
  removeAllEmojis: () => void;
  setEmojis: (emojis: EmojiItem[]) => void;
}

export const useEmojiStore = create<EmojiStore>((set) => ({
  emojis: [],
  addEmoji: (emoji) => set((state) => ({ emojis: [...state.emojis, emoji] })),
  removeEmoji: (id) => set((state) => ({ emojis: state.emojis.filter((e) => e.id !== id) })),
  removeAllEmojis: () => set({ emojis: [] }),
  setEmojis: (emojis) => set({ emojis }),
}));
