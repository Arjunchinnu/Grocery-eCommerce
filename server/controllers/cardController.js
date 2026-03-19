import User from "../models/User.js";

// Update user cart
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { returnDocument: "after" }, // replaces deprecated { new: true }
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Cart updated successfully",
      cartItems: user.cartItems,
    });
  } catch (err) {
    console.log("Error updating cart:", err);

    res.json({
      success: false,
      message: err.message,
    });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartItems: user.cartItems || {},
    });
  } catch (error) {
    console.log("Error fetching cart:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
