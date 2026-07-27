const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();

    console.log("====================================");
    console.log("✅ Database Connected Successfully");
    console.log(`Host     : ${process.env.DB_HOST}`);
    console.log(`Database : ${process.env.DB_NAME}`);
    console.log("====================================");

    connection.release();
  } catch (err) {
    console.error("====================================");
    console.error("❌ Database Connection Failed");
    console.error(err);
    console.error("====================================");
    process.exit(1);
  }
}

pool.connectDB = connectDB;

module.exports = pool;
