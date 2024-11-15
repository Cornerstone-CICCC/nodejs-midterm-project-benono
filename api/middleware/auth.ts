import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

interface JwtPayload {
  id: string;
}

export async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies.token;
    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token" });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
      return;
    }
    const currentUser = await UserModel.findById(decoded.id as string);
    if (!currentUser) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
      return;
    }
    const { password, ...userWithoutPassword } = currentUser;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.log(`Error in protectRoute middleware: ${error}`);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
}
