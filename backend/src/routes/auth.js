const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    // Cek apakah user ada di database
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = users[0];

    // Verifikasi password
    // Kolom di database bernama `password` (berisi hash bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Verifikasi bahwa user adalah admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Hanya admin yang bisa login" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
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

// POST register (optional untuk admin setup)
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, "user"]
    );

    res.status(201).json({ id: result.insertId, message: "User created" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email sudah terdaftar" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});

// ALTER TABLE csr_programs ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) AFTER status;

module.exports = router;
