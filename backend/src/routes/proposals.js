const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("File type tidak diizinkan"));
  },
});

// GET statistics - HARUS SEBELUM /:id
router.get("/stats/summary", async (req, res) => {
  try {
    const { month, year } = req.query;

    console.log("📊 Stats request - month:", month, "year:", year);

    let whereClause = "";
    const params = [];

    if (month && year) {
      // Filter by specific month and year
      // Convert month string to integer (remove leading zero if any)
      const monthInt = parseInt(month, 10);
      whereClause =
        "WHERE YEAR(proposal_date) = ? AND MONTH(proposal_date) = ?";
      params.push(year, monthInt);
      console.log("🔍 Filtering by month:", monthInt, "year:", year);
    } else if (year) {
      // Filter by year only
      whereClause = "WHERE YEAR(proposal_date) = ?";
      params.push(year);
      console.log("🔍 Filtering by year:", year);
    } else {
      console.log("🔍 No filter - getting all data");
    }

    const query = `
      SELECT 
        COUNT(*) as total_proposals,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Siap Diambil' THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as completed,
        SUM(budget) as total_budget
      FROM donation_proposals
      ${whereClause}
    `;

    console.log("📝 Query:", query);
    console.log("📝 Params:", params);

    const [stats] = await pool.query(query, params);
    console.log("✅ Stats result:", stats[0]);
    res.json(stats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// GET monthly trend (all months) with status breakdown
router.get("/stats/monthly", async (req, res) => {
  try {
    const { month, year } = req.query;

    console.log("📊 Monthly stats request - month:", month, "year:", year);

    let whereClause = "";
    const params = [];

    if (month && year) {
      // Filter by specific month and year
      const monthInt = parseInt(month, 10);
      whereClause =
        "WHERE YEAR(COALESCE(proposal_date, created_at)) = ? AND MONTH(COALESCE(proposal_date, created_at)) = ?";
      params.push(year, monthInt);
      console.log(
        "🔍 Monthly stats - Filtering by month:",
        monthInt,
        "year:",
        year
      );
    } else if (year) {
      // Filter by year only
      whereClause = "WHERE YEAR(COALESCE(proposal_date, created_at)) = ?";
      params.push(year);
      console.log("🔍 Monthly stats - Filtering by year:", year);
    } else {
      console.log("🔍 Monthly stats - No filter, getting all data");
    }

    const query = `
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m-01') AS month,
        status,
        COUNT(*) AS count,
        SUM(budget) AS budget
      FROM donation_proposals
      ${whereClause}
      GROUP BY month, status
      ORDER BY month ASC
    `;

    console.log("📝 Monthly query:", query);
    console.log("📝 Monthly params:", params);

    const [rows] = await pool.query(query, params);

    const statusKey = {
      "In Progress": "in_progress",
      "Siap Diambil": "waiting",
      Done: "done",
    };

    // Build all months from database
    const months = [];
    const monthsSet = new Set();
    rows.forEach((row) => {
      const monthKey = row.month.slice(0, 7);
      monthsSet.add(monthKey);
    });

    // Sort months and create labels
    Array.from(monthsSet)
      .sort()
      .forEach((key) => {
        const [year, month] = key.split("-");
        const d = new Date(parseInt(year), parseInt(month) - 1, 1);
        months.push({
          key,
          label: d.toLocaleString("id-ID", { month: "short", year: "numeric" }),
        });
      });

    const aggregated = months.map((m) => ({
      month: m.key,
      label: m.label,
      breakdown: {
        in_progress: 0,
        waiting: 0,
        done: 0,
      },
      total: 0,
      total_budget: 0,
    }));

    rows.forEach((row) => {
      const monthKey = row.month.slice(0, 7);
      const target = aggregated.find((m) => m.month === monthKey);
      if (!target) return;
      const key = statusKey[row.status] || "other";
      if (key === "other") return;
      target.breakdown[key] = row.count;
      target.total += row.count;
      target.total_budget += parseFloat(row.budget) || 0;
    });

    res.json(aggregated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching monthly statistics" });
  }
});

// GET semua proposal donasi
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM donation_proposals ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching proposals" });
  }
});

// GET proposal by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM donation_proposals WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Proposal not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching proposal" });
  }
});

