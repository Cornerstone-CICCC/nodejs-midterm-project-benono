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
exports.getUserProfiles = exports.getMatches = exports.swipeLeft = exports.swipeRight = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const socket_server_1 = require("../socket/socket.server");
const swipeRight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { likedUserId } = req.params;
        const currentUser = yield user_model_1.default.findById(req.user.id);
        if (!currentUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const likedUser = yield user_model_1.default.findById(likedUserId);
        if (!likedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            // if the liked user also liked the current user, then it's a matc
            if (likedUser.likes.includes(currentUser.id)) {
                currentUser.matches.push(likedUserId);
                likedUser.matches.push(currentUser.id);
                // send notification to both users in realtime with socket.io
                const connectedUsers = (0, socket_server_1.getConnectedUsers)();
                const likedUserSocketId = connectedUsers.get(likedUserId);
                if (likedUserSocketId) {
                    (0, socket_server_1.getIO)().to(likedUserSocketId).emit("new-match", {
                        id: currentUser.id,
                        name: currentUser.name,
                        image: currentUser.image,
                    });
                }
                console.log(`likedUser: ${JSON.stringify(likedUser)}`);
                const currentUserSocketId = connectedUsers.get(currentUser.id);
                if (currentUserSocketId) {
                    (0, socket_server_1.getIO)().to(currentUserSocketId).emit("new-match", {
                        id: likedUser.id,
                        name: likedUser.name,
                        image: likedUser.image,
                    });
                }
            }
        }
        res.status(200).json({ success: true, user: currentUser });
    }
    catch (error) {
        console.error(`Error in swipeRight controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.swipeRight = swipeRight;
const swipeLeft = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dislikedUserId } = req.params;
        const currentUser = yield user_model_1.default.findById(req.user.id);
        if (!currentUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId);
        }
        res.status(200).json({ success: true, user: currentUser });
    }
    catch (error) {
        console.error(`Error in swipeLeft controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.swipeLeft = swipeLeft;
const getMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // get all users that matched the user and filter fields
        const matches = (_a = user_model_1.default.findByMatch(user.matches)) === null || _a === void 0 ? void 0 : _a.map((user) => ({
            id: user.id,
            name: user.name,
            image: user.image,
        }));
        res.status(200).json({ success: true, matches });
    }
    catch (error) {
        console.error(`Error in getMatches controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getMatches = getMatches;
const getUserProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_model_1.default.findById(req.user.id);
        const users = user_model_1.default.findAll()
            .filter((user) => user.id !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id))
            .filter((user) => !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.matches.includes(user.id)))
            .filter((user) => !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.likes.includes(user.id)))
            .filter((user) => !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.dislikes.includes(user.id)))
            .filter((user) => user.genderPreference === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.gender))
            .filter((user) => (currentUser === null || currentUser === void 0 ? void 0 : currentUser.genderPreference) === user.gender)
            .map((user) => ({
            id: user.id,
            name: user.name,
            image: user.image,
            age: user.age,
            bio: user.bio,
            gender: user.gender,
            genderPreference: user.genderPreference,
            likes: user.likes,
            dislikes: user.dislikes,
            matches: user.matches,
        }));
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        console.error(`Error in getMatches controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getUserProfiles = getUserProfiles;
