import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export function getSocketSingleton(token: string | undefined): Socket {
  if (!socket && token) {
    if (typeof window !== 'undefined') {
      socket = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        auth: {
          token: token || '',
        },
      });
    }
  }

  return socket!;
}
