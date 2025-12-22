const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    console.log("📝 Reading setup.sql...");
    const sqlFile = path.join(__dirname, "../setup.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    // Split by semicolon and execute each statement
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`📊 Found ${statements.length} SQL statements`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await connection.query(statements[i]);
        console.log(`✅ Statement ${i + 1}/${statements.length}`);
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} warning:`, err.message);
      }
    }

    console.log("✅ Database setup completed successfully!");

    // Verify
    await connection.query("USE csr_db");
    const [tables] = await connection.query("SHOW TABLES");
    console.log(
      "📋 Created tables:",
      tables.map((t) => Object.values(t)[0])
    );

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setupDatabase();
