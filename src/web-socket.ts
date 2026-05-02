import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerSessionSocketHandlers } from "./modules/sessions/session.socket";

let io: SocketIOServer | null = null;

export const initSocketServer = (
  server: HttpServer,
  corsOrigins: string[],
): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
    path: "/socket.io",
  });

  // Register namespace handlers
  registerSessionSocketHandlers(io);

  return io;
};

export const getSocketServer = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO server has not been initialized.");
  }
  return io;
};
