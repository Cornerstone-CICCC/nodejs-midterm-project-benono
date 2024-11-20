import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types/user";
import { AuthResponse } from "../types/api.response";
import userModel from "../models/user.model";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const signup = async (
  req: Request<{}, {}, Omit<User, "id">>,
  res: Response<AuthResponse>
) => {
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

    const checkUser = userModel.findByUsername(name);
    if (checkUser) {
      res.status(409).json({ success: false, message: "Username taken" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = userModel.create({
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
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<AuthResponse>
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }
    const user = userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response<AuthResponse>) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
