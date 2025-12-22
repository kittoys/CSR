const pool = require("../src/config/db");

async function checkTable() {
  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query("DESCRIBE users");
    console.log("Table users structure:");
    console.log(result);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkTable();
