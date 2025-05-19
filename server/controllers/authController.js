// controllers/authController.js
import { User } from "../models/userModel.js";
import { sendOTP } from "../utils/twilio.js";

export const sendPhoneOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    let user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first."
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save({ validateBeforeSave: false });
    
    await sendOTP(phone, verificationCode);

    res.status(200).json({
      success: true,
      message: "OTP sent to registered phone number"
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPhoneOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    const user = await User.findOne({
      phone,
      verificationCode: code,
      verificationCodeExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or expired"
      });
    }

    user.accountVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};