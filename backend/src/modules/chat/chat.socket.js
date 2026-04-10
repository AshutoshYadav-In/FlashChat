const { saveMessage, getRecentMessages } = require('./chat.service');
const { env } = require('../../config/env');

const activeUsersBySocket = new Map();
const messageRateLimiter = new Map();

const sanitizeDisplayName = (value) => (typeof value === 'string' ? value.trim() : '');
const sanitizeMessage = (value) => (typeof value === 'string' ? value.trim() : '');

const getUsersOnline = () => activeUsersBySocket.size;

const emitUsersOnline = (io) => {
  io.emit('users_online', { count: getUsersOnline() });
};

const validateDisplayName = (displayName) => {
  if (!displayName) {
    return 'Display name is required.';
  }

  if (displayName.length > env.maxDisplayNameLength) {
    return `Display name must be ${env.maxDisplayNameLength} characters or fewer.`;
  }

  return null;
};

const validateMessage = (text) => {
  if (!text) {
    return 'Message cannot be empty.';
  }

  if (text.length > env.maxMessageLength) {
    return `Message must be ${env.maxMessageLength} characters or fewer.`;
  }

  return null;
};

const canSendMessage = (socketId) => {
  const now = Date.now();
  const timestamps = messageRateLimiter.get(socketId) || [];
  const windowStart = now - env.messageWindowMs;
  const recent = timestamps.filter((ts) => ts > windowStart);

  if (recent.length >= env.messageRateLimit) {
    messageRateLimiter.set(socketId, recent);
    return false;
  }

  recent.push(now);
  messageRateLimiter.set(socketId, recent);
  return true;
};

const isDisplayNameActive = (displayName) => {
  for (const activeName of activeUsersBySocket.values()) {
    if (activeName.toLowerCase() === displayName.toLowerCase()) {
      return true;
    }
  }
  return false;
};

const registerChatSocketHandlers = (io, socket) => {
  socket.on('join_chat', async (payload = {}) => {
    const displayName = sanitizeDisplayName(payload.displayName);
    const validationError = validateDisplayName(displayName);

    if (validationError) {
      socket.emit('join_error', { message: validationError });
      return;
    }

    if (isDisplayNameActive(displayName)) {
      socket.emit('join_name_taken', {
        message: 'This name is in use. Please choose a different name.',
      });
      return;
    }

    activeUsersBySocket.set(socket.id, displayName);

    socket.emit('join_success', { displayName });
    const history = await getRecentMessages(env.historyLimit);
    socket.emit('chat_history', { messages: history });
    emitUsersOnline(io);
  });

  socket.on('chat_message', async (payload = {}) => {
    const sender = activeUsersBySocket.get(socket.id);
    if (!sender) {
      socket.emit('message_error', { message: 'Please join chat before sending messages.' });
      return;
    }

    if (!canSendMessage(socket.id)) {
      socket.emit('message_error', {
        message: 'You are sending messages too quickly. Please slow down.',
      });
      return;
    }

    const text = sanitizeMessage(payload.text);
    const validationError = validateMessage(text);
    if (validationError) {
      socket.emit('message_error', { message: validationError });
      return;
    }

    try {
      const saved = await saveMessage({ displayName: sender, text });
      console.log(saved);
      io.emit('chat_message', saved);
    } catch (error) {
      socket.emit('message_error', { message: 'Failed to send message. Please try again.' });
    }
  });

  socket.on('disconnect', () => {
    activeUsersBySocket.delete(socket.id);
    messageRateLimiter.delete(socket.id);
    emitUsersOnline(io);
  });
};

module.exports = { registerChatSocketHandlers };
