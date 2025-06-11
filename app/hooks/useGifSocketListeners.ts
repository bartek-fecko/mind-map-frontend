import { useEffect } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { GifsSocketEvents } from '../types/socketEvents';
import { GifItem, useGifStore } from '../store/useGifStore';

export const useGifSocketListeners = () => {
  const { socket } = useSocket();

  const setGifs = useGifStore((state) => state.setGifs);
  const addGif = useGifStore((state) => state.addGif);
  const removeGif = useGifStore((state) => state.removeGif);

  useEffect(() => {
    if (!socket) return;

    socket.on(GifsSocketEvents.LOAD_GIFS, (gifs: GifItem[]) => {
      setGifs(gifs);
    });

    socket.on(GifsSocketEvents.ADD_GIF, (gif: GifItem) => {
      addGif(gif);
    });

    socket.on(GifsSocketEvents.REMOVE_GIF, (gifId: string) => {
      removeGif(gifId);
    });

    return () => {
      socket.off(GifsSocketEvents.LOAD_GIFS);
      socket.off(GifsSocketEvents.ADD_GIF);
      socket.off(GifsSocketEvents.REMOVE_GIF);
    };
  }, [socket]);
};
