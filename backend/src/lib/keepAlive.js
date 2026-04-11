const http = require('http');

/**
 * Periodically GET /health on this process so the HTTP server receives traffic.
 * Helps some hosts that spin down after idle HTTP (e.g. Render free tier) while the instance is running.
 */
function startSelfHealthPing(port, intervalMs) {
  const ping = () => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: '/health',
        method: 'GET',
        timeout: 15000,
      },
      (res) => {
        res.resume();
      }
    );
    req.on('error', () => {});
    req.end();
  };

  ping();
  return setInterval(ping, intervalMs);
}

function stopSelfHealthPing(timer) {
  if (timer) {
    clearInterval(timer);
  }
}

module.exports = { startSelfHealthPing, stopSelfHealthPing };
