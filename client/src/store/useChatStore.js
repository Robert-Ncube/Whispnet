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
    const socket = useAuthStore.getState().socket;

    set({ selectedUser: user });

    if (user) {
      await get().getMessages(user._id);

      // Reset unread count for this user
      set((state) => ({
        users: state.users.map((u) =>
          u._id === user._id ? { ...u, unreadCount: 0 } : u
        ),
      }));

      // Optimistically mark messages as read in local state
      set((state) => ({
        messages: state.messages.map((msg) => ({
          ...msg,
          read: msg.senderId === user._id ? true : msg.read,
        })),
      }));

      // Mark as read in backend via socket
      socket.emit("markMessagesRead", {
        userId: authUser._id,
        contactId: user._id,
      });

      // Trigger global unread update
      socket.emit("updateUnreadCount", {
        userId: authUser._id,
        contactId: user._id,
      });
    } else {
      set({ messages: [] });
    }
  },

  incrementUnreadCount: (contactId) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === contactId
          ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
          : user
      ),
    }));
  },

  updateUnreadCount: (contactId, count) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === contactId ? { ...user, unreadCount: count } : user
      ),
    }));
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const isCurrentContact = selectedUser?._id === newMessage.senderId._id;
      const isIncoming = newMessage.receiverId === authUser._id;

      if (isCurrentContact) {
        // Add to current chat and mark as read
        set({ messages: [...get().messages, newMessage] });
        socket.emit("markMessagesRead", {
          userId: authUser._id,
          contactId: newMessage.senderId._id,
        });
      } else if (isIncoming) {
        // Trigger unread count update for this contact
        socket.emit("updateUnreadCount", {
          userId: authUser._id,
          contactId: newMessage.senderId._id,
        });
      }
    });

    // Listen for unread count updates
    socket.on("unreadCountUpdate", ({ contactId, count }) => {
      get().updateUnreadCount(contactId, count);
    });

    // Request initial unread counts on connection
    const fetchInitialUnreadCounts = async () => {
      const users = get().users;
      for (const user of users) {
        socket.emit("updateUnreadCount", {
          userId: authUser._id,
          contactId: user._id,
        });
      }
    };

    fetchInitialUnreadCounts();
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
