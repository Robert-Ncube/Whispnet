import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

const { resetChatStore } = useChatStore.getState();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get("/auth/check");

      set({
        authUser: response.data.user,
        isCheckingAuth: false,
      });

      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isCheckingAuth: false, authUser: null });
    }
  },

  signUp: async (formData) => {
    try {
      set({ isSigningIn: true });
      const response = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: response.data.user, isSigningIn: false });
      toast.success("Account created successfully!");

      get().connectSocket();
    } catch (error) {
      toast.error(`Error Signing up:`);
      console.log("Response:", error.response.data.message);
      console.error("Error signing up:", error);
      set({ isSigningIn: false });
    }
  },

  login: async (formData) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data.user, isLoggingIn: false });
      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      resetChatStore();
      toast.success("Logged out successfully!");

      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isUpdatingProfile: true });
      const response = await axiosInstance.put("/auth/update", profileData);
      set({ authUser: response.data.user, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