// POST buat proposal baru
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "file_proposal", maxCount: 1 },
    { name: "file_bukti_donasi", maxCount: 1 },
    // Fallback legacy field
    { name: "file_pendukung", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      case_id,
      proposal_name,
      organization,
      bentuk_donasi,
      tipe_proposal,
      product_detail,
      jumlah_produk,
      budget,
      catatan,
      status,
      bright_status,
      pic_name,
      pic_email,
      proposal_date,
    } = req.body;

    // If files uploaded, build public paths
    const files = req.files || {};
    const proposalUploaded =
      (files.file_proposal && files.file_proposal[0]) ||
      (files.file_pendukung && files.file_pendukung[0]) ||
      null;
    const proofUploaded =
      (files.file_bukti_donasi && files.file_bukti_donasi[0]) || null;

    const proposal_file_name = proposalUploaded
      ? proposalUploaded.originalname
      : null;
    const proposal_file_path = proposalUploaded
      ? `/uploads/${proposalUploaded.filename}`
      : null;
    const proof_file_name = proofUploaded ? proofUploaded.originalname : null;
    const proof_file_path = proofUploaded
      ? `/uploads/${proofUploaded.filename}`
      : null;

    // Validasi: Jika status Done, bukti wajib diunggah
    if ((status || "").trim() === "Done" && !proofUploaded) {
      return res.status(400).json({
        message: "Bukti pengambilan wajib diunggah untuk status Done",
      });
    }

    try {
      // Generate case_id otomatis jika tidak disediakan
      let finalCaseId = case_id;
      if (!finalCaseId) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const randomNum = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        finalCaseId = `CSR-${year}-${randomNum}`;
      }

      const [result] = await pool.query(
        `INSERT INTO donation_proposals (case_id, proposal_name, organization, bentuk_donasi, tipe_proposal, product_detail, jumlah_produk, budget, catatan, status, bright_status, pic_name, pic_email, proposal_date, proposal_file_name, proposal_file_path, proof_file_name, proof_file_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalCaseId,
          proposal_name,
          organization,
          bentuk_donasi,
          tipe_proposal,
          product_detail,
          jumlah_produk,
          budget,
          catatan,
          status || "In Progress",
          bright_status || null,
          pic_name,
          pic_email,
          proposal_date,
          proposal_file_name,
          proposal_file_path,
          proof_file_name,
          proof_file_path,
        ]
      );
      res.status(201).json({
        id: result.insertId,
        case_id: finalCaseId,
        message: "Proposal created successfully",
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: err.message || "Error creating proposal" });
    }
  }
);

// PUT update proposal
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "file_proposal", maxCount: 1 },
    { name: "file_bukti_donasi", maxCount: 1 },
    { name: "file_pendukung", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      case_id,
      proposal_name,
      organization,
      bentuk_donasi,
      tipe_proposal,
      product_detail,
      jumlah_produk,
      budget,
      catatan,
      status,
      bright_status,
      pic_name,
      pic_email,
      proposal_date,
    } = req.body;

    const files = req.files || {};
    const proposalUploaded =
      (files.file_proposal && files.file_proposal[0]) ||
      (files.file_pendukung && files.file_pendukung[0]) ||
      null;
    const proofUploaded =
      (files.file_bukti_donasi && files.file_bukti_donasi[0]) || null;

    const proposal_file_name = proposalUploaded
      ? proposalUploaded.originalname
      : null;
    const proposal_file_path = proposalUploaded
      ? `/uploads/${proposalUploaded.filename}`
      : null;
    const proof_file_name = proofUploaded ? proofUploaded.originalname : null;
    const proof_file_path = proofUploaded
      ? `/uploads/${proofUploaded.filename}`
      : null;

    // Validasi: Jika status Done, harus ada bukti baru atau sudah tersimpan
    if ((status || "").trim() === "Done" && !proofUploaded) {
      try {
        const [rows] = await pool.query(
          `SELECT proof_file_path FROM donation_proposals WHERE id = ?`,
          [req.params.id]
        );
        const existingProof = rows[0]?.proof_file_path;
        if (!existingProof) {
          return res.status(400).json({
            message:
              "Bukti pengambilan wajib diunggah untuk status Done (belum ada bukti tersimpan)",
          });
        }
      } catch (err) {
        return res.status(500).json({ message: "Error validating proof file" });
      }
    }

    try {
      const fields = [
        case_id,
        proposal_name,
        organization,
        bentuk_donasi,
        tipe_proposal,
        product_detail,
        jumlah_produk,
        budget,
        catatan,
        status,
        bright_status || null,
        pic_name,
        pic_email,
        proposal_date,
      ];

      let query = `UPDATE donation_proposals
       SET case_id = ?, proposal_name = ?, organization = ?, bentuk_donasi = ?, tipe_proposal = ?, product_detail = ?, jumlah_produk = ?, budget = ?, catatan = ?, status = ?, bright_status = ?, pic_name = ?, pic_email = ?, proposal_date = ?`;

      if (proposalUploaded) {
        query += `, proposal_file_name = ?, proposal_file_path = ?`;
        fields.push(proposal_file_name, proposal_file_path);
      }
      if (proofUploaded) {
        query += `, proof_file_name = ?, proof_file_path = ?`;
        fields.push(proof_file_name, proof_file_path);
      }

      query += ` WHERE id = ?`;
      fields.push(req.params.id);

      await pool.query(query, fields);
      res.json({ message: "Proposal updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating proposal" });
    }
  }
);

// DELETE proposal
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await pool.query(`DELETE FROM donation_proposals WHERE id = ?`, [
      req.params.id,
    ]);
    res.json({ message: "Proposal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting proposal" });
  }
});

module.exports = router;
