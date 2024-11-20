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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateProfile = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const user_model_1 = __importDefault(require("../models/user.model"));
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // image => cloudinary -> image.cloudinary.yourImageUrl
    try {
        const _a = req.body, { image } = _a, otherData = __rest(_a, ["image"]);
        let updatedData = otherData;
        if (image) {
            // base64 format
            if (image.startsWith("data:image")) {
                try {
                    const result = yield cloudinary_1.default.uploader.upload(image);
                    updatedData.image = result.secure_url;
                }
                catch (error) {
                    console.error(`Error in cloudinary upload: ${error}`);
                    res
                        .status(500)
                        .json({ success: false, message: "Internal server error" });
                    return;
                }
            }
        }
        const updatedUser = user_model_1.default.edit(req.user.id, updatedData);
        res.status(200).json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.log(`Error in updateProfile controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = user_model_1.default.delete(req.user.id);
    if (!deletedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User deleted successfully" });
});
exports.deleteUser = deleteUser;
