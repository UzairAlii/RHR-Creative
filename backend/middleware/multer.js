import multer from "multer";
import path from "path";

// Multer will store files in memory (RAM), not on disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
