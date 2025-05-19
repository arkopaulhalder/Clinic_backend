import express from "express";
import { sendPhoneOTP, verifyPhoneOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendPhoneOTP);
router.post("/verify-otp", verifyPhoneOTP);

export default router;