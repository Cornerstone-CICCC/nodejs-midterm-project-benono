"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3500;
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("api/users");
app.use("api/matches");
app.use("api/messages");
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
