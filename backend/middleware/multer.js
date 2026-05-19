import multer from "multer";

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
