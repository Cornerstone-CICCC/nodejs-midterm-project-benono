import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.server";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import matchRoutes from "./routes/match.routes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT: number = Number(process.env.PORT) || 3500;

initializeSocket(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
//app.use("/api/messages", messageRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // connect to database
  //connectDB();
});
