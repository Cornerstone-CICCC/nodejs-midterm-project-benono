import express from "express";
import {
  sendMessage,
  getConversation,
} from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth";

const router = express.Router();

router.post("/send", protectRoute, sendMessage);
router.get("/conversation/:muserId", protectRoute, getConversation);

export default router;
