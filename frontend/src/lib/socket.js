import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const socket = io(socketUrl, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

export const bindSocketEvents = (handlers) => {
  Object.entries(handlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });

  return () => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.off(event, handler);
    });
  };
};
