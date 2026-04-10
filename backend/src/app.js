const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const { env } = require('./config/env');

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(healthRoutes);

module.exports = app;
