import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { AxiosError } from "axios";

interface UserStore {
  loading: boolean;
  updateProfile: (user: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  loading: false,
  updateProfile: async (data) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put("/users/update", data);
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ loading: false });
    }
  },
  deleteAccount: async () => {
    try {
      await axiosInstance.delete("/users/delete");
      useAuthStore.getState().setAuthUser(null);
      toast.success("Account deleted successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  },
}));
