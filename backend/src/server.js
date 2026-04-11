const http = require('http');
const app = require('./app');
const { env } = require('./config/env');
const { connectDb, closeDb } = require('./config/db');
const { buildSocketServer } = require('./socket');
const { startSelfHealthPing, stopSelfHealthPing } = require('./lib/keepAlive');

const httpServer = http.createServer(app);
const io = buildSocketServer(httpServer);

let keepAliveTimer = null;

const startServer = async () => {
  await connectDb(env.mongoUri);

  httpServer.listen(env.port, '0.0.0.0', () => {
    console.log(`FlashChat backend listening on 0.0.0.0:${env.port}`);
    keepAliveTimer = startSelfHealthPing(env.port, env.keepAliveIntervalMs);
    console.log(`Self health ping every ${env.keepAliveIntervalMs}ms (see backend README)`);
  });
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`);

  stopSelfHealthPing(keepAliveTimer);
  keepAliveTimer = null;

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
