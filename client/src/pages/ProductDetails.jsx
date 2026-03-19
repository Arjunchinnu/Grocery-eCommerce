import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContent";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { product, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  // Always define individualProduct (hook order remains stable)
  const individualProduct = product?.find((item) => item._id === id);

  useEffect(() => {
    if (individualProduct) {
      // Set the first image as default thumbnail
      setThumbnail(individualProduct.images?.[0] || null);

      // Get related products
      const related = product
        ?.filter(
          (item) =>
            item.category?.toLowerCase() ===
              individualProduct.category?.toLowerCase() &&
            item._id !== individualProduct._id,
        )
        .slice(0, 5);

      setRelatedProducts(related || []);
    }
  }, [product, individualProduct]);

  // Render different states safely
  if (!product) {
    return <p className="text-primary">Loading products...</p>;
  }

  if (!individualProduct) {
    return <p className="text-primary">Product not found</p>;
  }

  return (
    <div className="mt-12">
      {/* Breadcrumbs */}
      <p>
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${individualProduct.category?.toLowerCase()}`}>
          {individualProduct.category}
        </Link>{" "}
        / <span className="text-primary">{individualProduct.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Images */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {individualProduct.images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500 p-4">No image available</p>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{individualProduct.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-4 w-3.5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          {/* Pricing */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}
              {individualProduct.price}
            </p>
            <p className="text-2xl font-medium">
              MRP: {currency}
              {individualProduct.offerPrice}
            </p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          {/* Description */}
          {/* <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {individualProduct.description?.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul> */}

          <p className="text-gray-500/70 mt-2">
            {individualProduct.description}
          </p>

          {/* Buttons */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(individualProduct._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(individualProduct._id);
                navigate("/cart");
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* related products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 w-full">
          {relatedProducts
            .filter((item) => item.inStock)
            .map((item, idx) => (
              <ProductCard key={idx} product={item} />
            ))}
        </div>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
