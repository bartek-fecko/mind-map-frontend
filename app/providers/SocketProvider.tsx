'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocketSingleton } from './SocketSingleton';
import { QueueOfflineEvent } from '../types/queueOfflineEvent';
import { DrawingSocketEvents, GifsSocketEvents, NotesSocketEvents } from '../types/socketEvents';
import { useSession } from 'next-auth/react';

type SocketContextType = {
  socket: Socket;
  boardId: number;
  queueOfflineEvent: (event: QueueOfflineEvent) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children, boardId }: { children: React.ReactNode; boardId: number }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket>();
  const offlineEventQueue = useRef<QueueOfflineEvent[]>([]);

  useEffect(() => {
    if (!session) return;
    const token = session?.backendTokens?.accessToken;
    const initSocket = getSocketSingleton(token);
    setSocket(initSocket);

    const onConnect = () => {
      initSocket.emit(NotesSocketEvents.GET_ALL, boardId);
      initSocket.emit(DrawingSocketEvents.LOAD_DRAWING, boardId);
      initSocket.emit(GifsSocketEvents.LOAD_GIFS, boardId);
    };

    initSocket.on('connect', onConnect);

    if (initSocket.connected) {
      onConnect();
    }

    return () => {
      initSocket.off('connect', onConnect);
    };
  }, [boardId, session]);

  const queueOfflineEvent = (event: QueueOfflineEvent) => {
    offlineEventQueue.current.push(event);
  };

  return (
    <SocketContext.Provider value={{ socket: socket!, boardId, queueOfflineEvent }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('⚠️ useSocket must be used inside SocketProvider!');
  return socket;
};
