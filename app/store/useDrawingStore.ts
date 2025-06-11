import { createRef, RefObject } from 'react';
import { create } from 'zustand';

export interface Stroke {
  points: { x: number; y: number }[];
  strokeColor: string;
  lineWidth: number;
  tool: string;
  id: string;
}

interface DrawingStore {
  strokeColor: string;
  lineWidth: number;
  setStrokeColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setCanvasRef: (canvas: HTMLCanvasElement | null) => void;
  workerRef: Worker | null;
  initWorker: () => void;
  strokes: Stroke[];
  addStroke: (stroke: Stroke) => void;
  removeStroke: (id: string) => void;
  clearStrokes: () => void;
}

export const useDrawingStore = create<DrawingStore>((set, get) => ({
  strokeColor: '#000000',
  lineWidth: 5,
  setStrokeColor: (color) => set({ strokeColor: color }),
  setLineWidth: (width) => set({ lineWidth: width }),
  canvasRef: createRef<HTMLCanvasElement>(),
  setCanvasRef: (canvas) => {
    const ref = get().canvasRef;
    ref.current = canvas;
  },
  workerRef: null,
  initWorker: () => {
    const currentWorker = get().workerRef;
    const canvas = get().canvasRef.current;
    if (!canvas) return;

    if (currentWorker) {
      currentWorker.terminate();
      set({ workerRef: null });
    }

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('../workers/drawingWorker.ts', import.meta.url));
    worker.postMessage({ canvas: offscreen }, [offscreen]);
    set({ workerRef: worker });
  },

  strokes: [],
  addStroke: (stroke) => set((state) => ({ strokes: [...state.strokes, stroke] })),
  removeStroke: (id) => set((state) => ({ strokes: state.strokes.filter((s) => s.id !== id) })),
  clearStrokes: () => set({ strokes: [] }),
}));
