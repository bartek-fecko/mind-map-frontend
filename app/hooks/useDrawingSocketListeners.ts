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

    socket.on(
      DrawingSocketEvents.LOAD_DRAWING,
      ({ boardId: requestBoardId, strokes }: { boardId: number; strokes: Stroke[] }) => {
        if (boardId !== requestBoardId) return;
        clearStrokes();
        redrawAll(strokes);
        strokes.forEach((stroke: Stroke) => addStroke(stroke));
      },
    );

    socket.on(DrawingSocketEvents.ADD_STROKE, (data) => {
      if (isRedrawing) return;
      if (data.boardId !== boardId) return;

      const exists = useDrawingStore.getState().strokes.find((s) => s.id === data.stroke.id);
      if (exists) return;

      addStroke(data.stroke);
      workerRef?.postMessage({ drawCommands: data.stroke });
    });

    socket.on(DrawingSocketEvents.REMOVE_STROKE, (data) => {
      if (isRedrawing) return;
      if (data.boardId !== boardId) return;

      removeStroke(data.strokeId);
      redrawAll(useDrawingStore.getState().strokes);
    });

    socket.on(DrawingSocketEvents.REMOVE_ALL_STROKES, (data) => {
      if (data !== boardId) return;

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
      if (data.boardId !== boardId) return;

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
  }, [boardId, socket, workerRef, boardId, isRedrawing]);
};
