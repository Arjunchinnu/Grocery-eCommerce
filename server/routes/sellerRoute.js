import express from "express";
import { loginSeller } from "../controllers/sellerController.js";

const router = express.Router();

router.post("/login", loginSeller);

export default router;
