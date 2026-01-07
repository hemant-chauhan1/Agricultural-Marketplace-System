// import express from "express"
// import { createProduct, deleteProduct, getProduct,  updateProduct } from "../controllers/product.controller.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// const router = express.Router();

// router.get("/",verifyToken,getProduct)

// router.post("/",verifyToken,createProduct)

// router.put("/:id",verifyToken, updateProduct);

// router.delete("/:id",verifyToken,deleteProduct);
 
// export default router;

import express from "express";
import multer from "multer";
import { 
    createProduct, 
    deleteProduct, 
    getProduct,  
    updateProduct 
} from "../controllers/product.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ⭐ MULTER STORAGE SETUP ⭐
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");  // folder name
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ⭐ ROUTES ⭐

// GET ALL PRODUCTS
router.get("/", verifyToken, getProduct);

// CREATE PRODUCT with IMAGE upload
router.post("/", verifyToken, upload.single("image"), createProduct);

// UPDATE PRODUCT (with image upload optional)
router.put("/:id", verifyToken, upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/:id", verifyToken, deleteProduct);

export default router;
