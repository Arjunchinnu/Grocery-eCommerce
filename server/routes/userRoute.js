import express from "express";
import { login, register,getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/data", protect, getUserData);

export default router;
