import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContentProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [product, setProduct] = useState([]);
  const [cardItems, setCardItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [cartLoaded, setCartLoaded] = useState(false);

  // Fetch seller status
  const fetchSeller = () => {
    const seller = localStorage.getItem("seller");
    if (!seller) return null;
    return JSON.parse(seller);
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
        setCardItems(data.user.cardItems || {});
      }
    } catch (err) {
      console.log("Error fetching user data", err);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProduct(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Add to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cardItems || {});

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCardItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart item
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cardItems || {});
    cartData[itemId] = quantity;

    setCardItems(cartData);
    toast.success("Cart updated");
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cardItems || {});

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    setCardItems(cartData);
    toast.success("Removed from cart");
  };

  // Cart count
  const getCartCount = () => {
    let total = 0;

    for (const item in cardItems) {
      total += cardItems[item];
    }

    return total;
  };

  // Cart amount
  const getCartAmt = () => {
    let totalAmt = 0;

    for (const itemId in cardItems) {
      const itemInfo = product.find(
        (item) => String(item._id) === String(itemId),
      );

      if (itemInfo && cardItems[itemId] > 0) {
        totalAmt += itemInfo.offerPrice * cardItems[itemId];
      }
    }

    return Number(totalAmt.toFixed(2));
  };

  // Sync cart with backend
  useEffect(() => {
    const updateCart = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token || !user) return;

        await axios.post(
          "/api/cart/update",
          { cartItems: cardItems },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.log("Cart update error:", err);
      }
    };

    if (user && cartLoaded) {
      updateCart();
    }
  }, [cardItems]);

  // Get cart after user loads
  const getUserCart = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token || !user) return;

      const { data } = await axios.post(
        "/api/cart/get",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setCardItems(data.cartItems || {});
        setCartLoaded(true);
      } else {
        console.log("Failed to get cart:", data.message);
      }
    } catch (err) {
      console.log("Get cart error", err);
    }
  };

  const placeOrder = async () => {
    console.log("order placed");
    try {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      //place order with COD

      if (paymentOption === "COD") {
        const { data } = await axios.post(
          "/api/order/place",
          {
            userId: user._id,
            item: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
              address: selectedAddress._id,
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );
      }
    } catch (err) {
      console.log("Error placing order", err);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getUserCart();
    }
  }, [user]);

  useEffect(() => {
    const seller = fetchSeller();

    setIsSeller(!!seller?.token);

    fetchUserData();
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    product,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cardItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmt,
    axios,
    fetchProducts,
    setCardItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
