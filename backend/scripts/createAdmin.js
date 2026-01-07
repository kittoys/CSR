const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function createAdminUser() {
  const email = "admin@csr.com";
  const password = "admin123"; // Default password, ganti sesuai kebutuhan
  const name = "Admin User";

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "csr_db",
    });

    // Insert admin user
    await connection.execute(
      `INSERT INTO users (email, password, name, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role)`,
      [email, hashedPassword, name, "admin"]
    );

    console.log(`✅ Admin user created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

    await connection.end();
    process.exit(0);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("❌ User already exists, password kept");
    } else {
      console.error("❌ Error:", err.message);
    }
    process.exit(1);
  }
}

createAdminUser();
