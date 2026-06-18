const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * GET /api/foc
 * Retrieve all FOC (Focussed On Community) monthly data, sorted by date
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM foc_bulanan
      ORDER BY tanggal DESC, id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("FOC GET error:", err);
    res.status(500).json({ message: "Error fetching FOC data" });
  }
});

/**
 * POST /api/foc/batch
 * Bulk insert multiple FOC records (for initial data load)
 * Body: { records: [{tanggal, lembaga, ...}, ...] }
 */
router.post("/batch", async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array is required" });
    }

    const values = records.map((r) => [
      r.tanggal,
      r.lembaga,
      r.penanggungJawab,
      r.nomorHp,
      r.jumlahAqua,
      r.jenis,
      r.keterangan,
      r.status || "Pending",
    ]);

    const [result] = await pool.query(
      `
      INSERT INTO foc_bulanan 
        (tanggal, lembaga, penanggungJawab, nomorHp, jumlahAqua, jenis, keterangan, status, created_at)
      VALUES ?
    `,
      [values],
    );

    res.json({
      success: true,
      insertedCount: result.affectedRows,
      message: `${result.affectedRows} FOC records added successfully`,
    });
  } catch (err) {
    console.error("FOC batch POST error:", err);
    res.status(500).json({ message: "Error adding FOC records" });
  }
});

/**
 * POST /api/foc
 * Add or update FOC monthly data
 * Body: { tanggal, lembaga, penanggungJawab, nomorHp, jumlahAqua, jenis, keterangan, status }
 */
router.post("/", async (req, res) => {
  try {
    const {
      tanggal,
      lembaga,
      penanggungJawab,
      nomorHp,
      jumlahAqua,
      jenis,
      keterangan,
      status,
    } = req.body;

    if (!tanggal || !lembaga) {
      return res
        .status(400)
        .json({ message: "tanggal and lembaga are required" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO foc_bulanan 
        (tanggal, lembaga, penanggungJawab, nomorHp, jumlahAqua, jenis, keterangan, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        tanggal,
        lembaga,
        penanggungJawab,
        nomorHp,
        jumlahAqua,
        jenis,
        keterangan,
        status || "Pending",
      ],
    );

    res.json({
      success: true,
      id: result.insertId,
      message: "FOC data added successfully",
    });
  } catch (err) {
    console.error("FOC POST error:", err);
    res.status(500).json({ message: "Error adding FOC data" });
  }
});

/**
 * PUT /api/foc/:id
 * Update FOC monthly data
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tanggal,
      lembaga,
      penanggungJawab,
      nomorHp,
      jumlahAqua,
      jenis,
      keterangan,
      status,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE foc_bulanan
      SET tanggal = ?, lembaga = ?, penanggungJawab = ?, nomorHp = ?, 
          jumlahAqua = ?, jenis = ?, keterangan = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [
        tanggal,
        lembaga,
        penanggungJawab,
        nomorHp,
        jumlahAqua,
        jenis,
        keterangan,
        status,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FOC data not found" });
    }

    res.json({
      success: true,
      message: "FOC data updated successfully",
    });
  } catch (err) {
    console.error("FOC PUT error:", err);
    res.status(500).json({ message: "Error updating FOC data" });
  }
});

/**
 * DELETE /api/foc/:id
 * Delete FOC monthly data
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`DELETE FROM foc_bulanan WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "FOC data not found" });
    }

    res.json({
      success: true,
      message: "FOC data deleted successfully",
    });
  } catch (err) {
    console.error("FOC DELETE error:", err);
    res.status(500).json({ message: "Error deleting FOC data" });
  }
});

module.exports = router;
