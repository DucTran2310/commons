import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

export { app };