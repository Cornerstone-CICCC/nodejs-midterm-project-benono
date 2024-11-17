import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";

dotenv.config();

let io: SocketServer;

const connectedUsers = new Map<string, string>();

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId as string;
    if (!userId) return next(new Error("User ID is required"));
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    connectedUsers.set(socket.userId, socket.id);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getConnectedUsers: () => Map<string, string> = () => {
  return connectedUsers;
};
