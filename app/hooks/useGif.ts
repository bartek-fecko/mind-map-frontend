'use client';

import { useHistoryStore } from '../store/useHistoryStore';
import { useSocket } from '../providers/SocketProvider';
import { GifsSocketEvents } from '../types/socketEvents';
import { GifItem, useGifStore } from '../store/useGifStore';

export function useGif() {
  const { boardId, socket } = useSocket();

  const updateStoreGif = useGifStore((state) => state.updateGif);
  const addStoreGif = useGifStore((state) => state.addGif);
  const removeStoreGif = useGifStore((state) => state.removeGif);

  const addGif = (createdGif: GifItem) => {
    const snapshot = JSON.parse(JSON.stringify(createdGif));
    addStoreGif(createdGif);

    socket.emit(GifsSocketEvents.ADD_GIF, { payload: { boardId, gif: createdGif } });

    useHistoryStore.getState().pushAction({
      type: 'gif-add',
      payload: snapshot,
      undo: () => {
        removeGif(snapshot.id);
      },
      redo: () => {
        const note = JSON.parse(JSON.stringify(snapshot));
        addStoreGif(note);
        socket.emit(GifsSocketEvents.ADD_GIF, { payload: { boardId, gif: createdGif } });
      },
    });
  };

  const updateGif = (gif: Partial<GifItem>) => {
    const currentNote = useGifStore.getState().gifs.find((g) => g.id === gif.id);
    if (!currentNote) return;

    const prevGif = JSON.parse(JSON.stringify(currentNote));
    const newGif = { ...prevGif, ...gif };

    updateStoreGif(newGif.id, newGif);

    socket.emit(GifsSocketEvents.UPDATE_GIF, {
      payload: { id: newGif.id, gif: newGif, boardId },
    });

    useHistoryStore.getState().pushAction({
      type: 'gif-update',
      payload: { ...newGif },
      undo: () => {
        updateStoreGif(newGif.id, JSON.parse(JSON.stringify(prevGif)));
        socket.emit(GifsSocketEvents.UPDATE_GIF, {
          payload: { id: prevGif.id, gif: prevGif, boardId },
        });
      },
      redo: () => {
        updateStoreGif(newGif.id, JSON.parse(JSON.stringify(newGif)));
        socket.emit(GifsSocketEvents.UPDATE_GIF, {
          payload: { id: newGif.id, gif: newGif, boardId },
        });
      },
    });
  };

  const removeGif = (id: string) => {
    removeStoreGif(id);
    socket.emit(GifsSocketEvents.REMOVE_GIF, {
      payload: { gifId: id, boardId },
    });
  };

  return { addGif, updateGif, removeGif };
}
