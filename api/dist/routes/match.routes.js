"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const match_controller_1 = require("../controllers/match.controller");
const router = express_1.default.Router();
router.post("/swipe-right/:likedUserId", auth_1.protectRoute, match_controller_1.swipeRight);
router.post("/swipe-left/:dislikedUserId", auth_1.protectRoute, match_controller_1.swipeLeft);
router.get("/", auth_1.protectRoute, match_controller_1.getMatches);
router.get("/user-profiles", auth_1.protectRoute, match_controller_1.getUserProfiles);
exports.default = router;
