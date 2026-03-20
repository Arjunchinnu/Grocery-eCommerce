import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { connectDB } from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhook } from "./controllers/orderController.js";
import forgotRouter from "./routes/forgotPassword.js";
//testing
import Order from "./models/Order.js";
import User from "./models/User.js";
const app = express();
const port = process.env.PORT || 4000;

/* STRIPE WEBHOOK (MUST BE BEFORE JSON) */
console.log("🚀 Setting up Stripe webhook route...");
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

//middlewares
app.use(express.json());
app.use(cookieParser());

//cors configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://grocery-ecommerce-client-gz0a.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", forgotRouter);

// Temporary test route to mark order as paid via browser
app.get("/api/test-pay/:orderId/:userId", async (req, res) => {
  const { orderId, userId } = req.params;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    console.log("✅ Test Order updated:", orderId);
    res.json({ success: true, updatedOrder });
  } catch (err) {
    console.log("❌ Test pay error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Failed to connect DB. Server not started.");
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("API is working");
});
