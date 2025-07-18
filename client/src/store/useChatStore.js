import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";

export const useChatStore = create((set) => ({
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  users: [],
  selectedUser: null,

  getUsersForSidebar: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/sidebar");
      set({ users: response.data.users });
      console.log("Fetched users for sidebar:", response.data);
    } catch (error) {
      console.error("Error fetching users for sidebar:", error);
      toast.error(error.response?.data?.message || "Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/messages/user/${userId}`);
      set({ selectedUser: response.data.user });
      console.log("Fetched user by ID:", response.data);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      toast.error(
        error.response?.data?.message || "Failed to load user details."
      );
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data.messages });
      console.log("Fetched messages:", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (receiverId, messageContent) => {
    set({ isSendingMessage: true });
    try {
      const response = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        {
          content: messageContent,
        }
      );
      set((state) => ({
        messages: [...state.messages, response.data.message],
      }));
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
