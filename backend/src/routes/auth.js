const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// POST login - Support both admin and petugas
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Allow both admin and petugas to login
    const allowedRoles = ["admin", "petugas"];
    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Role tidak diizinkan untuk login" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error login" });
  }
});

// POST register admin (admin create petugas/admin accounts)
router.post("/register", verifyToken, isAdmin, async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Admin hanya bisa create admin atau petugas
  const validRoles = ["admin", "petugas"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, role],
    );

    res.status(201).json({
      id: result.insertId,
      message: `${role} berhasil dibuat`,
      user: {
        id: result.insertId,
        email,
        name,
        role,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email sudah terdaftar" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});

// GET semua users (admin only)
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET user by id (admin only)
router.get("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, email, name, role, created_at FROM users WHERE id = ?",
      [req.params.id],
    );
    if (!users.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// PUT update user (admin only)
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: "Field diperlukan" });
  }

  const validRoles = ["admin", "petugas"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  try {
    await pool.query("UPDATE users SET name = ?, role = ? WHERE id = ?", [
      name,
      role,
      req.params.id,
    ]);
    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE user (admin only)
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
