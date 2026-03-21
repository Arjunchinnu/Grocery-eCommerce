import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email ", email);

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  // create token
  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetLink = `https://grocery-ecommerce-gp5s.onrender.com/reset-password/${token}`;

  // email setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS_RESET,
    },
  });

  // console.log("google passcode ", process.env.APP_PASS_RESET);
  // console.log("google email ", process.env.APP_EMAIL);

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `Click here to reset password: <a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({
    success: true,
    message: "Reset link sent to email",
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.json({ success: false, message: "Token expired" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({
    success: true,
    message: "Password reset successful",
  });
};
