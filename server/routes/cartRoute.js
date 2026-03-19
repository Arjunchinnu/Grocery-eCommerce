import express from "express";
import { authorizeRoles } from "../middleware/authorizeRole.js";
import { updateCart, getCart } from "../controllers/cardController.js";
import { protect } from "../middleware/authUser.js";
const router = express.Router();

router.post("/update", protect, updateCart);
router.post("/get", protect, getCart);

export default router;
