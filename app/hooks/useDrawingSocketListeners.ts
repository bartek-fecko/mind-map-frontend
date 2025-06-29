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
  const getStrokes = useDrawingStore.getState;
  const { isRedrawing, workerRef, redrawAll } = useDrawing();

  useEffect(() => {
    if (!socket || !boardId) return;

    const handleLoadDrawing = (payload: { boardId: number; strokes: Stroke[] }) => {
      if (boardId !== payload.boardId) return;
      clearStrokes();
      redrawAll(payload.strokes);
      payload.strokes.forEach((stroke) => addStroke(stroke));
    };

    const handleAddStroke = (payload: { boardId: number; stroke: Stroke }) => {
      if (isRedrawing || payload.boardId !== boardId) return;

      const exists = getStrokes().strokes.find((s) => s.id === payload.stroke.id);
      if (exists) return;

      addStroke(payload.stroke);
      workerRef?.postMessage({ drawCommands: payload.stroke });
    };

    const handleRemoveStroke = (payload: { boardId: number; strokeId: string }) => {
      if (isRedrawing || payload.boardId !== boardId) return;

      removeStroke(payload.strokeId);
      redrawAll(getStrokes().strokes);
    };

    const handleClearAll = (payload: { boardId: number }) => {
      if (payload.boardId !== boardId) return;

      clearStrokes();
      workerRef?.postMessage({ clear: true });
      redrawAll([]);
    };

    const handleUndoClear = (payload: { boardId: number; strokes: Stroke[] }) => {
      if (payload.boardId !== boardId) return;

      clearStrokes();
      payload.strokes.forEach((stroke) => addStroke(stroke));
      redrawAll(payload.strokes);
    };

    socket.on(DrawingSocketEvents.LOAD_DRAWING, handleLoadDrawing);
    socket.on(DrawingSocketEvents.ADD_STROKE, handleAddStroke);
    socket.on(DrawingSocketEvents.REMOVE_STROKE, handleRemoveStroke);
    socket.on(DrawingSocketEvents.REMOVE_ALL_STROKES, handleClearAll);
    socket.on(DrawingSocketEvents.REMOVE_ALL, handleClearAll);
    socket.on(DrawingSocketEvents.UNDO_CLEAR_ALL, handleUndoClear);

    return () => {
      socket.off(DrawingSocketEvents.LOAD_DRAWING, handleLoadDrawing);
      socket.off(DrawingSocketEvents.ADD_STROKE, handleAddStroke);
      socket.off(DrawingSocketEvents.REMOVE_STROKE, handleRemoveStroke);
      socket.off(DrawingSocketEvents.REMOVE_ALL_STROKES, handleClearAll);
      socket.off(DrawingSocketEvents.REMOVE_ALL, handleClearAll);
      socket.off(DrawingSocketEvents.UNDO_CLEAR_ALL, handleUndoClear);
    };
  }, [boardId, socket, isRedrawing, addStroke, removeStroke, clearStrokes, redrawAll, workerRef]);

  useEffect(() => {
    socket.emit(DrawingSocketEvents.LOAD_DRAWING, { payload: { boardId } });
  }, [socket, boardId]);
};
