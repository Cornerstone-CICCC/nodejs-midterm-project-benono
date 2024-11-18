import { io, Socket } from "socket.io-client";

// import.meta.env.VITE_API_URL

const SOCKET_URL = "http://localhost:3500";
let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (socket) {
    socket.disconnect();
  }
  socket = io(SOCKET_URL, {
    auth: { userId },
  });
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
