import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/greencart`);

    console.log("Database Connected ✅");

  } catch (err) {
    console.error("Error in Mongo Connection:", err.message);
    process.exit(1); // stop server if DB fails
  }
};