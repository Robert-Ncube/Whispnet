import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

import { getReceiverSocketId, io } from "../lib/sockect.js";

//Helpers
const updateUnreadCounts = async (userId, contactId) => {
  const count = await Message.countDocuments({
    senderId: contactId,
    receiverId: userId,
    read: false,
  });

  const receiverSocketId = getReceiverSocketId(userId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("unreadCountUpdate", {
      contactId,
      count,
    });
  }
};

//Main

export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }

    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).populate("senderId receiverId", "fullname email profilePic");

    // Use a Set to collect unique user IDs
    const userMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId
          : msg.senderId;

      if (otherUser && !userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), otherUser);
      }
    });

    const uniqueUsers = Array.from(userMap.values());

    // Get contact IDs
    const contactIds = uniqueUsers.map((user) => user._id);

    // Aggregate unread message counts
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          senderId: {
            $in: contactIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          read: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map of unread counts
    const unreadMap = new Map();
    unreadCounts.forEach((item) =>
      unreadMap.set(item._id.toString(), item.count)
    );

    // Add unreadCount to each user
    const usersWithUnread = uniqueUsers.map((user) => ({
      ...user.toObject(),
      unreadCount: unreadMap.get(user._id.toString()) || 0,
    }));

    res.status(200).json({
      message: "Users fetched successfully!",
      users: usersWithUnread,
    });
  } catch (error) {
    console.error("Sidebar fetch error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    });

    // Extract IDs of users already chatted with
    const chattedUserIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId.toString() !== currentUserId.toString()) {
        chattedUserIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== currentUserId.toString()) {
        chattedUserIds.add(msg.receiverId.toString());
      }
    });

    // Add current user to exclusion list
    chattedUserIds.add(currentUserId.toString());

    // Fetch all users except those in the exclusion list
    const discoverableUsers = await User.find({
      _id: { $nin: Array.from(chattedUserIds) },
    }).select("fullname email profilePic");

    res.status(200).json({
      message: "Discoverable users fetched successfully!",
      users: discoverableUsers,
    });
  } catch (error) {
    console.error("Error fetching discoverable users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "User fetched successfully!",
      user,
    });
  } catch (error) {
    console.error("Error while fetching user by ID:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const getMessagesBetweenTwoUsers = async (req, res) => {
  try {
    const userId = req.user._id; // req.user is populated by protectRoute middleware
    const otherUserId = req.params.id;

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: "Both user IDs are required!" });
    }

    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullname profilePic")
      .populate("receiverId", "fullname profilePic");

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found between the users." });
    }

    res.status(200).json({
      message: "Messages fetched successfully!",
      messages,
    });
  } catch (error) {
    console.error("Error while fetching messages:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content is required!" });
    }

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required!" });
    }

    if (!senderId) {
      return res.status(400).json({ message: "Sender ID is required!" });
    }

    let imageURL;
    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "whispnet/images",
        });
        imageURL = uploadResult.secure_url;
      } catch (cloudError) {
        console.error("Cloudinary upload failed:", cloudError);
        return res.status(500).json({ message: "Image upload failed!" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      ...(imageURL && { image: imageURL }),
    });

    await newMessage.save();

    await newMessage.populate([
      { path: "senderId", select: "fullname profilePic" },
      { path: "receiverId", select: "fullname profilePic" },
    ]);

    // TODO: realtime functionality with socket.io will be implemented later here.
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      await updateUnreadCounts(receiverId, senderId);

      // Emit unread count update for this contact
      const unreadCount = await Message.countDocuments({
        senderId: senderId,
        receiverId: receiverId,
        read: false,
      });

      io.to(receiverSocketId).emit("unreadCountUpdate", {
        contactId: senderId,
        count: unreadCount,
      });
    }

    res.status(201).json({
      message: "Message sent successfully!",
      newMessage,
    });
  } catch (error) {
    console.error("Error while sending message:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
