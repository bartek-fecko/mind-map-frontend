import { useEffect } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { GifsSocketEvents } from '../types/socketEvents';
import { GifItem, useGifStore } from '../store/useGifStore';

export const useGifSocketListeners = () => {
  const { socket, boardId } = useSocket();

  const setGifs = useGifStore((state) => state.setGifs);
  const addGif = useGifStore((state) => state.addGif);
  const updateGif = useGifStore((state) => state.updateGif);
  const removeGif = useGifStore((state) => state.removeGif);

  useEffect(() => {
    if (!socket || !boardId) return;

    const handleLoadGifs = (gifs: GifItem[]) => {
      setGifs(gifs);
    };

    socket.on(GifsSocketEvents.LOAD_GIFS, handleLoadGifs);
    socket.on(GifsSocketEvents.ADD_GIF, addGif);
    socket.on(GifsSocketEvents.UPDATE_GIF, (gif: GifItem) => updateGif(gif.id, gif));
    socket.on(GifsSocketEvents.REMOVE_GIF, removeGif);

    return () => {
      socket.off(GifsSocketEvents.LOAD_GIFS, handleLoadGifs);
      socket.off(GifsSocketEvents.ADD_GIF, addGif);
      socket.off(GifsSocketEvents.UPDATE_GIF);
      socket.off(GifsSocketEvents.REMOVE_GIF);
    };
  }, [socket, boardId, setGifs, addGif, updateGif, removeGif]);

  useEffect(() => {
    if (!socket || !boardId) return;
    socket.emit(GifsSocketEvents.LOAD_GIFS, { payload: { boardId } });
  }, [socket, boardId]);
};
