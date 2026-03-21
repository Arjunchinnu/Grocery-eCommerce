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

  const resetLink = `https://grocery-ecommerce-client-gz0a.onrender.com/reset-password/${token}`;

  // email setup
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // console.log("google passcode ", process.env.APP_PASS_RESET);
  // console.log("google email ", process.env.APP_EMAIL);

  await transporter.sendMail({
    from: `"Streamify" <${process.env.APP_EMAIL}>`,
    to: email,
    subject: "Password Reset",
    html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click below:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
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
