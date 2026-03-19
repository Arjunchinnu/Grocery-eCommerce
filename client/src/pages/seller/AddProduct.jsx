import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContent";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    offerPrice: "",
    files: [],
  });

  const { axios } = useAppContext();

  // Handle image change
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...formData.files];
    updatedFiles[index] = file;

    setFormData({ ...formData, files: updatedFiles });
  };

  // Handle text & select inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Prepare FormData
      const submitData = new FormData();

      // Wrap product info as JSON string
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        offerPrice: formData.offerPrice,
      };
      submitData.append("productData", JSON.stringify(productData));

      // Append images
      formData.files.forEach((file) => {
        if (file) submitData.append("images", file);
      });

      // 2️⃣ Get seller token from localStorage
      const seller = JSON.parse(localStorage.getItem("seller") || "{}");
      const token = seller?.token;
      if (!token) {
        toast.error("Seller not logged in");
        return;
      }

      // 3️⃣ Send request with Authorization header
      const { data } = await axios.post("/api/product/add", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 4️⃣ Handle response
      if (data?.success) {
        toast.success(data.message || "Product added successfully");

        // Clear form after submission
        setFormData({
          name: "",
          description: "",
          category: "",
          price: "",
          offerPrice: "",
          files: [],
        });
      } else {
        toast.error(data?.message || "Failed to add product");
      }
    } catch (err) {
      if (err.response) {
        toast.error(
          err.response.data?.message || "Server error while adding product",
        );
      } else {
        toast.error("Network error. Please try again.");
      }
      console.log("Error in add product submit handler:", err);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      formData.files[index]
                        ? URL.createObjectURL(formData.files[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, idx) => (
              <option key={idx} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="price">
              Product Price
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offerPrice">
              Offer Price
            </label>
            <input
              id="offerPrice"
              type="number"
              value={formData.offerPrice}
              onChange={handleChange}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <button className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
