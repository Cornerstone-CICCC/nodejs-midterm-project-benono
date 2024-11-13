import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import { User } from "../types/user";
import jwt from "jsonwebtoken";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const signup = async (
  req: Request<{}, {}, Omit<User, "id">>,
  res: Response
) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  if (!name || !email || !password || !age || !gender || !genderPreference) {
    res.status(404).json({
      success: false,
      message: "All fields are required",
    });
    return;
  }
  if (age < 18) {
    res.status(404).json({
      success: false,
      message: "You must be at least 18 years old",
    });
    return;
  }

  if (password.length < 8) {
    res.status(404).json({
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
    user,
  });
};

export const login = async (req: Request, res: Response) => {
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
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully " });
};
