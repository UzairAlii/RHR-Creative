import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "products",
    });
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

export default connectCloudinary;