import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import validator from "validator";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, profilePic } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long!",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User with this email already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      profilePic,
    });

    if (newUser) {
      generateToken(newUser, res);
      await newUser.save();

      return res.status(201).json({
        message: "User created successfully!",
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({
        message: "User creation failed, Invalid user data!",
      });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password!",
      });
    }

    generateToken(user, res);

    return res.status(200).json({
      message: "Login successful!",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful!",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, profilePic } = req.body;
    const userId = req.user._id;

    // Remove the requirement for both fields
    if (!fullname && !profilePic) {
      return res.status(400).json({
        message: "At least one field (fullname or profilePic) is required!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update only if provided
    if (fullname) user.fullname = fullname;

    if (profilePic) {
      // Delete old profile picture from Cloudinary if it exists
      if (user.profilePic) {
        const publicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`whispnet/profile_pics/${publicId}`);
      }

      try {
        // If profilePic is a base64 string, upload it to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(profilePic, {
          folder: "whispnet/profile_pics",
        });
        user.profilePic = uploadResult.secure_url;
      } catch (cloudError) {
        console.error("Cloudinary upload failed:", cloudError);
        return res.status(500).json({ message: "Image upload failed!" });
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }

    return res.status(200).json({
      message: "User is authenticated!",
      user,
    });
  } catch (error) {
    console.error("Error during authentication check:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Delete profile picture from Cloudinary if it exists
    if (user.profilePic) {
      try {
        const publicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`whispnet/profile_pics/${publicId}`);
      } catch (error) {
        console.error("Error deleting profile picture from Cloudinary:", error);
        return res.status(500).json({
          message: "Failed to delete profile picture!",
        });
      }
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("token");

    return res.status(200).json({
      message: "User profile deleted successfully!",
    });
  } catch (error) {
    console.error("Error during user profile deletion:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
