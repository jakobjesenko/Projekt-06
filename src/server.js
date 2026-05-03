import { server, initDB } from './app.js';
import dotenv from 'dotenv';
dotenv.config();

function normalizePort(val) {
  const p = Number.parseInt(val, 10);
  if (Number.isNaN(p)) return val;
  if (p >= 0) return p;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  if (error.code === 'EACCES') {
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
  }

  if (error.code === 'EADDRINUSE') {
    console.error(bind + ' is already in use');
    process.exit(1);
  }

  throw error;
}

const port = normalizePort(process.env.PORT || '3000');

await initDB();

server.listen(port, () => {
  console.log(`HTTP server listening on ${port}`);
});

server.on('error', onError);