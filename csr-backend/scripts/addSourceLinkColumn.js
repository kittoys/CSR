const pool = require("../src/config/db");

async function addSourceLinkColumn() {
  try {
    console.log("🔧 Menambahkan kolom source_link ke tabel csr_programs...\n");

    // Cek apakah kolom sudah ada
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'csr_programs' 
      AND COLUMN_NAME = 'source_link'
    `);

    if (columns.length > 0) {
      console.log("ℹ️  Kolom source_link sudah ada.\n");
      process.exit(0);
    }

    // Tambahkan kolom jika belum ada
    await pool.query(`
      ALTER TABLE csr_programs 
      ADD COLUMN source_link VARCHAR(500) AFTER image_url
    `);

    console.log("✅ Kolom source_link berhasil ditambahkan!\n");
    console.log(
      "Sekarang Anda bisa menambahkan link sumber berita ke program.\n"
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addSourceLinkColumn();
