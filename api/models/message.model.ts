import { Message } from "../types/message";
import { v4 as uuidv4 } from "uuid";

class MessageModel implements MessageModel {
  private messages: Message[] = [];

  create(newData: Omit<Message, "id" | "createdAt" | "updatedAt">): Message {
    const message = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newData,
    };
    this.messages.push(message);
    return message;
  }

  getConversation(senderId: string, receiverId: string): Message[] {
    return this.messages
      .filter(
        (message) =>
          (message.senderId === senderId &&
            message.receiverId === receiverId) ||
          (message.senderId === receiverId && message.receiverId === senderId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export default new MessageModel();
