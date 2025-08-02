import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import sendAdminMail from "../helpers/sendAdminMail.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import Product from "../models/productModel.js";

// Add Product
const addProduct = async (req, res) => {
    try {
        const {
            productName,
            price,
            discountPercent,
            wholesalePrice,
            colors,
            category,
            stock,
            bestSeller,
            para,
            material,
            compat,
            texture,
            closure,
            compartment,
            zips,
            strap,
            length,
            width,
            height,
            weight,
        } = req.body;

        const colorArr = JSON.parse(colors);

        let colorImages = [];
        let imageIndex = 1;


        for (let i = 0; i < colorArr.length; i++) {
            let images = [];
            for (let j = 0; j < 4; j++) {
                const fileKey = `image${imageIndex}`;
                if (req.files?.[fileKey]?.[0]) {
                    const buffer = req.files[fileKey][0].buffer;
                    const filename = `product-${Date.now()}-${imageIndex}`;
                    const url = await uploadToCloudinary(buffer, filename);
                    images.push(url);
                }
                imageIndex++;
            }


            const colorImagesKey = ["firstColorImages", "secondColorImages", "thirdColorImages", "forthColorImages"][i];
            if (req.body[colorImagesKey]) {
                const arr = JSON.parse(req.body[colorImagesKey]);
                arr.forEach(img => {
                    if (typeof img === "string" && img) images.push(img);
                });
            }
            colorImages.push({ color: colorArr[i], images });
        }

        const specs = {
            material,
            compat,
            texture,
            closure,
            compartment,
            zips,
            strap,
            length,
            width,
            height,
            weight,
        };

        if (!productName || !price || !category || !colorArr.length) {
            return res.json({ success: false, message: "Missing required fields." });
        }

        const product = new Product({
            productName,
            price,
            discountPercent,
            wholesalePrice,
            colors: colorArr,
            colorImages,
            category,
            stock,
            bestSeller,
            para,
            specs,
            date: Date.now(),
        });

        await product.save();

        const html = `
      <p>Dear Rehman Shahid,</p>
      <p><b>New product added on your website:</b></p>
      <ul>
        <li><b>Name:</b> ${product.productName}</li>
        <li><b>Category:</b> ${product.category}</li>
        <li><b>Price:</b> ${product.price}</li>
      </ul>
    `;
        await sendAdminMail("New Product Added - RHR Creative", html);

        res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Edit Product
const editProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "Product ID is required." });

        let updateFields = { ...req.body };
        delete updateFields.id;

        const colors = typeof updateFields.colors === "string"
            ? JSON.parse(updateFields.colors)
            : updateFields.colors;

        const colorImagesArray = [];

        const imageUploadFields = [
            { range: [1, 4], tempField: "firstColorImages" },
            { range: [5, 8], tempField: "secondColorImages" },
            { range: [9, 12], tempField: "thirdColorImages" },
            { range: [13, 16], tempField: "forthColorImages" },
        ];

        for (let i = 0; i < 4; i++) {
            let images = [];

            for (let j = imageUploadFields[i].range[0]; j <= imageUploadFields[i].range[1]; j++) {
                const imageFile = req.files[`image${j}`];
                if (imageFile && imageFile[0]) {
                    const buffer = imageFile[0].buffer;
                    const filename = `product-${Date.now()}-${j}`;
                    const url = await uploadToCloudinary(buffer, filename);
                    images.push(url);

                }
            }

            let existingImages = updateFields[imageUploadFields[i].tempField];
            if (existingImages) {
                if (typeof existingImages === "string") {
                    existingImages = JSON.parse(existingImages);
                }

                for (let img of existingImages) {
                    if (img && img.trim() !== "") {
                        images.push(img);
                    }
                }
            }

            if ((colors[i] && colors[i].trim() !== "") || images.length > 0) {
                colorImagesArray.push({
                    color: colors[i] || `Color ${i + 1}`,
                    images,
                });
            }

            delete updateFields[imageUploadFields[i].tempField];
        }

        updateFields.colorImages = colorImagesArray;
        updateFields.colors = colors;

        if (updateFields.price) updateFields.price = Number(updateFields.price);
        if (updateFields.discountPercent !== undefined)
            updateFields.discountPercent = Number(updateFields.discountPercent);
        if (updateFields.wholesalePrice) updateFields.wholesalePrice = Number(updateFields.wholesalePrice);
        if (updateFields.stock !== undefined)
            updateFields.stock = updateFields.stock === "true" || updateFields.stock === true;
        if (updateFields.bestSeller !== undefined)
            updateFields.bestSeller = updateFields.bestSeller === "true" || updateFields.bestSeller === true;

        const specKeys = [
            "material", "compatibility", "texture", "closure", "compartment",
            "zips", "strap", "length", "width", "height", "weight"
        ];
        const specs = {};
        specKeys.forEach((key) => {
            if (updateFields[key] !== undefined) {
                specs[key] = updateFields[key];
                delete updateFields[key];
            }
        });
        updateFields.specs = specs;

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found." });
        }

        let changedFields = Object.keys(updateFields).map(
            key => `<li><b>${key}:</b> ${JSON.stringify(updateFields[key])}</li>`
        ).join("");
        const html = `
            <p>Dear Rehman Shahid,</p>
            <p><b>A product has been edited on your website:</b></p>
            <ul>
                <li><b>Name:</b> ${updatedProduct.productName}</li>
                <li><b>Category:</b> ${updatedProduct.category}</li>
                <li><b>Price:</b> ${updatedProduct.price}</li>
            </ul>
            <p><b>Changed Fields:</b></p>
            <ul>${changedFields}</ul>
        `;
        await sendAdminMail("Product Edited - RHR Creative", html);

        res.json({ success: true, message: "Product updated", product: updatedProduct });

    } catch (error) {
        console.error("Edit Product Error:", error);
        res.json({ success: false, message: error.message });
    }
};


// Remove Product
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.json({ success: false, message: "Product not found or already deleted." });
        }
        await productModel.findByIdAndDelete(req.body.id);

        const html = `
            <p>Dear Rehman Shahid,</p>
            <p><b>A product has been deleted from your website:</b></p>
            <ul>
                <li><b>Name:</b> ${product.productName}</li>
                <li><b>Category:</b> ${product.category}</li>
                <li><b>Price:</b> ${product.price}</li>
            </ul>
        `;
        await sendAdminMail("Product Deleted - RHR Creative", html);

        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Single Product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List Products
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, editProduct, removeProduct, singleProduct, listProduct };
