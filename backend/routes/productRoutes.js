import express from "express"
import { addProduct, removeProduct, singleProduct, listProduct, editProduct } from "../controllers/productControllers.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

const imageFields = Array.from({length: 16}, (_, i) => ({ name: `image${i+1}`, maxCount: 1 }));

productRouter.post("/add", adminAuth, upload.fields(imageFields), addProduct)
productRouter.post("/remove", adminAuth, upload.fields([]), removeProduct)
productRouter.post("/single", singleProduct)
productRouter.get("/list", listProduct)
productRouter.post("/edit", adminAuth, upload.fields(imageFields), editProduct);

export default productRouter;