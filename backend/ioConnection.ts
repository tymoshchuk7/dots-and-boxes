import { createServer } from 'http';

export const io = require('socket.io')();

export default function initializeSocket(app) {
  const server = createServer(app);
  io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
  });
  return server;
}
