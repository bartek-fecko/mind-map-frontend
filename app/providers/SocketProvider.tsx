'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Session } from 'next-auth';
import { GlobalSocketEvents } from '../types/socketEvents';
import { useAlertStore } from '../store/useAlertStore';

type SocketContextType = {
  socket: Socket;
  boardId: number;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
  boardId,
  session,
}: {
  children: React.ReactNode;
  boardId: number;
  session: Session;
}) => {
  const [socket, setSocket] = useState<Socket>();
  const addAlert = useAlertStore((state) => state.addAlert);

  useEffect(() => {
    if (!session || !boardId) return;

    const token = session.backendTokens?.accessToken;

    const initSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    setSocket(initSocket);

    initSocket.on('connect_error', (err) => {
      addAlert('error', `Connection error: ${err}`);
    });

    initSocket.on(GlobalSocketEvents.ERROR, (err: string) => {
      addAlert('error', `Coś poszło nie tak: ${err}`);
    });

    return () => {
      initSocket.disconnect();
    };
  }, [boardId, session]);

  return <SocketContext.Provider value={{ socket: socket!, boardId }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('⚠️ useSocket must be used inside SocketProvider!');
  return socket;
};
