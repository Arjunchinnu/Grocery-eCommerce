import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import fs from "fs"; // <-- make sure you import this

//add product
// export const addProduct = async (req, res) => {
//   try {
//     const productData = JSON.parse(req.body.productData);
//     const images = req.files;

//     const imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         const result = await cloudinary.uploader.upload(item.path, {
//           resource_type: "image",
//         });
//         return result.secure_url;
//       }),
//     );

//     // Add image URLs to product data
//     productData.images = imagesUrl;

//     // Save to DB (example)
//     const newProduct = new Product(productData);
//     await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "Product Added Successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Error adding product" });
//   }
// };

export const addProduct = async (req, res) => {
  try {
    // Parse product data from frontend
    const productData = JSON.parse(req.body.productData);

    // Upload images to Cloudinary and remove local files
    const imagesUrl = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        fs.unlinkSync(file.path); // remove temp file
        return result.secure_url;
      }),
    );

    // Add image URLs to product data
    productData.images = imagesUrl;

    // Save product to DB
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

//get product
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.log("error in productlist ", err.message);
    res.json({ success: false, message: err.message });
  }
};

// product by id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.log("error in productlist ", err.message);
    res.json({ success: false, message: err.message });
  }
};

//change stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { inStock });
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.log("error in productlist ", err.message);
    res.json({ success: false, message: err.message });
  }
};
