import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";
interface MessageStore {
  messages: Partial<Message>[];
  isLoadingMessages: boolean;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  isLoadingMessages: false,
  sendMessage: async (receiverId: string, content: string) => {
    try {
      set((state) => ({
        messages: [
          ...state.messages,
          { senderId: useAuthStore.getState().authUser!.id, content },
        ],
      }));
      const res = await axiosInstance.post("/messages/send", {
        receiverId,
        content,
      });
      console.log(`message sent: ${res.data}`);
    } catch (error) {
      console.error(`Error in setMessages: ${error}`);
    }
  },

  getMessages: async (userId: string) => {
    try {
      set({ isLoadingMessages: true });
      const response = await axiosInstance.get(
        `/messages/conversation/${userId}`
      );
      set({ messages: response.data.messages });
    } catch (error) {
      console.error(`Error in getMessages: ${error}`);
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },
  subscribeToMessages: () => {
    const socket = getSocket();
    socket.on("newMessage", (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },
  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
