'use client';

import { useEffect } from 'react';
import { BoardSocketEvents } from '../types/socketEvents';
import { useSocket } from '../providers/SocketProvider';

import { useNoteStore } from '../store/useNoteStore';
import { useDrawingStore } from '../store/useDrawingStore';
import { useGifStore } from '../store/useGifStore';
import { useHistoryStore } from '../store/useHistoryStore';

export function useBoard() {
  const { socket, boardId } = useSocket();

  const removeAllNotes = useNoteStore((state) => state.removeAllNotes);
  const removeAllDrawings = useDrawingStore((state) => state.clearStrokes);
  const removeAllGifs = useGifStore((state) => state.removeAllGifs);
  const clearHistory = useHistoryStore((state) => state.clear);
  const workerRef = useDrawingStore((s) => s.workerRef);

  const clearAllBoard = () => {
    if (!socket || !boardId) return;

    socket.emit(BoardSocketEvents.REMOVE_BOARD_ALL_CONTENT, {
      payload: { boardId },
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleClearAllContent = () => {
      removeAllNotes();
      removeAllDrawings();
      removeAllGifs();
      clearHistory();
      workerRef?.postMessage({ clear: true });
    };

    socket.on(BoardSocketEvents.REMOVE_BOARD_ALL_CONTENT, handleClearAllContent);

    return () => {
      socket.off(BoardSocketEvents.REMOVE_BOARD_ALL_CONTENT, handleClearAllContent);
    };
  }, [socket, workerRef, removeAllNotes, removeAllDrawings, removeAllGifs]);

  return { clearAllBoard };
}
