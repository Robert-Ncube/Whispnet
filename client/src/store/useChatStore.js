import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set) => ({
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  users: [],
  selectedUser: null,
  discoverableUsers: [],
  chattedUserIds: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/sidebar");
      set({
        users: response.data.users,
        chattedUserIds: response.data.users.map((u) => u._id),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/messages/user/${userId}`);
      set({ selectedUser: response.data.user });
      //console.log("Fetched user by ID:", response.data);
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
      //console.log("Fetched messages:", response.data);
    } catch (error) {
      const errorStatus = error?.response.status;
      errorStatus !== 404
        ? console.error("Error fetching messages:", error)
        : "";
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (receiverId, messageContent) => {
    set({ isSendingMessage: true });

    const { chattedUserIds, getUsers } = useChatStore.getState();
    const { authUser } = useAuthStore.getState(); // ✅ get current logged-in user
    const { selectedUser } = useChatStore.getState(); // ✅ get the receiver

    //console.log("userr:", authUser);

    try {
      const response = await axiosInstance.post(
        `/messages/send/${receiverId}`,
        messageContent
      );

      // ✅ Patch the returned message so your frontend can render it properly
      const patchedMessage = {
        ...response.data.message,
        senderId: {
          _id: authUser._id,
          profilePic: authUser.profilePic,
          fullname: authUser.fullname,
        },
        receiverId: {
          _id: selectedUser._id,
          profilePic: selectedUser.profilePic,
          fullname: selectedUser.fullname,
        },
      };

      // ✅ Now use the patchedMessage to update your messages array
      set((state) => ({
        messages: [...state.messages, patchedMessage],
      }));

      // Refresh sidebar only if chatting with a new user
      if (!chattedUserIds.includes(receiverId)) {
        await getUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  getDiscoverableUsers: async () => {
    try {
      const response = await axiosInstance.get("/messages/users/all");

      set({ discoverableUsers: response.data.users });

      console.log("Discoverable users:", response.data.users);
    } catch (error) {
      console.error("Error fetching discoverable users:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch discoverable users."
      );
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
    if (user) {
      // Fetch messages for the selected user
      useChatStore.getState().getMessages(user._id);
    } else {
      // Clear messages if no user is selected
      set({ messages: [] });
    }
  },

  subscribeToMessages: () => {
    // Placeholder for WebSocket or real-time subscription logic
    //console.log("Subscribed to messages");
  },

  unsubscribeFromMessages: () => {
    // Placeholder for WebSocket or real-time unsubscription logic
    //console.log("Unsubscribed from messages");
  },

  resetChatStore: () =>
    set({
      selectedUser: null,
      messages: [],
      discoverableUsers: [],
      users: [],
      isUsersLoading: false,
      isMessagesLoading: false,
      isSendingMessage: false,
    }),
}));
