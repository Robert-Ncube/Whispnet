import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id; // req.user is populated by protectRoute middleware

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required. Please login." });
    }

    // Fetch all messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "email fullname profilePic")
      .populate("receiverId", "email fullname profilePic")
      .sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for the user." });
    }

    // Extract unique users from messages.
    // If the user is the sender, get the receiver; if the user is the receiver, get the sender.
    const users = messages.map((message) => {
      return message.senderId._id.toString() === userId
        ? message.receiverId
        : message.senderId;
    });

    // Remove duplicates
    const uniqueUsers = Array.from(new Set(users.map((user) => user._id))).map(
      (id) => users.find((user) => user._id.toString() === id)
    );

    res.status(200).json({
      message: "Users fetched successfully for the sidebar!",
      users: uniqueUsers,
    });
  } catch (error) {
    console.error("Error while fetching sidebar users:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
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
    }).sort({ createdAt: -1 });

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
    const { receiverId } = req.params.id;
    const senderId = req.user._id;

    let imageURL;
    try {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "whispnet/images",
      });
      imageURL = uploadResult.secure_url;
    } catch (cloudError) {
      console.error("Cloudinary upload failed:", cloudError);
      return res.status(500).json({ message: "Image upload failed!" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    // TODO: realtime functionality with socket.io will be implemented later here.

    res.status(201).json({
      message: "Message sent successfully!",
      message: newMessage,
    });
  } catch (error) {
    console.error("Error while sending message:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
