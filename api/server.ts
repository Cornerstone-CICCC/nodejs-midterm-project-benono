import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3500;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("api/users");
app.use("api/matches");
app.use("api/messages");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // connect to database
  //connectDB();
});
