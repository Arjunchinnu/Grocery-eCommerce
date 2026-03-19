import express from "express";
import { upload } from "../configs/multer.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";
import { protectSeller } from "../middleware/authUser.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/productController.js";

const router = express.Router();

// Seller-protected routes
router.post(
  "/add",
  protectSeller, // attach req.user
  upload.array("images"), // handle files
  authorizeRoles("seller"),
  addProduct,
);

router.post("/stock", protectSeller, authorizeRoles("seller"), changeStock);

// Public routes
router.get("/list", productList);
router.get("/id/:id", productById);

export default router;
