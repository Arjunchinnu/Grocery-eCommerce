import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }, // changed to String
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: { type: [String], required: true }, // changed key to 'images' and array of strings
    category: { type: String, required: true }, // changed to String
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("product", productSchema);

export default Product;
