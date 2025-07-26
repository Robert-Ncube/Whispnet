import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  unreadMessages: [],
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

      console.log("Users", response.data.users);
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
      // console.log("Fetched messages:", response.data);
    } catch (error) {
      const errorStatus = error?.response.status;
      errorStatus !== 404
        ? console.error("Error fetching messages:", error)
        : "";
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setUnreadMessages: () => {},

  getDiscoverableUsers: async () => {
    try {
      const response = await axiosInstance.get("/messages/users/all");

      set({ discoverableUsers: response.data.users });
    } catch (error) {
      console.error("Error fetching discoverable users:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch discoverable users."
      );
    }
  },

  setSelectedUser: async (user) => {
    const { authUser } = useAuthStore.getState();

    set({ selectedUser: user });

    if (user) {
      // Reset unread count for this user
      set((state) => ({
        users: state.users.map((u) =>
          u._id === user._id ? { ...u, unreadCount: 0 } : u
        ),
      }));

      // Fetch messages
      await get().getMessages(user._id);

      // Optimistically mark messages as read in local state
      set((state) => ({
        messages: state.messages.map((msg) => ({
          ...msg,
          read: msg.senderId === user._id ? true : msg.read,
        })),
      }));

      // Mark as read in backend via socket
      const socket = useAuthStore.getState().socket;
      socket.emit("markMessagesRead", {
        userId: authUser._id,
        contactId: user._id,
      });
    } else {
      set({ messages: [] });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    let updateTimeout;
    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      clearTimeout(updateTimeout);

      updateTimeout = setTimeout(() => {
        if (!selectedUser) return;
        const isCurrentContact = selectedUser?._id === newMessage.senderId._id;

        if (isCurrentContact) {
          // Add message and mark as read
          set({ messages: [...get().messages, newMessage] });
          socket.emit("markMessagesRead", {
            userId: authUser._id,
            contactId: newMessage.senderId._id,
          });
        } else {
          // Update unread count
          set((state) => ({
            users: state.users.map((user) =>
              user._id === newMessage.senderId._id
                ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
                : user
            ),
          }));
        }
      }, 300);
    });

    //console.log("Subscribed to messages.");
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");

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
