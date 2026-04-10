const http = require('http');
const app = require('./app');
const { env } = require('./config/env');
const { connectDb, closeDb } = require('./config/db');
const { buildSocketServer } = require('./socket');

const httpServer = http.createServer(app);
const io = buildSocketServer(httpServer);

const startServer = async () => {
  await connectDb(env.mongoUri);

  httpServer.listen(env.port, () => {
    console.log(`FlashChat backend listening on port ${env.port}`);
  });
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);

  io.close();

  httpServer.close(async () => {
    try {
      await closeDb();
      process.exit(0);
    } catch (error) {
      console.error('Error while closing MongoDB connection', error);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
