import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function getSocketSingleton(): Socket {
  if (!socket) {
    if (typeof window !== 'undefined') {
      socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
    }
  }

  return socket!;
}
