const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupFocTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "csr_db",
    });

    console.log("🔧 Creating foc_bulanan table...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS foc_bulanan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tanggal DATE NOT NULL,
        lembaga VARCHAR(255) NOT NULL,
        penanggungJawab VARCHAR(255),
        nomorHp VARCHAR(20),
        jumlahAqua INT DEFAULT 0,
        jenis VARCHAR(50),
        keterangan TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_by INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tanggal (tanggal),
        INDEX idx_lembaga (lembaga),
        INDEX idx_status (status),
        INDEX idx_created_by (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ foc_bulanan table created successfully");

    await connection.end();
  } catch (err) {
    console.error("❌ Error creating foc_bulanan table:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  setupFocTable();
}

module.exports = { setupFocTable };
