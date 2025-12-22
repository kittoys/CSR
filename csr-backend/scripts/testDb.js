const pool = require("../src/config/db");

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful!");

    // Test query
    const [rows] = await connection.query("SELECT VERSION() as version");
    console.log("📊 MySQL Version:", rows[0].version);

    // Check tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log(
      "📋 Tables:",
      tables.map((t) => Object.values(t)[0])
    );

    // Check users
    const [users] = await connection.query(
      "SELECT id, email, name, role FROM users"
    );
    console.log("👥 Users:", users);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
