import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocketSingleton(): Socket {
  if (!socket) {
    if (typeof window !== 'undefined') {
      socket = io('http://localhost:3001', {
        transports: ['websocket'],
      });
    }
  }

  return socket!;
}
