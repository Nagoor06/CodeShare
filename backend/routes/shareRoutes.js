import multer from "multer";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
];

const upload = multer({
  storage: multer.memoryStorage(), // 🔥 REQUIRED for GridFS
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only PDF, images, and text files allowed.")
      );
    }
    cb(null, true);
  },
});
