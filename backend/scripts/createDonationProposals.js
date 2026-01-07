const pool = require("../src/config/db");

async function createDonationProposalsTable() {
  try {
    console.log("📝 Creating donation_proposals table...");

    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donation_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id VARCHAR(20) UNIQUE NOT NULL,
        proposal_name VARCHAR(255) NOT NULL,
        organization VARCHAR(255),
        bentuk_donasi VARCHAR(100),
        tipe_proposal VARCHAR(100),
        product_detail TEXT,
        jumlah_produk VARCHAR(255),
        budget DECIMAL(15,2),
        catatan TEXT,
        status ENUM('In Progress', 'Siap Diambil', 'Done') DEFAULT 'In Progress',
        bright_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT NULL,
        pic_name VARCHAR(255),
        pic_email VARCHAR(255),
        proposal_date DATE,
        file_pendukung VARCHAR(255),
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ donation_proposals table created successfully!");

    // Insert sample data
    console.log("📝 Inserting sample donation proposals...");
    await pool.query(`
      INSERT IGNORE INTO donation_proposals 
      (case_id, proposal_name, organization, product_detail, budget, status, pic_name, pic_email, proposal_date) 
      VALUES 
      ('CSR-2025-001', 'Proposal Bantuan Air Bersi...', 'Kepala Desa A', 'Air mineral kemasan 200ml. 50 dus 200ml', 500000, 'In Progress', 'Pak Ilham', 'ilham@company.com', '2025-07-15'),
      ('CSR-2025-003', 'PHBI MAULID NABI', 'MASID AL-Balman', 'Produk 30 Box 200M 30 Box 200M', 3000000, 'Siap Diambil', 'Pak Ilham', 'ilham@company.com', '2025-08-10'),
      ('CSR-2024-039', 'Pelatihan Keterampilan Ibu...', 'PKK Kelurahan Maju', 'Peralatan jahit dan bordir unt... 50 set alat', 12000000, 'In Progress', 'Bu Sarah', 'sarah@company.com', '2025-09-08'),
      ('CSR-2024-032', 'Program Kesehatan Lansia', 'Puskesmas Kecamat...', 'Paket obat dan vitamin untuk... 200 paket obat', 8000000, 'In Progress', 'Pak Ahmad', 'ahmad@company.com', '2025-10-11'),
      ('CSR-2024-028', 'Bantuan Korban Banjir', 'PMI Cabang Kota', 'Paket sembako untuk korban ... 500 paket', 15000000, 'Siap Diambil', 'Pak Ilham', 'ilham@company.com', '2025-11-20'),
      ('CSR-2024-021', 'Renovasi Masjid Desa Suka...', 'DKM Masjid Al-Ikhlas', 'Material untuk renovasi atap ... 1 paket renovasi', 25000000, 'Done', 'Bu Sarah', 'sarah@company.com', '2025-12-09'),
      ('CSR-2024-015', 'Bantuan Pendidikan Anak-Y...', 'Yayasan Peduli Anak', 'Beasiswa pendidikan untuk a... 20 beasiswa', 10000000, 'Done', 'Pak Ilham', 'ilham@company.com', '2025-12-20')
    `);

    console.log("✅ Sample data inserted successfully!");

    // Verify
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM donation_proposals"
    );
    console.log(`📊 Total proposals: ${rows[0].count}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createDonationProposalsTable();
