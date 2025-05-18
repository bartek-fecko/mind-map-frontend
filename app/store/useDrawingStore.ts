import { create } from 'zustand';

interface DrawingStore {
  strokeColor: string;
  lineWidth: number;
  setStrokeColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  canvasRef: HTMLCanvasElement | null;
  ctxRef: CanvasRenderingContext2D | null;
  setCanvasRef: (canvas: HTMLCanvasElement) => void;
  setCtxRef: (ctx: CanvasRenderingContext2D) => void;
}

export const useDrawingStore = create<DrawingStore>((set) => ({
  strokeColor: '#000000',
  lineWidth: 5,
  setStrokeColor: (color) => set({ strokeColor: color }),
  setLineWidth: (width) => set({ lineWidth: width }),
  canvasRef: null,
  ctxRef: null,
  setCanvasRef: (canvas) => set({ canvasRef: canvas }),
  setCtxRef: (ctx) => set({ ctxRef: ctx }),
}));
