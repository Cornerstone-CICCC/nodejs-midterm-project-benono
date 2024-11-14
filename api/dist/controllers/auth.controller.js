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
exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age, gender, genderPreference } = req.body;
    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        if (age < 18) {
            res.status(400).json({
                success: false,
                message: "You must be at least 18 years old",
            });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
            return;
        }
        const checkUser = user_model_1.default.findByUsername(name);
        if (checkUser) {
            res.status(409).json({ success: false, message: "Username taken" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const user = user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            genderPreference,
        });
        const token = signToken(user.id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevents XSS attacks
            sameSite: "strict", // prevents CSRF attacks
            secure: process.env.NODE_ENV === "production", // https only if in production
        });
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                genderPreference: user.genderPreference,
            },
        });
    }
    catch (error) {
        console.log(`Error in signup controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res
                .status(400)
                .json({ success: false, message: "All fields are required" });
            return;
        }
        const user = user_model_1.default.findByEmail(email);
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const token = signToken(user.id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res
            .status(200)
            .json({ success: true, user, message: "Logged in successfully" });
    }
    catch (error) {
        console.log(`Error in login controller: ${error}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});
exports.logout = logout;
