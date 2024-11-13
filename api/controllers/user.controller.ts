import cloudinary from "../config/cloudinary";
import User from "../models/user.model";
import { Request, Response } from "express";

export const updateProfile = async (req: Request, res: Response) => {
  // image => cloudinary -> image.cloudinary.yourImageUrl
  try {
    const { image, ...otherData } = req.body;

    let updatedData = otherData;

    if (image) {
      // base64 format
      if (image.startsWith("data:image")) {
        try {
          const result = await cloudinary.uploader.upload(image);
          updatedData.image = result.secure_url;
        } catch (error) {
          console.error(`Error in cloudinary upload: ${error}`);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
          return;
        }
      }
    }

    const updatedUser = User.edit(req.user!.id, updatedData);

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(`Error in updateProfile controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
