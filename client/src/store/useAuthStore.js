import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get("/auth/check");

      set({
        authUser: response.data,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isCheckingAuth: false, authUser: null });
    }
  },

  signUp: async (formData) => {
    try {
      console.log("formData:", formData);

      set({ isSigningIn: true });
      const response = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: response.data, isSigningIn: false });
      toast.success("Account created successfully!");
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
      set({ authUser: response.data, isLoggingIn: false });
      toast.success("Logged in successfully!");
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
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isUpdatingProfile: true });
      const response = await axiosInstance.put("/auth/update", profileData);
      set({ authUser: response.data, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      set({ isUpdatingProfile: false });
    }
  },
}));
