const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + "-" + uniqueSuffix + ext);
  },
});

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter,
});

// POST /api/upload - Upload image (tanpa auth untuk development)
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }

    // Build absolute URL so frontend can access the image directly
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const filePath = `/uploads/${req.file.filename}`;
    const fileUrl = `${baseUrl}${filePath}`;

    res.json({
      message: "File berhasil diupload",
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Gagal mengupload file" });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File terlalu besar (max 5MB)" });
    }
    return res.status(400).json({ message: error.message });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

module.exports = router;
