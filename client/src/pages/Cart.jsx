import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const Cart = () => {
  const {
    product,
    currency,
    cardItems,
    removeFromCart,
    updateCartItem,
    navigate,
    getCartAmt,
    getCartCount,
    axios,
    user,
    setCardItems,
  } = useAppContext();

  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loading, setLoading] = useState(false);

  const getCart = () => {
    if (!product.length || !cardItems) return;

    const tempArray = Object.keys(cardItems)
      .map((key) => {
        const item = product.find((p) => String(p._id) === String(key));
        if (item && cardItems[key] > 0) {
          return { ...item, quantity: cardItems[key] };
        }
        return null;
      })
      .filter(Boolean);

    setCartArray(tempArray);
  };

  useEffect(() => {
    if (product.length > 0 && cardItems) getCart();
  }, [product, cardItems]);

  // Fetch user addresses
  const getUserAddresses = async () => {
    if (!user?._id) return;

    try {
      const { data } = await axios.get("/api/address/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        params: { userId: user._id },
      });

      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching addresses");
    }
  };

  useEffect(() => {
    if (user) getUserAddresses();
  }, [user]);

  // Place order
  // const placeOrder = async () => {
  //   try {
  //     if (!selectedAddress) {
  //       toast.error("Please select an address");
  //       return;
  //     }

  //     if (paymentOption === "COD") {
  //       const { data } = await axios.post(
  //         "/api/order/cod",
  //         {
  //           userId: user._id,
  //           address: selectedAddress._id,
  //           items: cartArray.map((item) => ({
  //             productId: item._id,
  //             quantity: item.quantity,
  //           })),
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //           },
  //         },
  //       );

  //       if (data.success) {
  //         toast.success(data.message || "Order placed successfully!");
  //         setCardItems({});
  //         setCartArray([]);
  //         navigate("/my-orders");
  //       } else {
  //         toast.error(data.message || "Failed to place order");
  //       }
  //     } else if (paymentOption === "Online") {
  //       setLoading(true);
  //       const { data } = await axios.post(
  //         "/api/order/stripe",
  //         {
  //           userId: user._id,
  //           address: selectedAddress._id,
  //           items: cartArray.map((item) => ({
  //             productId: item._id,
  //             quantity: item.quantity,
  //           })),
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //           },
  //         },
  //       );

  //       setLoading(true);

  //       if (data.success && data.url) {
  //         window.location.replace(data.url);
  //       } else if (!data.success) {
  //         toast.error(data.message || "Failed to proceed to payment");
  //       }
  //     }
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Error placing order");
  //     console.error("Error placing order:", err);
  //   }
  // };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      // Minimum order 60 check
      if (getCartAmt() < 60) {
        toast.error("Minimum order amount is ₹60");
        return;
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post(
          "/api/order/cod",
          {
            userId: user._id,
            address: selectedAddress._id,
            items: cartArray.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );

        if (data.success) {
          toast.success(data.message || "Order placed successfully!");
          setCardItems({});
          setCartArray([]);
          navigate("/my-orders");
        } else {
          toast.error(data.message || "Failed to place order");
        }
      } else if (paymentOption === "Online") {
        setLoading(true); // ✅ set loading before Axios request

        try {
          const { data } = await axios.post(
            "/api/order/stripe",
            {
              userId: user._id,
              address: selectedAddress._id,
              items: cartArray.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
              })),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            },
          );

          if (data.success && data.url) {
            // give React a tick to render loading
            setTimeout(() => {
              window.location.replace(data.url);
            }, 100); // 100ms delay ensures loading shows
          } else {
            toast.error(data.message || "Failed to proceed to payment");
            setLoading(false);
          }
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Error with Stripe payment",
          );
          setLoading(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error placing order");
      console.error("Error placing order:", err);
      setLoading(false);
    }
  };

  if (!cartArray || cartArray.length === 0) {
    return (
      <div className="text-center py-20 text-primary">Your cart is empty</div>
    );
  }

  const cartTotal = getCartAmt();
  const tax = Number((cartTotal * 0.02).toFixed(2));
  const grandTotal = Number((cartTotal + tax).toFixed(2));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto mt-16">
      {/* LEFT */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center pt-4"
          >
            <div className="flex gap-4 cursor-pointer">
              <img
                onClick={() =>
                  navigate(`/products/${item.category}/${item._id}`)
                }
                src={item.images?.[0]}
                alt={item.name}
                className="w-24 h-24 object-cover border"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500 text-sm">
                  Weight: {item.weight || "N/A"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p>Qty:</p>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItem(item._id, Number(e.target.value))
                    }
                    className="border outline-none"
                  >
                    {Array(item.quantity > 9 ? item.quantity : 9)
                      .fill("")
                      .map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {item.offerPrice * item.quantity}
            </p>

            <button
              onClick={() => removeFromCart(item._id)}
              className="mx-auto text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-8 text-primary font-medium cursor-pointer hover:text-primary-dull"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* RIGHT */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>

          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>

            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {addresses.map((addr) => (
                  <p
                    key={addr._id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addr.street}, {addr.city}, {addr.state}, {addr.country}
                  </p>
                ))}

                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {cartTotal}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>

          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax}
            </span>
          </p>

          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {grandTotal}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
          disabled={loading}
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
