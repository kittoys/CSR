const pool = require("../src/config/db");
require("dotenv").config();

async function checkMonthlyData() {
  try {
    const [data] = await pool.query(`
      SELECT 
        YEAR(proposal_date) as year,
        MONTH(proposal_date) as month,
        COUNT(*) as proposals,
        SUM(budget) as total_budget
      FROM donation_proposals
      WHERE YEAR(proposal_date) IN (2023, 2024, 2025)
      GROUP BY YEAR(proposal_date), MONTH(proposal_date)
      ORDER BY year, month
    `);

    console.log("📊 Monthly breakdown 2023-2025:\n");
    console.log("Year  Month  Proposals  Budget");
    console.log("─────────────────────────────────");

    let prevYear = null;
    data.forEach((row) => {
      if (row.year !== prevYear) {
        console.log(`\n${row.year}:`);
        prevYear = row.year;
      }
      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      console.log(
        `     ${months[row.month]}: ${row.proposals.toString().padStart(3)} props | Rp${row.total_budget.toLocaleString("id-ID")}`
      );
    });

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkMonthlyData();
