"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = protectRoute;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
function protectRoute(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (!token) {
                res
                    .status(401)
                    .json({ success: false, message: "Unauthorized - No token" });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                res
                    .status(401)
                    .json({ success: false, message: "Unauthorized - Invalid token" });
                return;
            }
            const currentUser = yield user_model_1.default.findById(decoded.id);
            if (!currentUser) {
                res
                    .status(401)
                    .json({ success: false, message: "Unauthorized - User not found" });
                return;
            }
            req.user = { id: currentUser.id, username: currentUser.name };
            next();
        }
        catch (error) {
            console.log(`Error in protectRoute middleware: ${error}`);
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }
    });
}
