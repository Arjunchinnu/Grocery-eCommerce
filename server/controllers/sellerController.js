// seller login
import jwt from "jsonwebtoken";

export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Check seller credentials from .env
    if (
      email !== process.env.SELLER_EMAIL ||
      password !== process.env.SELLER_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid seller credentials",
      });
    }

    // Generate token
    const token = jwt.sign({ role: "seller" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Seller login successful",
      token,
      seller: {
        email: process.env.SELLER_EMAIL,
        role: "seller",
      },
    });
  } catch (err) {
    console.error("Seller login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
