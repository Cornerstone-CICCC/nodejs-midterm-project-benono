"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.sendMessage = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
const socket_server_1 = require("../socket/socket.server");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, receiverId } = req.body;
        const message = message_model_1.default.create({
            content,
            senderId: req.user.id,
            receiverId,
        });
        const connectedUser = (0, socket_server_1.getConnectedUsers)();
        const receiverSocketId = connectedUser.get(receiverId);
        if (receiverSocketId) {
            (0, socket_server_1.getIO)().to(receiverSocketId).emit("newMessage", message);
        }
        res.status(201).json({ success: true, message });
    }
    catch (error) {
        console.error(`Error in sendMessage controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const messages = message_model_1.default.getConversation(userId, req.user.id);
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        console.error(`Error in getConversation controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getConversation = getConversation;
