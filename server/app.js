import express from "express";
import mongoose, { connect, connection } from "mongoose";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandler, { errorMiddleware } from "./middlewares/error";
import { connectDB } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";

export const app = express();
config({ path: "./config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

app.use(errorMiddleware);

connectDB();

app.use("/api/v1/auth", authRoutes);
