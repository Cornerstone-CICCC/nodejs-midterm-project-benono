import express from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
