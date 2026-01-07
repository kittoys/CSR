const mysql = require("mysql2/promise");
require("dotenv").config();

async function createProposalTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "csr_db",
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    console.log("📝 Creating donation_proposals table...\n");

    const connection = await pool.getConnection();

    // Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS donation_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id VARCHAR(20) UNIQUE NOT NULL,
        proposal_name VARCHAR(255) NOT NULL,
        organization VARCHAR(255),
        product_detail TEXT,
        budget DECIMAL(15,2),
        status ENUM('In Progress', 'Siap Diambil', 'Done') DEFAULT 'In Progress',
        pic_name VARCHAR(255),
        pic_email VARCHAR(255),
        proposal_date DATE,
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Table created successfully\n");

    // Insert sample data
    console.log("📊 Inserting sample data...\n");

    const sampleData = [
      [
        "CSR-2025-001",
        "Proposal Bantuan Air Bersi...",
        "Kepala Desa A",
        "Air mineral kemasan 200ml. 50 dus 200ml",
        500000,
        "In Progress",
        "Pak Ilham",
        "ilham@company.com",
        "2025-01-15",
      ],
      [
        "CSR-2025-003",
        "PHBI MAULID NABI",
        "MASID AL-Balman",
        "Produk 30 Box 200M 30 Box 200M",
        3000000,
        "Siap Diambil",
        "Pak Ilham",
        "ilham@company.com",
        "2025-01-10",
      ],
      [
        "CSR-2024-039",
        "Pelatihan Keterampilan Ibu...",
        "PKK Kelurahan Maju",
        "Peralatan jahit dan bordir unt... 50 set alat",
        12000000,
        "In Progress",
        "Bu Sarah",
        "sarah@company.com",
        "2024-12-08",
      ],
      [
        "CSR-2024-032",
        "Program Kesehatan Lansia",
        "Puskesmas Kecamat...",
        "Paket obat dan vitamin untuk... 200 paket obat",
        8000000,
        "In Progress",
        "Pak Ahmad",
        "ahmad@company.com",
        "2024-12-11",
      ],
      [
        "CSR-2024-028",
        "Bantuan Korban Banjir",
        "PMI Cabang Kota",
        "Paket sembako untuk korban ... 500 paket",
        15000000,
        "Siap Diambil",
        "Pak Ilham",
        "ilham@company.com",
        "2024-05-10",
      ],
      [
        "CSR-2024-021",
        "Renovasi Masjid Desa Suka...",
        "DKM Masjid Al-Ikhlas",
        "Material untuk renovasi atap ... 1 paket renovasi",
        25000000,
        "Done",
        "Bu Sarah",
        "sarah@company.com",
        "2024-10-09",
      ],
      [
        "CSR-2024-015",
        "Bantuan Pendidikan Anak-Y...",
        "Yayasan Peduli Anak",
        "Beasiswa pendidikan untuk a... 20 beasiswa",
        10000000,
        "Done",
        "Pak Ilham",
        "ilham@company.com",
        "2024-08-15",
      ],
    ];

    for (const data of sampleData) {
      try {
        await connection.query(
          `INSERT INTO donation_proposals (case_id, proposal_name, organization, product_detail, budget, status, pic_name, pic_email, proposal_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          data
        );
        console.log(`✅ Inserted: ${data[0]} - ${data[1]}`);
      } catch (err) {
        console.log(`⚠️  Skipped: ${data[0]} (already exists)`);
      }
    }

    // Verify
    const [count] = await connection.query(
      `SELECT COUNT(*) as total FROM donation_proposals`
    );

    console.log(`\n✅ Database setup completed!`);
    console.log(`📊 Total proposals: ${count[0].total}\n`);

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

createProposalTable();
