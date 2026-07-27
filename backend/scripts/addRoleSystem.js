const mysql = require("mysql2/promise");
require("dotenv").config();

async function addRoleSystem() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "csr_db",
    });

    console.log("🔧 Adding Role System to Database...\n");

    // 1. Add created_by column to donation_proposals if not exists
    console.log("📝 Adding created_by column to donation_proposals...");
    try {
      await connection.query(
        `ALTER TABLE donation_proposals ADD COLUMN created_by INT DEFAULT NULL AFTER id`,
      );
      console.log("✅ Created created_by column");
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("✅ Column created_by already exists");
      } else {
        throw err;
      }
    }

    // 2. Update users table to have proper role enum
    console.log("\n📝 Updating users table role column...");
    try {
      await connection.query(
        `ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'petugas') NOT NULL DEFAULT 'petugas'`,
      );
      console.log("✅ Updated role enum to admin/petugas");
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("✅ Role column already properly defined");
      } else {
        throw err;
      }
    }

    // 3. Add created_at to users if not exists
    console.log("\n📝 Adding created_at column to users...");
    try {
      await connection.query(
        `ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
      );
      console.log("✅ Added created_at column");
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("✅ created_at column already exists");
      } else {
        throw err;
      }
    }

    // 4. Create audit_log table for tracking changes
    console.log("\n📝 Creating audit_log table...");
    try {
      await connection.query(
        `CREATE TABLE IF NOT EXISTS audit_log (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          action VARCHAR(255),
          table_name VARCHAR(100),
          record_id INT,
          old_values JSON,
          new_values JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
      );
      console.log("✅ Created audit_log table");
    } catch (err) {
      if (err.code === "ER_TABLE_EXISTS_ERROR") {
        console.log("✅ audit_log table already exists");
      } else {
        throw err;
      }
    }

    // 5. Verify schema
    console.log("\n📋 Verifying schema changes...");
    const [usersSchema] = await connection.query(`DESCRIBE users`);
    console.log("✅ Users table columns:");
    usersSchema.forEach((col) => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });

    const [proposalsSchema] = await connection.query(
      `DESCRIBE donation_proposals`,
    );
    console.log("\n✅ Donation_proposals table columns:");
    proposalsSchema.forEach((col) => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });

    console.log("\n✅ Role System setup completed successfully!");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addRoleSystem();
