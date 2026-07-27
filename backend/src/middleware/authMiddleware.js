const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

// Admin only - Full access to all features
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang bisa mengakses" });
  }
  next();
};

// Petugas only - Limited access
const isOfficer = (req, res, next) => {
  if (req.user.role !== "petugas") {
    return res
      .status(403)
      .json({ message: "Hanya petugas yang bisa mengakses" });
  }
  next();
};

// Admin or the owner themselves
const isAdminOrOwner = (userId) => (req, res, next) => {
  if (req.user.role === "admin" || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ message: "Akses ditolak" });
  }
};

// Can be accessed by both admin and petugas (authenticated)
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Autentikasi diperlukan" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isOfficer,
  isAdminOrOwner,
  isAuthenticated,
};
