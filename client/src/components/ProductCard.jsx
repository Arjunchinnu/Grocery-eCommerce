import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContent";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cardItems, navigate } =
    useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`,
          );
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <div className="w-32 h-32 md:w-36 md:h-36 overflow-hidden rounded-md flex items-center justify-center">
            <img
              className="group-hover:scale-105 transition object-cover w-full h-full"
              src={product.images?.[0]}
              alt={product.name}
            />
          </div>
        </div>

        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>

          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>

          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:h-3.5 w-3"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="stars"
                />
              ))}
            <p>(4)</p>
          </div>

          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-primary">
              {currency}
              {product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency}a{product.price}
              </span>
            </p>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-primary"
            >
              {!cardItems?.[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[75px] w-[64px] h-[34px] rounded text-primary hover:cursor-pointer w-full"
                  onClick={() => addToCart(product._id)}
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>

                  <span className="w-5 text-center">
                    {cardItems?.[product._id]}
                  </span>

                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
