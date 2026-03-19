import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContent";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { product, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProduct] = useState([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProduct(
        product.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredProduct(product);
    }
  }, [product, searchQuery]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {filteredProducts
          .filter((item) => item.inStock)
          .map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
