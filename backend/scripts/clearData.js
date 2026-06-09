const mysql = require("mysql2/promise");
require("dotenv").config();

async function clearData() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "csr_db",
    });

    console.log("🧹 Clearing CSR proposal and program data...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE TABLE donation_proposals");
    await connection.query("TRUNCATE TABLE csr_programs");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Data cleared: donation_proposals and csr_programs");
  } catch (err) {
    console.error("❌ Error clearing data:", err.message || err);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

clearData();
