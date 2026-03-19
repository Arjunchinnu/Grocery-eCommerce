import express from "express";
import {
  getAllOrders,
  getOrders,
  placeOrder,
  placeOrderStripe,
  stripeWebhook,
} from "../controllers/orderController.js";
import { protect, protectSeller } from "../middleware/authUser.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post("/cod", protect, placeOrder);

router.get("/user", protect, getOrders);

router.get("/seller", protectSeller, authorizeRoles("seller"), getAllOrders);

router.post("/stripe", protect, placeOrderStripe);

// router.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   stripeWebhook,
// );

export default router;
