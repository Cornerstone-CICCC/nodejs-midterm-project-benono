import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getSocket } from "../socket/socket.client";
interface MatchStore {
  matches: Match[];
  isLoadingMyMatches: boolean;
  getMyMatches: () => Promise<void>;
  userProfiles: User[];
  isLoadingUserProfiles: boolean;
  getUserProfiles: () => Promise<void>;
  swipeFeedback: string;
  swipeRight: (user: User) => Promise<void>;
  swipeLeft: (user: User) => Promise<void>;
  subscribeToNewMatches: () => void;
  unsubscribeFromNewMatches: () => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matches: [],
  isLoadingMyMatches: false,
  userProfiles: [],
  isLoadingUserProfiles: false,
  swipeFeedback: "",
  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const resp = await axiosInstance.get("/matches");
      set({ matches: resp.data.matches });
    } catch (error) {
      set({ matches: [] });
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to fetch matches");
      }
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },
  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const resp = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: resp.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to fetch user profiles");
      }
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },
  swipeRight: async (user: User) => {
    try {
      set({ swipeFeedback: "liked" });
      await axiosInstance.post("/matches/swipe-right/" + user.id);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to swipe right");
      }
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: "" });
      }, 1500);
    }
  },
  swipeLeft: async (user: User) => {
    try {
      set({ swipeFeedback: "passed" });
      await axiosInstance.post("/matches/swipe-left/" + user.id);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to swipe left");
      }
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: "" });
      }, 1500);
    }
  },

  subscribeToNewMatches: () => {
    try {
      const socket = getSocket();
      socket.on("new-match", (data) => {
        set((state) => ({
          matches: [...state.matches, data],
        }));
        console.log(data);
        toast.success("You matched with " + data.name);
      });
    } catch (error) {
      console.error(error);
    }
  },

  unsubscribeFromNewMatches: () => {
    try {
      const socket = getSocket();
      socket.off("new-match");
    } catch (error) {
      console.error(error);
    }
  },
}));
