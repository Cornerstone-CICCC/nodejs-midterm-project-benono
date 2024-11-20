"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedUsers = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let io;
const connectedUsers = new Map();
const initializeSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId)
            return next(new Error("User ID is required"));
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
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
};
exports.getIO = getIO;
const getConnectedUsers = () => {
    return connectedUsers;
};
exports.getConnectedUsers = getConnectedUsers;
