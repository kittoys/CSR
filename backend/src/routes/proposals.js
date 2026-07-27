const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {
  verifyToken,
  isAdmin,
  isAuthenticated,
} = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

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

const resolveUploadPath = (filePath) =>
  path.join(__dirname, "../../", filePath.replace(/^\/+/, ""));

const unlinkUploadFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(resolveUploadPath(filePath));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Failed to remove upload file:", filePath, error.message);
    }
  }
};

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
        year,
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

// GET semua proposal donasi (admin dan petugas melihat seluruh data proposal)
router.get("/", verifyToken, async (req, res) => {
  try {
    const query = `SELECT * FROM donation_proposals ORDER BY created_at DESC`;
    console.log("proposal list query", query);
    const [rows] = await pool.query(query);
    console.log("proposal list rows", rows.length, rows[0]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching proposals" });
  }
});

// GET proposal by id (admin dan petugas melihat proposal apa pun)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM donation_proposals WHERE id = ?`,
      [req.params.id],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Proposal not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching proposal" });
  }
});

// POST buat proposal baru (admin dan petugas bisa, tapi dengan batasan berbeda)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "file_proposal", maxCount: 1 },
    { name: "file_bukti_donasi", maxCount: 1 },
    // Fallback legacy field
    { name: "file_pendukung", maxCount: 1 },
  ]),
  async (req, res) => {
    // Petugas hanya bisa membuat proposal dengan status default
    if (req.user.role === "petugas") {
      const { status, bright_status } = req.body;
      if (status && status !== "In Progress") {
        return res.status(403).json({
          message:
            "Petugas hanya bisa membuat proposal dengan status 'In Progress'",
        });
      }
      if (bright_status && bright_status !== "Pending") {
        return res.status(403).json({
          message: "Petugas tidak bisa mengubah bright_status",
        });
      }
    }

    const {
      case_id,
      proposal_name,
      organization,
      bentuk_donasi,
      product_detail,
      jumlah_produk,
      budget,
      catatan,
      reject_reason,
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
    const removeProof = ["true", "1", "yes"].includes(
      String(req.body.remove_proof || "").toLowerCase(),
    );

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

    // Petugas default status is "In Progress"
    const finalStatus =
      req.user.role === "petugas"
        ? "In Progress"
        : proofUploaded
          ? "Done"
          : removeProof
            ? "In Progress"
            : status || "In Progress";

    const finalBrightStatus =
      req.user.role === "petugas" ? "Pending" : bright_status || "Pending";

    if (finalStatus.trim() === "Done" && !proofUploaded) {
      return res.status(400).json({
        message: "Bukti pengambilan wajib diunggah untuk status Done",
      });
    }

    if (
      finalBrightStatus === "Rejected" &&
      (!reject_reason || reject_reason.trim() === "")
    ) {
      return res.status(400).json({
        message:
          "Alasan penolakan wajib diisi saat status Bright ditetapkan Rejected",
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
        `INSERT INTO donation_proposals (created_by, case_id, proposal_name, organization, bentuk_donasi, product_detail, jumlah_produk, budget, catatan, reject_reason, status, bright_status, pic_name, pic_email, proposal_date, proposal_file_name, proposal_file_path, proof_file_name, proof_file_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          finalCaseId,
          proposal_name,
          organization,
          bentuk_donasi,
          product_detail,
          jumlah_produk,
          budget,
          catatan,
          reject_reason || null,
          finalStatus,
          finalBrightStatus,
          pic_name,
          pic_email,
          proposal_date,
          proposal_file_name,
          proposal_file_path,
          proof_file_name,
          proof_file_path,
        ],
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
  },
);

// PUT update proposal (admin full access, petugas limited)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "file_proposal", maxCount: 1 },
    { name: "file_bukti_donasi", maxCount: 1 },
    { name: "file_pendukung", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Check ownership for petugas
      const [proposalRows] = await pool.query(
        `SELECT created_by, status, bright_status FROM donation_proposals WHERE id = ?`,
        [req.params.id],
      );
      if (!proposalRows.length) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      const currentProposal = proposalRows[0];

      // Petugas hanya bisa update proposal yang mereka buat
      if (
        req.user.role === "petugas" &&
        currentProposal.created_by !== req.user.id
      ) {
        return res
          .status(403)
          .json({ message: "Anda tidak bisa update proposal ini" });
      }

      const {
        case_id,
        proposal_name,
        organization,
        bentuk_donasi,
        product_detail,
        jumlah_produk,
        budget,
        catatan,
        reject_reason,
        status,
        bright_status,
        pic_name,
        pic_email,
        proposal_date,
      } = req.body;

      const isPetugas = req.user.role === "petugas";
      const effectiveBrightStatus = isPetugas
        ? currentProposal.bright_status || "Pending"
        : bright_status || currentProposal.bright_status || null;
      const effectiveRejectReason = isPetugas
        ? currentProposal.reject_reason || null
        : reject_reason || null;

      const files = req.files || {};
      const proposalUploaded =
        (files.file_proposal && files.file_proposal[0]) ||
        (files.file_pendukung && files.file_pendukung[0]) ||
        null;
      const proofUploaded =
        (files.file_bukti_donasi && files.file_bukti_donasi[0]) || null;
      const removeProof = ["true", "1", "yes"].includes(
        String(req.body.remove_proof || "").toLowerCase(),
      );

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

      const [existingRows] = await pool.query(
        `SELECT proof_file_name, proof_file_path FROM donation_proposals WHERE id = ?`,
        [req.params.id],
      );
      if (!existingRows.length) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      const existingProofPath = existingRows[0]?.proof_file_path || null;
      const existingProofStatus = proofUploaded
        ? "Done"
        : removeProof
          ? "In Progress"
          : existingProofPath
            ? "Done"
            : status || "In Progress";

      if (
        existingProofStatus.trim() === "Done" &&
        !proofUploaded &&
        !existingProofPath
      ) {
        return res.status(400).json({
          message: "Bukti pengambilan wajib diunggah untuk status Done",
        });
      }

      if (
        effectiveBrightStatus === "Rejected" &&
        (!effectiveRejectReason || effectiveRejectReason.trim() === "")
      ) {
        return res.status(400).json({
          message:
            "Alasan penolakan wajib diisi saat status Bright ditetapkan Rejected",
        });
      }

      if (removeProof && existingProofPath) {
        await unlinkUploadFile(existingProofPath);
      }

      if (proofUploaded && existingProofPath && !removeProof) {
        await unlinkUploadFile(existingProofPath);
      }

      const fields = [
        case_id,
        proposal_name,
        organization,
        bentuk_donasi,
        product_detail,
        jumlah_produk,
        budget,
        catatan,
        effectiveRejectReason,
        existingProofStatus,
        effectiveBrightStatus,
        pic_name,
        pic_email,
        proposal_date,
      ];

      let query = `UPDATE donation_proposals
      SET case_id = ?, proposal_name = ?, organization = ?, bentuk_donasi = ?, product_detail = ?, jumlah_produk = ?, budget = ?, catatan = ?, reject_reason = ?, status = ?, bright_status = ?, pic_name = ?, pic_email = ?, proposal_date = ?`;

      if (proposalUploaded) {
        query += `, proposal_file_name = ?, proposal_file_path = ?`;
        fields.push(proposal_file_name, proposal_file_path);
      }
      if (proofUploaded) {
        query += `, proof_file_name = ?, proof_file_path = ?`;
        fields.push(proof_file_name, proof_file_path);
      } else if (removeProof) {
        query += `, proof_file_name = NULL, proof_file_path = NULL`;
      }

      query += ` WHERE id = ?`;
      fields.push(req.params.id);

      await pool.query(query, fields);
      res.json({ message: "Proposal updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating proposal" });
    }
  },
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
