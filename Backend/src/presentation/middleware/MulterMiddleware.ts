import fs from "fs";
import multer from "multer";
const uploadDir = "uploads";

if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now()+ "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter : multer.Options['fileFilter'] = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null, true);
    }   else {      
        cb(new Error("only image files are allowed"));
    }
};

export const upload = multer({ storage, fileFilter });