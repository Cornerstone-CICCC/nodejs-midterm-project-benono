"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/send", auth_1.protectRoute, message_controller_1.sendMessage);
router.get("/conversation/:muserId", auth_1.protectRoute, message_controller_1.getConversation);
exports.default = router;
