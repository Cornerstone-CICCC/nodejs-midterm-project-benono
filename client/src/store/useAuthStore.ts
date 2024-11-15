import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
interface User {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  genderPreference: string;
}

type LoginUser = Omit<User, "name" | "age" | "gender" | "genderPreference">;

interface AuthStore {
  authUser: User | null;
  checkingAuth: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  signup: (user: Partial<User>) => Promise<void>;
  login: (loginUser: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
  signup: async (user: Partial<User>) => {
    try {
      set({ loading: true });
      console.log(user);
      const res = await axiosInstance.post("/auth/signup", user);
      console.log(res.data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      set({ loading: false });
    }
  },
  login: async (loginUser: LoginUser) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginUser);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        set({ authUser: null });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  },
}));