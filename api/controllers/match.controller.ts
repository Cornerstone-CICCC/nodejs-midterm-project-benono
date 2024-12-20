import { Request, Response } from "express";
import User from "../models/user.model";
import { getIO, getConnectedUsers } from "../socket/socket.server";

export const swipeRight = async (req: Request, res: Response) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user!.id);
    if (!currentUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const likedUser = await User.findById(likedUserId);
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
        const connectedUsers = getConnectedUsers();
        const likedUserSocketId = connectedUsers.get(likedUserId);

        if (likedUserSocketId) {
          getIO().to(likedUserSocketId).emit("new-match", {
            id: currentUser.id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }
        console.log(`likedUser: ${JSON.stringify(likedUser)}`);
        const currentUserSocketId = connectedUsers.get(currentUser.id);
        if (currentUserSocketId) {
          getIO().to(currentUserSocketId).emit("new-match", {
            id: likedUser.id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.error(`Error in swipeRight controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const swipeLeft = async (req: Request, res: Response) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user!.id);
    if (!currentUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.error(`Error in swipeLeft controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    // get all users that matched the user and filter fields
    const matches = User.findByMatch(user.matches)?.map((user) => ({
      id: user.id,
      name: user.name,
      image: user.image,
    }));

    res.status(200).json({ success: true, matches });
  } catch (error) {
    console.error(`Error in getMatches controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfiles = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.user!.id);

    const users = User.findAll()
      .filter((user) => user.id !== currentUser?.id)
      .filter((user) => !currentUser?.matches.includes(user.id))
      .filter((user) => !currentUser?.likes.includes(user.id))
      .filter((user) => !currentUser?.dislikes.includes(user.id))
      .filter((user) => user.genderPreference === currentUser?.gender)
      .filter((user) => currentUser?.genderPreference === user.gender)
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
  } catch (error) {
    console.error(`Error in getMatches controller: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
