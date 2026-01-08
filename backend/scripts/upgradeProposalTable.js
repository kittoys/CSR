const mysql = require("mysql2/promise");
require("dotenv").config();

async function upgradeProposalTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "csr_db",
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    console.log("📝 Upgrading donation_proposals table...\n");

    const connection = await pool.getConnection();

    // Check if columns already exist before adding
    const [columns] = await connection.query(
      `
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'donation_proposals' AND TABLE_SCHEMA = ?
    `,
      [process.env.DB_NAME || "csr_db"]
    );

    const existingColumns = columns.map((c) => c.COLUMN_NAME);

    // Add new columns if they don't exist
    const newColumns = [
      { name: "bentuk_donasi", def: "ADD COLUMN bentuk_donasi VARCHAR(100)" },
      { name: "tipe_proposal", def: "ADD COLUMN tipe_proposal VARCHAR(100)" },
      { name: "jumlah_produk", def: "ADD COLUMN jumlah_produk VARCHAR(255)" },
      { name: "catatan", def: "ADD COLUMN catatan TEXT" },
      { name: "file_pendukung", def: "ADD COLUMN file_pendukung VARCHAR(255)" },
      { name: "file_path", def: "ADD COLUMN file_path VARCHAR(255)" },
      {
        name: "bright_status",
        def: "ADD COLUMN bright_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT NULL",
      },
      // Kolom baru untuk dua file terpisah
      {
        name: "proposal_file_name",
        def: "ADD COLUMN proposal_file_name VARCHAR(255)",
      },
      {
        name: "proposal_file_path",
        def: "ADD COLUMN proposal_file_path VARCHAR(255)",
      },
      {
        name: "proof_file_name",
        def: "ADD COLUMN proof_file_name VARCHAR(255)",
      },
      {
        name: "proof_file_path",
        def: "ADD COLUMN proof_file_path VARCHAR(255)",
      },
    ];

    for (const col of newColumns) {
      if (!existingColumns.includes(col.name)) {
        try {
          await connection.query(`ALTER TABLE donation_proposals ${col.def}`);
          console.log(`✅ Added column: ${col.name}`);
        } catch (err) {
          console.log(
            `⚠️  Skipped: ${col.name} (${err.message.substring(0, 50)})`
          );
        }
      } else {
        console.log(`ℹ️  Column already exists: ${col.name}`);
      }
    }

    console.log("\n✅ Table upgrade completed!\n");

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

upgradeProposalTable();
