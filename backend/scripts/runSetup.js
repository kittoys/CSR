const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  try {
    console.log("📝 Running setup.sql...\n");

    const setupSQL = fs.readFileSync(
      path.join(__dirname, "../setup.sql"),
      "utf8"
    );

    const connection = await pool.getConnection();

    // Split and execute statements one by one
    const statements = setupSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      if (!statement.startsWith("--")) {
        try {
          await connection.query(statement);
          console.log("✅", statement.substring(0, 60) + "...");
        } catch (err) {
          console.log("⚠️ ", statement.substring(0, 60) + "...");
          console.log("   ", err.message.substring(0, 100));
        }
      }
    }

    connection.release();
    console.log("\n✅ Database setup completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

setupDatabase();
