'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useNoteStore } from '../store/useNoteStore';
import { getSocketSingleton } from './SocketSingleton';
import { QueueOfflineEvent } from '../types/queueOfflineEvent';

type SocketContextType = {
  socket: Socket;
  queueOfflineEvent: (event: QueueOfflineEvent) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();
  const offlineEventQueue = useRef<QueueOfflineEvent[]>([]);

  const setNotes = useNoteStore((state) => state.setNotes);

  useEffect(() => {
    const initSocket = getSocketSingleton();
    setSocket(initSocket);

    initSocket.on('connect', () => {
      initSocket.emit('notes:get-all');
      flushOfflineEvents();
    });

    initSocket.on('notes:get-all', (notes) => {
      setNotes(notes);
    });

    return () => {
      initSocket.off('connect');
      initSocket.off('notes:get-all');
    };
  }, []);

  const queueOfflineEvent = (event: QueueOfflineEvent) => {
    offlineEventQueue.current.push(event);
  };

  const flushOfflineEvents = () => {
    while (offlineEventQueue.current.length > 0) {
      const event = offlineEventQueue.current.shift();
      if (!event) continue;

      if (event.callback) {
        socket?.emit(event.type, event.payload, event.callback);
      } else {
        socket?.emit(event.type, event.payload);
      }
    }
  };

  return <SocketContext.Provider value={{ socket: socket!, queueOfflineEvent }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('⚠️ useSocket must be used inside SocketProvider!');
  return socket;
};
