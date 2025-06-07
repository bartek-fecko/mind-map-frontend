import { useEffect, useRef, useState } from 'react';
import { Stroke, useDrawingStore } from '../store/useDrawingStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useSocket } from '../providers/SocketProvider';
import { useHistoryStore } from '../store/useHistoryStore';
import { useNoteStore } from '../store/useNoteStore';
import { v4 as uuidv4 } from 'uuid';
import { DrawingSocketEvents, NotesSocketEvents } from '../types/socketEvents';

export function useDrawing() {
  const [isPainting, setIsPainting] = useState(false);
  const [isRedrawing, setIsRedrawing] = useState(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const strokeId = useRef<string | null>(null);

  const { socket } = useSocket();
  const canvasRef = useDrawingStore((s) => s.canvasRef);
  const workerRef = useDrawingStore((s) => s.workerRef);
  const strokeColor = useDrawingStore((s) => s.strokeColor);
  const lineWidth = useDrawingStore((s) => s.lineWidth);
  const addStroke = useDrawingStore((s) => s.addStroke);
  const removeStroke = useDrawingStore((s) => s.removeStroke);
  const clearStrokes = useDrawingStore((s) => s.clearStrokes);
  const tool = useToolbarStore((s) => s.tool);
  const setNotes = useNoteStore((s) => s.setNotes);
  const pushAction = useHistoryStore((s) => s.pushAction);
  const clearHistory = useHistoryStore((s) => s.clear);

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
    workerRef?.postMessage({ drawCommands: stroke });
  };

  const redrawAll = (strokeList: Stroke[]) => {
    setIsRedrawing(true);
    workerRef?.postMessage({ clear: true });

    strokeList.forEach(drawToWorker);

    setTimeout(() => {
      setIsRedrawing(false);
    }, 50);
  };

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

    socket.emit(DrawingSocketEvents.ADD_STROKE, newStroke);

    pushAction({
      type: 'drawStroke',
      payload: newStroke,
      undo: () => {
        removeStroke(newStroke.id);
        redrawAll(useDrawingStore.getState().strokes.filter((s) => s.id !== newStroke.id));
        socket.emit(DrawingSocketEvents.REMOVE_STROKE, newStroke.id);
      },
      redo: () => {
        addStroke(newStroke);
        redrawAll(useDrawingStore.getState().strokes.concat(newStroke));
        socket.emit(DrawingSocketEvents.ADD_STROKE, newStroke);
      },
    });

    points.current = [];
    strokeId.current = null;
  };

  const clearAllDrawings = () => {
    const previousStrokes = useDrawingStore.getState().strokes.slice();
    if (previousStrokes.length === 0) return;

    clearStrokes();
    workerRef?.postMessage({ clear: true });

    socket.emit(DrawingSocketEvents.REMOVE_ALL_STROKES);

    pushAction({
      type: 'clearAll',
      undo: () => {
        previousStrokes.forEach((stroke) => {
          useDrawingStore.getState().addStroke(stroke);
        });
        redrawAll(previousStrokes);
        previousStrokes.forEach((stroke) => {
          socket.emit(DrawingSocketEvents.ADD_STROKE, stroke);
        });
      },
      redo: () => {
        clearStrokes();
        redrawAll([]);
        socket.emit(DrawingSocketEvents.REMOVE_ALL_STROKES);
      },
    });
  };

  const clearAll = (broadcast: boolean = true) => {
    setNotes([]);
    clearStrokes();
    clearHistory();
    workerRef?.postMessage({ clear: true });
    if (broadcast) {
      socket.emit(NotesSocketEvents.REMOVE_ALL);
      socket.emit(DrawingSocketEvents.REMOVE_ALL);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(DrawingSocketEvents.ADD_STROKE, (stroke) => {
      if (isRedrawing) return;

      // Ignore if stroke already exists locally (to avoid double drawing)
      if (useDrawingStore.getState().strokes.find((s) => s.id === stroke.id)) return;

      addStroke(stroke);
      drawToWorker(stroke);
    });

    socket.on(DrawingSocketEvents.REMOVE_STROKE, (strokeId) => {
      if (isRedrawing) return;

      removeStroke(strokeId);
      redrawAll(useDrawingStore.getState().strokes);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL, () => {
      clearAll(false);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL_STROKES, () => {
      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    });

    return () => {
      socket.off(DrawingSocketEvents.ADD_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_ALL);
      socket.off(DrawingSocketEvents.REMOVE_ALL_STROKES);
    };
  }, [socket, workerRef, isRedrawing]);

  return {
    startDraw,
    draw,
    stopDraw,
    clearAll,
    clearAllDrawings,
  };
}
