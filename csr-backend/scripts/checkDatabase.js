const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "csr_db",
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    console.log("📊 Checking Database Connection...\n");

    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!\n");

    // Check if donation_proposals table exists
    console.log("🔍 Checking tables...");
    const [tables] = await pool.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [process.env.DB_NAME || "csr_db"]
    );

    console.log("\n📋 Tables found:");
    tables.forEach((table) => {
      console.log(`   - ${table.TABLE_NAME}`);
    });

    // Check donation_proposals table structure
    if (tables.some((t) => t.TABLE_NAME === "donation_proposals")) {
      console.log("\n✅ donation_proposals table exists\n");

      const [columns] = await pool.query(`DESCRIBE donation_proposals`);

      console.log("📝 Table structure:");
      columns.forEach((col) => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });

      // Count proposals
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as count FROM donation_proposals`
      );

      console.log(
        `\n📊 Total proposals in database: ${countResult[0].count}\n`
      );
    } else {
      console.log("\n❌ donation_proposals table NOT found\n");
      console.log("Please run setup.sql to create the table.\n");
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Make sure MySQL service is running");
    console.error("2. Check DB_HOST, DB_USER, DB_PASSWORD in .env");
    console.error("3. Run setup.sql to create tables");
    process.exit(1);
  }
}

checkDatabase();
