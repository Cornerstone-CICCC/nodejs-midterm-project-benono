import { Request, Response } from "express";
import messageModel from "../models/message.model";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, receiverId } = req.body;
    const message = messageModel.create({
      content,
      senderId: req.user!.id,
      receiverId,
    });

    // TODO send the message in real time => socket.io
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error(`Error in sendMessage controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const messages = messageModel.getConversation(userId, req.user!.id);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(`Error in getConversation controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
