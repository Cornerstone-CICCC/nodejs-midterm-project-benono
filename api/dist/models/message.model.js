"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class MessageModel {
    constructor() {
        this.messages = [];
    }
    create(newData) {
        const message = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date(), updatedAt: new Date() }, newData);
        this.messages.push(message);
        return message;
    }
    getConversation(senderId, receiverId) {
        return this.messages
            .filter((message) => (message.senderId === senderId &&
            message.receiverId === receiverId) ||
            (message.senderId === receiverId && message.receiverId === senderId))
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
}
exports.default = new MessageModel();
