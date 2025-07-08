import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, uploadPath);
  },
  filename: function (req, file, callBack) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callBack(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

export default upload;
