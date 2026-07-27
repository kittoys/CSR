const mysql = require("mysql2/promise");
require("dotenv").config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "csr_db",
  });

  const [rows] = await connection.query(
    "SELECT id, email, name, role FROM users WHERE email IN ('admin@csr.com', 'petugas@csr.com')"
  );

  console.log(JSON.stringify(rows, null, 2));
  await connection.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
