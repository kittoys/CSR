const pool = require("../src/config/db");
const bcrypt = require("bcrypt");

async function seedDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();

    console.log("🔄 Seeding database...\n");

    // Truncate tables
    console.log("🗑️  Clearing existing data...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE TABLE users");
    await connection.query("TRUNCATE TABLE categories");
    await connection.query("TRUNCATE TABLE csr_programs");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert users
    console.log("👥 Creating users...");
    await connection.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
      ["admin@csr.com", hashedPassword, "Admin User", "admin"]
    );

    // Insert categories
    console.log("📋 Creating categories...");
    const categories = ["Lingkungan", "Pendidikan", "Kesehatan", "Ekonomi"];

    for (const name of categories) {
      await connection.query("INSERT INTO categories (name) VALUES (?)", [
        name,
      ]);
    }

    // Insert programs
    console.log("📦 Creating programs...");
    const programs = [
      [
        "Program Penanaman Pohon",
        "Penanaman 10.000 pohon di kawasan hutan rusak",
        1,
        "Bogor, Jawa Barat",
        "2025-01-15",
        "2025-03-15",
        "planned",
      ],
      [
        "Beasiswa Pendidikan",
        "Memberikan beasiswa kepada 100 siswa berprestasi",
        2,
        "Jakarta dan sekitarnya",
        "2025-02-01",
        "2025-12-31",
        "ongoing",
      ],
      [
        "Klinik Kesehatan Gratis",
        "Layanan kesehatan gratis untuk masyarakat kurang mampu",
        3,
        "Bekasi",
        "2024-12-20",
        "2025-01-31",
        "completed",
      ],
    ];

    for (const prog of programs) {
      await connection.query(
        "INSERT INTO csr_programs (title, description, category_id, location, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        prog
      );
    }

    console.log("\n✅ Database seeded successfully!\n");
    console.log("📧 Admin Email: admin@csr.com");
    console.log("🔑 Admin Password: admin123\n");

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

seedDatabase();
