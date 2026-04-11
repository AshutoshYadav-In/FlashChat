const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  historyLimit: Number(process.env.HISTORY_LIMIT) || 50,
  maxDisplayNameLength: Number(process.env.MAX_DISPLAY_NAME_LENGTH) || 24,
  maxMessageLength: Number(process.env.MAX_MESSAGE_LENGTH) || 500,
  messageWindowMs: Number(process.env.MESSAGE_WINDOW_MS) || 10000,
  messageRateLimit: Number(process.env.MESSAGE_RATE_LIMIT) || 8,
  keepAliveIntervalMs: Number(process.env.KEEP_ALIVE_INTERVAL_MS) || 120000,
};

module.exports = { env };
