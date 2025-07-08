import mongoose from "mongoose";

const specsSchema = new mongoose.Schema({
  material: String,
  compat: String,
  texture: String,
  closure: String,
  compartment: String,
  zips: String,
  strap: String,
  length: String,
  width: String,
  height: String,
  weight: String,
}, { _id: false });

const colorImagesSchema = new mongoose.Schema({
  color: String,
  images: [String], 
}, { _id: false });

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  wholesalePrice: { type: Number, default: 0 },
  colors: [String],
  colorImages: [colorImagesSchema], 
  category: { type: String, required: true },
  stock: { type: Boolean, default: true },
  bestSeller: { type: Boolean, default: false },
  para: { type: String },
  specs: specsSchema,
  date: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;