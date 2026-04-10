const { Server } = require('socket.io');
const { registerChatSocketHandlers } = require('../modules/chat/chat.socket');
const { env } = require('../config/env');

const buildSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    registerChatSocketHandlers(io, socket);
  });

  return io;
};

module.exports = { buildSocketServer };
