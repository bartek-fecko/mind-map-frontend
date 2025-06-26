import { useEffect } from 'react';
import { Stroke, useDrawingStore } from '../store/useDrawingStore';
import { useSocket } from '../providers/SocketProvider';
import { DrawingSocketEvents } from '../types/socketEvents';
import { useDrawing } from './useDrawing';

export const useDrawingSocketListeners = () => {
  const { socket, boardId } = useSocket();
  const addStroke = useDrawingStore((s) => s.addStroke);
  const removeStroke = useDrawingStore((s) => s.removeStroke);
  const clearStrokes = useDrawingStore((s) => s.clearStrokes);
  const { isRedrawing, workerRef, redrawAll } = useDrawing();

  useEffect(() => {
    if (!socket) return;

    socket.on(DrawingSocketEvents.LOAD_DRAWING, (payload: { boardId: number; strokes: Stroke[] }) => {
      if (boardId !== payload.boardId) return;
      clearStrokes();
      redrawAll(payload.strokes);
      payload.strokes.forEach((stroke) => addStroke(stroke));
    });

    socket.on(DrawingSocketEvents.ADD_STROKE, (payload: { boardId: number; stroke: Stroke }) => {
      if (isRedrawing) return;
      if (payload.boardId !== boardId) return;

      const exists = useDrawingStore.getState().strokes.find((s) => s.id === payload.stroke.id);
      if (exists) return;

      addStroke(payload.stroke);
      workerRef?.postMessage({ drawCommands: payload.stroke });
    });

    socket.on(DrawingSocketEvents.REMOVE_STROKE, (payload: { boardId: number; strokeId: string }) => {
      if (isRedrawing) return;
      if (payload.boardId !== boardId) return;

      removeStroke(payload.strokeId);
      redrawAll(useDrawingStore.getState().strokes);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL_STROKES, (payload: { boardId: number }) => {
      if (payload.boardId !== boardId) return;

      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL, (payload: { boardId: number }) => {
      if (payload.boardId !== boardId) return;

      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    });

    socket.on(DrawingSocketEvents.UNDO_CLEAR_ALL, (payload: { boardId: number; strokes: Stroke[] }) => {
      if (payload.boardId !== boardId) return;

      clearStrokes();
      payload.strokes.forEach((stroke) => addStroke(stroke));
      redrawAll(payload.strokes);
    });

    return () => {
      socket.off(DrawingSocketEvents.LOAD_DRAWING);
      socket.off(DrawingSocketEvents.ADD_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_ALL_STROKES);
      socket.off(DrawingSocketEvents.REMOVE_ALL);
      socket.off(DrawingSocketEvents.UNDO_CLEAR_ALL);
    };
  }, [boardId, socket, workerRef, addStroke, removeStroke, clearStrokes, redrawAll, isRedrawing]);
};
