import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        // 400 Bad Request
        success: false,
        message: "Missing details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        // 409 Conflict
        success: false,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      // 201 Created
      success: true,
      user: { email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Error in register controller", err);
    return res.status(500).json({
      // 500 Internal Server Error
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        // 400 Bad Request
        success: false,
        message: "Invalid email or password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        // 401 Unauthorized
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        // 401 Unauthorized
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      // 200 OK
      success: true,
      user: { email: existingUser.email, name: existingUser.name },
      token,
    });
  } catch (err) {
    console.error("Error in login controller", err);
    return res.status(500).json({
      // 500 Internal Server Error
      success: false,
      message: "Server error",
    });
  }
};

//getuser data

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
