import mongoose from "mongoose";
import { env } from "@/config/envValidation";

export const connectToDatabase = async () => {
  try {
    const mongoURI = env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
