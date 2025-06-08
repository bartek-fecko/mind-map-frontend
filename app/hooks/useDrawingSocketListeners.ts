import { useEffect } from 'react';
import { Stroke, useDrawingStore } from '../store/useDrawingStore';
import { useSocket } from '../providers/SocketProvider';
import { DrawingSocketEvents } from '../types/socketEvents';
import { useDrawing } from './useDrawing';

export const useDrawingSocketListeners = () => {
  const { socket } = useSocket();

  const addStroke = useDrawingStore((s) => s.addStroke);
  const removeStroke = useDrawingStore((s) => s.removeStroke);
  const clearStrokes = useDrawingStore((s) => s.clearStrokes);
  const { drawingId, isRedrawing, workerRef, redrawAll } = useDrawing();

  useEffect(() => {
    if (!socket) return;
    socket.on(DrawingSocketEvents.LOAD_DRAWING, (strokes) => {
      clearStrokes();
      redrawAll(strokes);
      strokes.forEach((stroke: Stroke) => addStroke(stroke));
    });

    socket.on(DrawingSocketEvents.ADD_STROKE, (data) => {
      if (isRedrawing) return;
      if (data.drawingId !== drawingId) return;

      if (useDrawingStore.getState().strokes.find((s) => s.id === data.id)) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { drawingId: _, ...stroke } = data;
      addStroke(stroke);
      workerRef?.postMessage({ drawCommands: stroke });
    });

    socket.on(DrawingSocketEvents.REMOVE_STROKE, (data) => {
      if (isRedrawing) return;
      if (data.drawingId !== drawingId) return;

      removeStroke(data.strokeId);
      redrawAll(useDrawingStore.getState().strokes);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL_STROKES, (data) => {
      if (data !== drawingId) return;

      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL, () => {
      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    });

    socket.on(DrawingSocketEvents.UNDO_CLEAR_ALL, (data) => {
      if (data.drawingId !== drawingId) return;

      clearStrokes();
      data.strokes.forEach((stroke: Stroke) => addStroke(stroke));
      redrawAll(data.strokes);
    });

    return () => {
      socket.off(DrawingSocketEvents.LOAD_DRAWING);
      socket.off(DrawingSocketEvents.ADD_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_STROKE);
      socket.off(DrawingSocketEvents.REMOVE_ALL_STROKES);
      socket.off(DrawingSocketEvents.REMOVE_ALL);
      socket.off(DrawingSocketEvents.UNDO_CLEAR_ALL);
    };
  }, [socket, workerRef]);
};
