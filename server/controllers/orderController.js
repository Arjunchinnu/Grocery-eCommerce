// import Order from "../models/Order.js";
// import Product from "../models/Product.js";
// import Stripe from "stripe";
// import User from "../models/User.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // PLACE ORDER (COD)
// export const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;

//     if (!userId || !items || !address || items.length === 0) {
//       return res.json({ success: false, message: "All fields are required" });
//     }

//     const orderItems = await Promise.all(
//       items.map(async (item) => {
//         const product = await Product.findById(item.productId);

//         if (!product) {
//           throw new Error(`Product not found: ${item.productId}`);
//         }

//         return {
//           product: item.productId,
//           quantity: item.quantity,
//           price: product.offerPrice,
//         };
//       }),
//     );

//     let amount = orderItems.reduce(
//       (acc, item) => acc + item.quantity * item.price,
//       0,
//     );

//     // 2% tax
//     amount += Math.floor(amount * 0.02);

//     await Order.create({
//       userId,
//       items: orderItems.map(({ product, quantity }) => ({
//         product,
//         quantity,
//       })),
//       amount,
//       address,
//       paymentType: "cod",
//       isPaid: false,
//     });

//     res.json({ success: true, message: "Order placed successfully" });
//   } catch (err) {
//     console.log("error in place order controller", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };

// // PLACE ORDER WITH STRIPE
// export const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;
//     const { origin } = req.headers;

//     if (!userId || !items || !address || items.length === 0) {
//       return res.json({ success: false, message: "All fields are required" });
//     }

//     // Fetch products and prepare order items
//     const orderItems = await Promise.all(
//       items.map(async (item) => {
//         const product = await Product.findById(item.productId);

//         if (!product) {
//           throw new Error(`Product not found: ${item.productId}`);
//         }

//         return {
//           product: item.productId,
//           quantity: item.quantity,
//           price: product.offerPrice,
//           name: product.name,
//         };
//       }),
//     );

//     // Stripe line items (price in paise)
//     const line_items = orderItems.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100, // convert ₹ → paise
//       },
//       quantity: item.quantity,
//     }));

//     // Calculate order amount
//     let amount = orderItems.reduce(
//       (acc, item) => acc + item.quantity * item.price,
//       0,
//     );

//     // Add 2% tax
//     amount += Math.floor(amount * 0.02);

//     // Stripe minimum validation
//     if (amount < 50) {
//       return res.json({
//         success: false,
//         message: "Minimum order amount for online payment is ₹50",
//       });
//     }

//     // Create order in DB
//     const order = await Order.create({
//       userId,
//       items: orderItems.map(({ product, quantity }) => ({
//         product,
//         quantity,
//       })),
//       amount,
//       address,
//       paymentType: "online",
//       isPaid: false,
//     });

//     // Create Stripe session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${origin}/loader?next=my-orders`,
//       cancel_url: `${origin}/cart`,
//       metadata: {
//         orderId: order._id.toString(),
//         userId: userId.toString(),
//       },
//     });

//     res.json({
//       success: true,
//       url: session.url, // frontend uses data.url
//     });
//   } catch (err) {
//     console.log("error in stripe order controller", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };

// // GET USER ORDERS
// export const getOrders = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     const orders = await Order.find({
//       userId,
//       $or: [{ paymentType: "cod" }, { isPaid: true }],
//     })
//       .populate("items.product")
//       .populate("address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.log("error in get orders controller", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };

// //strip webhook handler to update order payment status

// export const stripeWebhook = async (req, res) => {
//   try {
//     console.log("🔥 WEBHOOK HIT");
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body, // ⚠️ must be raw body
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET,
//       );
//     } catch (err) {
//       console.log("Stripe webhook signature verification failed:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     switch (event.type) {
//       // case "checkout.session.completed": {
//       //   const session = event.data.object;
//       //   const { orderId, userId } = session.metadata;

//       //   if (orderId && userId) {
//       //     // Mark order paid
//       //     await Order.findByIdAndUpdate(orderId, { isPaid: true });

//       //     // Clear user cart
//       //     await User.findByIdAndUpdate(userId, { cartItems: {} });
//       //   }

//       //   break;
//       // }

//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;

//         console.log("🔥 PAYMENT SUCCESS:", paymentIntent.id);

//         // You need to fetch session to get metadata
//         const sessions = await stripe.checkout.sessions.list({
//           payment_intent: paymentIntent.id,
//         });

//         const session = sessions.data[0];

//         if (!session) {
//           console.log("❌ No session found");
//           break;
//         }

//         const { orderId, userId } = session.metadata;

//         await Order.findByIdAndUpdate(orderId, { isPaid: true });
//         await User.findByIdAndUpdate(userId, { cartItems: {} });

//         console.log("✅ Order updated:", orderId);
//         break;
//       }
//       default:
//         console.log(`Unhandled Stripe event: ${event.type}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (err) {
//     console.error("Error processing Stripe webhook:", err);
//     res.status(500).send();
//   }
// };

// // GET ALL ORDERS (SELLER / ADMIN)
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "cod" }, { isPaid: true }],
//     })
//       .populate("items.product")
//       .populate("address")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, orders });
//   } catch (err) {
//     console.log("error in get all orders controller", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE ORDER (COD)
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !items || !address || items.length === 0) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        return {
          product: item.productId,
          quantity: item.quantity,
          price: product.offerPrice,
        };
      }),
    );

    let amount = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items: orderItems.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      amount,
      address,
      paymentType: "cod",
      isPaid: false,
    });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.log("error in place order controller", err.message);
    res.json({ success: false, message: err.message });
  }
};

// PLACE ORDER WITH STRIPE
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !items || !address || items.length === 0) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        return {
          product: item.productId,
          quantity: item.quantity,
          price: product.offerPrice,
          name: product.name,
        };
      }),
    );

    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    let amount = orderItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    amount += Math.floor(amount * 0.02);

    if (amount < 50) {
      return res.json({
        success: false,
        message: "Minimum order amount for online payment is ₹50",
      });
    }

    const order = await Order.create({
      userId,
      items: orderItems.map(({ product, quantity }) => ({
        product,
        quantity,
      })),
      amount,
      address,
      paymentType: "online",
      isPaid: false,
    });

    // ✅ IMPORTANT FIX: use env URL instead of origin
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `https://grocery-ecommerce-client-gz0a.onrender.com/loader?next=my-orders`,
      cancel_url: `https://grocery-ecommerce-client-gz0a.onrender.com/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.log("error in stripe order controller", err.message);
    res.json({ success: false, message: err.message });
  }
};

// GET USER ORDERS
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "cod" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log("error in get orders controller", err.message);
    res.json({ success: false, message: err.message });
  }
};

// STRIPE WEBHOOK
export const stripeWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK HIT");

  try {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log("❌ Signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("👉 Event:", event.type);

    // ✅ FINAL WORKING EVENT
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      console.log("💰 Payment success:", paymentIntent.id);

      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const session = sessions.data[0];

      if (!session) {
        console.log("❌ No session found");
        return res.status(200).json({ received: true });
      }

      const { orderId, userId } = session.metadata;

      if (orderId && userId) {
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        console.log("✅ Order updated:", orderId);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send();
  }
};

// GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "cod" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log("error in get all orders controller", err.message);
    res.json({ success: false, message: err.message });
  }
};
