import multer from "multer";
import path from "path";

// storage location + filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  
    }
});

// filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
});
