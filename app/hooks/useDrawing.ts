import { RefObject, useEffect, useRef, useState } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useHistoryStore } from '../store/useHistoryStore';

export function useDrawing(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const beforeDrawSnapshot = useRef<ImageData | null>(null);
  const points = useRef<{ x: number; y: number }[]>([]);

  const { strokeColor, lineWidth, setCanvasRef, setCtxRef } = useDrawingStore();
  const { tool } = useToolbarStore();
  const { pushAction } = useHistoryStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1500 * dpr;
    canvas.height = 1200 * dpr;
    canvas.style.width = '1500px';
    canvas.style.height = '1200px';
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctxRef.current = ctx;
    setCanvasRef(canvas);
    setCtxRef(ctx);
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = strokeColor;
    ctxRef.current.lineWidth = lineWidth;
  }, [strokeColor, lineWidth]);

  const getMousePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if ((tool !== 'draw' && tool !== 'eraser') || !ctxRef.current || !canvasRef.current) return;

    const { x, y } = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsPainting(true);
    points.current = [{ x, y }];

    beforeDrawSnapshot.current = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting || !ctxRef.current || (tool !== 'draw' && tool !== 'eraser')) return;

    const ctx = ctxRef.current;
    const { x, y } = getMousePos(e);
    points.current.push({ x, y });

    if (tool === 'eraser') {
      const eraserSize = ctx.lineWidth * 2;
      ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
      return;
    }

    if (beforeDrawSnapshot.current) {
      ctx.putImageData(beforeDrawSnapshot.current, 0, 0);
    }

    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = strokeColor;

    const pts = points.current;

    if (pts.length < 3) {
      const b = pts[0];
      ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      return;
    }

    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 1; i < pts.length - 2; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
    }

    const last = pts.length - 1;
    ctx.lineTo(pts[last].x, pts[last].y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!isPainting || !ctxRef.current || !canvasRef.current) return;

    setIsPainting(false);
    ctxRef.current.closePath();

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const before = beforeDrawSnapshot.current;
    const after = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (before) {
      pushAction({
        type: 'draw',
        undo: () => ctx.putImageData(before, 0, 0),
        redo: () => ctx.putImageData(after, 0, 0),
      });
    }

    beforeDrawSnapshot.current = null;
    points.current = [];
  };

  return {
    canvasRef,
    startDraw,
    draw,
    stopDraw,
  };
}
