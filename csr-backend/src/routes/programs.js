const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// GET semua program
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM csr_programs p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching programs" });
  }
});

// GET program by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM csr_programs p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Program not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching program" });
  }
});

// POST buat program baru
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const {
    title,
    description,
    category_id,
    location,
    start_date,
    end_date,
    status,
    image_url,
  } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO csr_programs (title, description, category_id, location, start_date, end_date, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        category_id,
        location,
        start_date,
        end_date,
        status || "planned",
        image_url || null,
      ]
    );
    res.status(201).json({ id: result.insertId, message: "Program created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating program" });
  }
});

// PUT update program
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const {
    title,
    description,
    category_id,
    location,
    start_date,
    end_date,
    status,
    image_url,
  } = req.body;
  try {
    await pool.query(
      `UPDATE csr_programs
       SET title = ?, description = ?, category_id = ?, location = ?, start_date = ?, end_date = ?, status = ?, image_url = ?
       WHERE id = ?`,
      [
        title,
        description,
        category_id,
        location,
        start_date,
        end_date,
        status,
        image_url || null,
        req.params.id,
      ]
    );
    res.json({ message: "Program updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating program" });
  }
});

// DELETE program
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await pool.query(`DELETE FROM csr_programs WHERE id = ?`, [req.params.id]);
    res.json({ message: "Program deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting program" });
  }
});

module.exports = router;
