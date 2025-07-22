import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getMessagesBetweenTwoUsers,
  getUserById,
  getUsersForSideBar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/sidebar", protectRoute, getUsersForSideBar);
router.get("/user/:id", protectRoute, getUserById);
router.get("/users/all", protectRoute, getAllUsers);

router.get("/:id", protectRoute, getMessagesBetweenTwoUsers);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
