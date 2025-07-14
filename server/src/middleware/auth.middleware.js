import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes
// This middleware checks if the user is authenticated by verifying the JWT token.
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token! Please login again.",
      });
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "Unauthorized! User not found!",
      });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};
