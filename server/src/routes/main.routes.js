import express from "express";
import authRoutes from "./auth.routes.js";
import messageRoutes from "./message.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/messages", messageRoutes);

export default router;
