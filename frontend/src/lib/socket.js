import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL;

if (!socketUrl) {
  throw new Error(
    'VITE_API_URL is missing. Add it to frontend/.env (see .env.example) — e.g. http://localhost:4000 or your deployed backend URL.'
  );
}

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
