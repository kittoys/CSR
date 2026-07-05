const pool = require("../src/config/db");
require("dotenv").config();

async function verifySample() {
  try {
    console.log("\n📋 Sample data verification:\n");

    // Sample semua status
    console.log("=== Sample dari setiap status ===\n");
    const statuses = ["In Progress", "Siap Diambil", "Done"];
    for (const s of statuses) {
      const [rows] = await pool.query(
        "SELECT case_id, status, budget FROM donation_proposals WHERE status = ? LIMIT 1",
        [s],
      );
      if (rows.length > 0) {
        console.log(
          `Status "${s}": case_id=${rows[0].case_id}, budget=Rp${rows[0].budget.toLocaleString("id-ID")}`,
        );
      }
    }

    console.log("\n=== Sample dari setiap bright_status ===\n");
    const brightStatuses = ["Pending", "Approved", "Rejected"];
    for (const bs of brightStatuses) {
      const [rows] = await pool.query(
        "SELECT case_id, bright_status, reject_reason FROM donation_proposals WHERE bright_status = ? LIMIT 1",
        [bs],
      );
      if (rows.length > 0) {
        console.log(
          `Bright_status "${bs}": case_id=${rows[0].case_id}, reject_reason=${rows[0].reject_reason ? rows[0].reject_reason.slice(0, 50) : "(null)"}`,
        );
      }
    }

    console.log("\n=== Count per status ===\n");
    const [statusCounts] = await pool.query(`
      SELECT status, COUNT(*) as count FROM donation_proposals GROUP BY status ORDER BY status
    `);
    statusCounts.forEach((r) => console.log(`${r.status}: ${r.count}`));

    console.log("\n=== Count per bright_status ===\n");
    const [brightCounts] = await pool.query(`
      SELECT bright_status, COUNT(*) as count FROM donation_proposals GROUP BY bright_status ORDER BY bright_status
    `);
    brightCounts.forEach((r) => console.log(`${r.bright_status}: ${r.count}`));

    console.log("\n✅ Verification complete!\n");

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await pool.end();
    process.exit(1);
  }
}

verifySample();
