import { RefObject, useEffect, useRef, useState, useCallback } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useSocket } from '../providers/SocketProvider';
import { useHistoryStore } from '../store/useHistoryStore';
import { v4 as uuidv4 } from 'uuid';
import { DrawingSocketEvents } from '../store/socketEvents';

export function useDrawing(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const workerRef = useRef<Worker | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const strokeId = useRef<string | null>(null);

  const { strokeColor, lineWidth } = useDrawingStore();
  const { tool } = useToolbarStore();
  const { socket } = useSocket();

  const addStroke = useDrawingStore((s) => s.addStroke);
  const removeStroke = useDrawingStore((s) => s.removeStroke);
  const strokes = useDrawingStore((s) => s.strokes);
  const pushAction = useHistoryStore((s) => s.pushAction);

  // Init worker
  useEffect(() => {
    if (!canvasRef.current || workerRef.current) return;

    const canvas = canvasRef.current;
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('../workers/drawingWorker.ts', import.meta.url));
    worker.postMessage({ canvas: offscreen }, [offscreen]);
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [canvasRef]);

  const getMousePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawToWorker = (stroke: {
    points: { x: number; y: number }[];
    strokeColor: string;
    lineWidth: number;
    tool: string;
  }) => {
    workerRef.current?.postMessage({ drawCommands: stroke });
  };

  const redrawAll = useCallback(
    (strokeList: typeof strokes) => {
      workerRef.current?.postMessage({ clear: true });
      strokeList.forEach(drawToWorker);
    },
    [strokes],
  );

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!['draw', 'eraser'].includes(tool)) return;

    const pos = getMousePos(e);
    strokeId.current = uuidv4();
    points.current = [pos];
    setIsPainting(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;

    const pos = getMousePos(e);
    points.current.push(pos);
    drawToWorker({ points: points.current.slice(-5), strokeColor, lineWidth, tool });
  };

  const stopDraw = () => {
    if (!isPainting || !strokeId.current || points.current.length < 1) return;
    setIsPainting(false);

    const newStroke = {
      id: strokeId.current,
      points: [...points.current],
      strokeColor,
      lineWidth,
      tool,
    };

    addStroke(newStroke);
    drawToWorker(newStroke);

    // Emit to socket
    socket.emit(DrawingSocketEvents.ADD_STROKE, newStroke);

    // History
    pushAction({
      type: 'drawStroke',
      payload: newStroke,
      undo: () => {
        removeStroke(newStroke.id);

        const currentStrokes = useDrawingStore.getState().strokes;
        redrawAll(currentStrokes.filter((s) => s.id !== newStroke.id));

        socket.emit(DrawingSocketEvents.REMOVE_STROKE, newStroke.id);
      },
      redo: () => {
        const currentStrokes = useDrawingStore.getState().strokes;
        const updated = [...currentStrokes, newStroke];

        addStroke(newStroke);
        redrawAll(updated);

        socket.emit(DrawingSocketEvents.ADD_STROKE, newStroke);
      },
    });

    points.current = [];
    strokeId.current = null;
  };
  useEffect(() => {
    if (!socket) return;

    socket.on(DrawingSocketEvents.ADD_STROKE, (stroke) => {
      addStroke(stroke);
      drawToWorker(stroke);
    });

    socket.on(DrawingSocketEvents.REMOVE_STROKE, (strokeId) => {
      removeStroke(strokeId);
      redrawAll(useDrawingStore.getState().strokes);
    });

    return () => {
      socket.off(DrawingSocketEvents.ADD_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_STROKE);
    };
  }, [socket]);

  return {
    startDraw,
    draw,
    stopDraw,
  };
}
