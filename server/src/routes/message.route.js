import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessagesBetweenTwoUsers,
  getUserById,
  getUsersForSideBar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/sidebar", protectRoute, getUsersForSideBar);
router.get("/user/:id", protectRoute, getUserById);

router.get("/:id", protectRoute, getMessagesBetweenTwoUsers);
router.post("/send/:id", sendMessage);

export default router;
