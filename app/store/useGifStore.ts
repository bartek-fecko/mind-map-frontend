import { create } from 'zustand';
import { DraggableElement } from '../components/ResizableCard/ResizableCard';

export type GifItem = {
  id: string;
  url: string;
  alt: string;
} & DraggableElement;

interface GifStore {
  gifs: GifItem[];
  addGif: (gif: GifItem) => void;
  setGifs: (gifs: GifItem[]) => void;
  removeGif: (id: string) => void;
  removeAllGifs: () => void;
  updateGif: (id: string, updates: Partial<Omit<GifItem, 'id' | 'url'>>) => void;
  gifSearchVisible: boolean;
  showGifSearch: () => void;
  hideGifSearch: () => void;
  toggleGifSearch: () => void;
}

export const useGifStore = create<GifStore>((set) => ({
  gifs: [],
  setGifs: (gifs) => set({ gifs }),
  addGif: (gif) => set((state) => ({ gifs: [...state.gifs, gif] })),
  removeGif: (id) => set((state) => ({ gifs: state.gifs.filter((g) => g.id !== id) })),
  removeAllGifs: () => set({ gifs: [] }),
  updateGif: (id, updates) =>
    set((state) => ({
      gifs: state.gifs.map((gif) => (gif.id === id ? { ...gif, ...updates } : gif)),
    })),
  gifSearchVisible: false,
  showGifSearch: () => set({ gifSearchVisible: true }),
  hideGifSearch: () => set({ gifSearchVisible: false }),
  toggleGifSearch: () => set((state) => ({ gifSearchVisible: !state.gifSearchVisible })),
}));
