// import Product from "../models/product.model.js";
// import mongoose from "mongoose";

// //getProduct
// export const getProduct = async (req, res) => {
//     try {
//         const product = await Product.find({});
//         res.status(200).json({ success: true, data: product });

//     } catch (error) {
//         console.error("Error: ", error.message);
//         res.status(404).json({ success: false, message: "No products found!" });
//     }
// }

// //createProducts
// export const createProduct = async (req, res) => {
//     const product = req.body;

//     if (!product.name || !product.price || !product.unit || !product.image) {
//         return res.status(400).json({ success: false, message: "Please provide all the fields!" });
//     }

//     const newProduct = new Product(product);

//     try {
//         await newProduct.save();
//         res.status(201).json({ success: true, data: newProduct })
//     } catch (error) {
//         console.log(`Error in saving data: ${error.message} `);
//         res.status(500).json({ success: false, message: "Server error!" });
//     }
// }

// //updateProduct
// export const updateProduct = async (req, res) => {
//     const { id } = req.params;
//     const product = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         res.status(404).json({
//             success: false,
//             message: "Product not found by the id you provided!"
//         })
//     }
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
//         res.status(200).json({ success: true, data: updatedProduct });
//     } catch (error) {
//         console.error("Error: ", error.message);
//         res.status(500).json({ success: false, message: "Your product details is not updated!" });
//     }
// }

// //deleteProduct
// export const deleteProduct = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         res.status(404).json({
//             success: false,
//             message: "Product not found by the id you provided!"
//         })
//     }

//     try {
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({ success: true, message: "product deleted Successfully" });
//     } catch (error) {
//         console.error(`Error in deleting product: ${error.message}`);
//         res.status(500).json({ success: false, message: "server error" });
//     }
// }


import Product from "../models/product.model.js";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import fs from "fs";
import path from "path";

// GET Products
export const getProduct = async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(404).json({ success: false, message: "No products found!" });
    }
};

// CREATE Product
export const createProduct = async (req, res) => {
    try {
        const { name, price, unit } = req.body;

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !price || !unit || !imagePath) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields including image!"
            });
        }

        const newProduct = new Product({
            name,
            price: Number(price),
            unit,
            image: imagePath
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.log(`Error in saving data: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error!" });
    }
};

// UPDATE Product (FIXED)
export const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID!" });
    }

    try {
        const { name, price, unit } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // IMAGE Handling
        let imagePath = product.image; // default purana
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;

            // delete old image
            const oldImagePath = path.join(process.cwd(), product.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        // Price handling: if invalid, use old
        const priceNumber = Number(price);
        const finalPrice = !isNaN(priceNumber) ? priceNumber : product.price;

        const updatedFields = {
            name: name || product.name,
            unit: unit || product.unit,
            price: finalPrice,
            image: imagePath
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({ success: false, message: "Your product details were not updated!" });
    }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid product ID!" });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        // Delete image from uploads
        const imagePath = path.join(process.cwd(), product.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        // Remove from carts
        await Cart.updateMany({}, { $pull: { items: { productId: id } } });

        // Delete from DB
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted (image + cart cleanup done)"
        });
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

