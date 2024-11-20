import express from "express";
import { protectRoute } from "../middleware/auth";
import { updateProfile, deleteUser } from "../controllers/user.controller";
const router = express.Router();

router.put("/update", protectRoute, updateProfile);
router.delete("/delete", protectRoute, deleteUser);
export default router;
