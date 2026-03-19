// // seedProducts.js
// import mongoose from "mongoose";
// import axios from "axios";
// import dotenv from "dotenv";
// import Product from "./models/Product.js"; // your product schema

// dotenv.config();

// // ===== CONFIG =====
// const MONGO_URI = process.env.MONGO_URL; // Mongo Atlas URI
// const PEXELS_API_KEY = process.env.PEXEL_API_KEY; // Pexels API Key
// console.log("Mongo URI ", MONGO_URI);
// console.log("Pexels API Key ", PEXELS_API_KEY);

// // ===== CONNECT TO MONGO =====
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));
// // ===== PRODUCTS BY CATEGORY =====
// const categories = {
//   Vegetables: ["Tomato", "Potato", "Carrot", "Onion", "Cucumber"],
//   Fruits: ["Apple", "Banana", "Orange", "Mango", "Grapes"],
//   Dairy: ["Milk", "Cheese", "Butter", "Yogurt", "Cream"],
//   Bakery: ["Bread", "Cake", "Croissant", "Donut", "Bagel"],
//   Drinks: ["Coffee", "Tea", "Juice", "Soda", "Water"],
//   Grains: ["Rice", "Wheat", "Oats", "Pasta", "Quinoa"],
//   Nuts: ["Almonds", "Cashews", "Walnuts", "Peanuts", "Pistachios"],
// };

// // ===== FETCH IMAGES FROM PEXELS =====
// async function fetchImages(keyword, perPage = 3) {
//   try {
//     const response = await axios.get("https://api.pexels.com/v1/search", {
//       headers: { Authorization: PEXELS_API_KEY },
//       params: { query: keyword, per_page: perPage },
//     });
//     return response.data.photos.map((photo) => photo.src.medium);
//   } catch (err) {
//     console.error(`Error fetching images for ${keyword}:`, err.message);
//     return [];
//   }
// }

// // ===== INSERT PRODUCTS INTO MONGO =====
// async function insertProducts() {
//   for (const category in categories) {
//     for (const name of categories[category]) {
//       const images = await fetchImages(name, 3); // 3 images per product

//       const product = new Product({
//         name,
//         description: `High quality ${name} from our store`,
//         price: Math.floor(Math.random() * 100) + 10, // random price 10-110
//         offerPrice: Math.floor(Math.random() * 50) + 5, // random offerPrice 5-55
//         images,
//         category,
//         inStock: true,
//       });

//       await product.save();
//       console.log(`Inserted ${name} in category ${category}`);
//     }
//   }

//   console.log("All products inserted successfully!");
//   mongoose.disconnect();
// }

// // ===== RUN SCRIPT =====
// insertProducts();

// seedInstantProducts.js
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Make sure this path is correct

dotenv.config();

// // ===== CONFIG =====
const MONGO_URI = process.env.MONGO_URL; // Mongo Atlas URI
const PEXELS_API_KEY = process.env.PEXEL_API_KEY; // Pexels API Key
console.log("Mongo URI ", MONGO_URI);
console.log("Pexels API Key ", PEXELS_API_KEY);

// ===== CONNECT TO MONGO =====
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// ===== INSTANT PRODUCTS =====
const instantProducts = [
  "Maggi Noodles",
  "Instant Oats",
  "Instant Soup",
  "Ready-to-eat Pasta",
  "Instant Ramen",
];

// ===== FETCH IMAGES FROM PEXELS =====
async function fetchImages(keyword, perPage = 3) {
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      headers: { Authorization: process.env.PEXEL_API_KEY },
      params: { query: keyword, per_page: perPage },
    });
    return res.data.photos.map((photo) => photo.src.medium);
  } catch (err) {
    console.error(`Error fetching images for ${keyword}:`, err.message);
    return [];
  }
}

// ===== INSERT PRODUCTS INTO MONGO =====
async function insertInstantProducts() {
  for (const name of instantProducts) {
    const images = await fetchImages(name, 3); // 3 images per product

    const product = new Product({
      name,
      description: `High quality ${name} from our store`,
      price: Math.floor(Math.random() * 100) + 10, // Random price 10-110
      offerPrice: Math.floor(Math.random() * 50) + 5, // Random offerPrice 5-55
      images,
      category: "Instant",
      inStock: true,
    });

    await product.save();
    console.log(`Inserted ${name} in category Instant`);
  }

  console.log("All Instant products inserted successfully!");
  mongoose.disconnect();
}

// ===== RUN SCRIPT =====
insertInstantProducts();
