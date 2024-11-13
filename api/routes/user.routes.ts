import express from "express";
import { protectRoute } from "../middleware/auth";
import { updateProfile } from "../controllers/user.controller";
const router = express.Router();

router.put("/:id", protectRoute, updateProfile);

export default router;
