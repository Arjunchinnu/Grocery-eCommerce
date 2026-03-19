import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token || !user) return toast.error("User not authenticated");

      // Await the Axios GET request
      const { data } = await axios.get("/api/order/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: user._id,
        },
      });

      if (data.success) {
        setMyOrders(data.orders);
        console.log("Orders fetched successfully:", myOrders);
      } else {
        toast.error("Failed to fetch orders");
        console.log("Failed to fetch orders:", data.message);
      }
      console.log("Fetch orders response:");
    } catch (err) {
      console.log("Error fetching orders", err);
      toast.error("Error fetching orders");
    }
  };

  // Run only once
  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  //   return (
  //     <div className="mt-16 pb-16">
  //       <div className="flex flex-col items-end w-max mb-8">
  //         <p className="text-2xl font-medium uppercase">My Orders</p>
  //         <div className="w-16 h-0.5 bg-primary rounded-full"></div>
  //       </div>

  //       {myOrders.map((order, idx) => (
  //         <div
  //           key={idx}
  //           className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
  //         >
  //           <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
  //             <span>OrderId : {order._id}</span>
  //             <span>Payment : {order.paymentType}</span>
  //             <span>
  //               Total Amount : {currency} {order.amount}
  //             </span>
  //           </p>

  //           {order.items &&
  //             order.items.map((item, index) => (
  //               <div
  //                 key={index}
  //                 className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
  //               >
  //                 <div className="flex items-center mb-4 md:mb-0">
  //                   <div className="bg-primary/10 p-4 rounded-lg">
  //                     <img
  //                       src={item.product.image[0]}
  //                       alt="product"
  //                       className="w-16 h-16"
  //                     />
  //                   </div>

  //                   <div className="ml-4">
  //                     <h2 className="text-xl font-medium text-gray-800">
  //                       {item.product.name}
  //                     </h2>
  //                     <p>Category: {item.product.category}</p>
  //                   </div>
  //                 </div>

  //                 <div className="text-primary text-lg font-medium flex justify-between items-center w-full">
  //                   <div className="">
  //                     <p>Quantity: {item.quantity || 1}</p>
  //                     <p>Status: {item.status}</p>
  //                     <p>
  //                       Date: {new Date(order.createdAt).toLocaleDateString()}
  //                     </p>
  //                   </div>
  //                   <div className="flex">
  //                     <p className="text-primary text-lg font-medium">
  //                       Amount: {currency}{" "}
  //                       {item.product.offerPrice * (item.quantity || 1)}
  //                     </p>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //         </div>
  //       ))}
  //     </div>
  //   );

  return (
    <div className="mt-16 pb-20 px-4">
      {/* Header */}
      <div className="mb-10">
        <p className="text-3xl font-semibold text-gray-800">
          My <span className="text-primary">Orders</span>
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {myOrders.map((order, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-xl mb-10 p-6 border border-gray-200 max-w-5xl"
        >
          {/* Order Top Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-6 text-gray-600 font-medium gap-2">
            <p>
              <span className="text-gray-800 font-semibold">Order ID:</span>{" "}
              {order._id}
            </p>
            <p>
              <span className="text-gray-800 font-semibold">Payment:</span>{" "}
              {order.paymentType}
            </p>
            <p className="text-lg text-primary font-semibold">
              Total: {currency}
              {order.amount}
            </p>
          </div>

          {/* Order Items */}
          {order.items?.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-5 ${
                order.items.length !== index + 1 ? "border-b" : ""
              }`}
            >
              {/* Product Info */}
              <div className="flex items-center gap-5">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Category: {item.product.category}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 text-sm md:text-base text-gray-700">
                <p>
                  <span className="font-medium">Qty:</span> {item.quantity || 1}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {item.status}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-primary font-semibold text-lg">
                  Amount : {currency}{" "}
                  {item.product.offerPrice * (item.quantity || 1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
