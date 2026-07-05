const pool = require("../src/config/db");
require("dotenv").config();

const PRICE_PER_DUS = 63000;

// Distribusi musiman 2026 Jan-Jul (7 bulan, ~60% dari tahunan)
const monthlyData = {
  "2026-01": { budget: 12000000, proposals: 15 }, // Jan: rendah
  "2026-02": { budget: 14000000, proposals: 18 }, // Feb: rendah
  "2026-03": { budget: 35000000, proposals: 45 }, // Mar: spike Ramadan
  "2026-04": { budget: 38000000, proposals: 50 }, // Apr: spike Lebaran
  "2026-05": { budget: 28000000, proposals: 35 }, // May: medium
  "2026-06": { budget: 26000000, proposals: 33 }, // Jun: medium
  "2026-07": { budget: 32000000, proposals: 42 }, // Jul: naik tahun ajaran
};

const PIC_NAMES = ["ANDI", "DENI", "BENY", "DODI"];
const ORGANIZATIONS = [
  "Organisasi Sosial A",
  "Yayasan Masyarakat B",
  "Kelompok Komunitas C",
  "Lembaga Amal D",
];

const STATUSES = ["In Progress", "Siap Diambil", "Done"];
const BRIGHT_STATUSES = ["Pending", "Approved", "Rejected"];
const REJECT_REASONS = [
  "Proposal tidak sesuai dengan kriteria pemilihan.",
  "Dokumen pendukung tidak lengkap.",
  "Dana sudah habis untuk periode ini.",
  "Organisasi tidak terdaftar resmi.",
  "Detail produk tidak memenuhi standar kualitas.",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCaseId() {
  return String(Math.floor(Math.random() * 10000000)).padStart(7, "0");
}

// Generate random date within a specific month
function getRandomDateInMonth(yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = getRandomInt(1, daysInMonth);
  const date = new Date(year, month - 1, day);
  return date.toISOString().split("T")[0];
}

function generateDustDistribution(totalDus, numProposals) {
  const baseDus = Math.floor(totalDus / numProposals);
  const remainder = totalDus - baseDus * numProposals;

  const distribution = Array(numProposals).fill(baseDus);

  for (let i = 0; i < remainder; i++) {
    distribution[i]++;
  }

  // Shuffle
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
  }

  return distribution;
}

async function insertDummyProposals2026Realistic() {
  try {
    console.log(
      "📝 Mulai membuat dummy proposal 2026 (Jan-Jul) dengan pola musiman...\n",
    );

    const allProposals = [];
    let totalInserted = 0;
    let grandTotal = 0;

    for (const [yearMonth, monthData] of Object.entries(monthlyData)) {
      const totalDus = Math.round(monthData.budget / PRICE_PER_DUS);
      const numProposals = monthData.proposals;
      const dusDist = generateDustDistribution(totalDus, numProposals);

      const [, month] = yearMonth.split("-");
      const monthName = [
        "",
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
      ][parseInt(month)];

      console.log(
        `📊 ${yearMonth} (${monthName}): Rp${monthData.budget.toLocaleString("id-ID")} = ${totalDus} dus, ${numProposals} proposal`,
      );

      let monthTotal = 0;
      for (let i = 0; i < numProposals; i++) {
        const dus = dusDist[i];
        const budget = dus * PRICE_PER_DUS;
        monthTotal += budget;

        const bright_status = getRandomElement(BRIGHT_STATUSES);
        const reject_reason =
          bright_status === "Rejected"
            ? getRandomElement(REJECT_REASONS)
            : null;

        const proposal = {
          case_id: getRandomCaseId(),
          proposal_name: `Proposal Bantuan ${yearMonth}-${i + 1}`,
          organization: getRandomElement(ORGANIZATIONS),
          bentuk_donasi: "Air Mineral",
          product_detail: `Air mineral kemasan 600ml, ${dus} dus x 24 botol/dus`,
          jumlah_produk: `${dus} dus`,
          budget: budget,
          catatan: `Dummy data generated: ${dus} dus @ Rp${PRICE_PER_DUS.toLocaleString("id-ID")}/dus`,
          reject_reason: reject_reason,
          status: getRandomElement(STATUSES),
          bright_status: bright_status,
          pic_name: getRandomElement(PIC_NAMES),
          pic_email: `pic${i + 1}@company.com`,
          proposal_date: getRandomDateInMonth(yearMonth),
          proposal_file_name: null,
          proposal_file_path: null,
          proof_file_name: null,
          proof_file_path: null,
        };

        allProposals.push(proposal);
      }

      const diff = Math.abs(monthTotal - monthData.budget);
      console.log(
        `   ✓ Rp${monthTotal.toLocaleString("id-ID")} (diff: Rp${diff.toLocaleString("id-ID")})\n`,
      );
      grandTotal += monthTotal;
    }

    console.log(
      `Total untuk Jan-Jul 2026: Rp${grandTotal.toLocaleString("id-ID")}\n`,
    );

    // Insert semua proposal ke database
    console.log(
      `📥 Memasukkan ${allProposals.length} proposal ke database...\n`,
    );

    for (let i = 0; i < allProposals.length; i++) {
      const p = allProposals[i];
      try {
        const [result] = await pool.query(
          `INSERT INTO donation_proposals 
          (case_id, proposal_name, organization, bentuk_donasi, product_detail, jumlah_produk, budget, catatan, reject_reason, status, bright_status, pic_name, pic_email, proposal_date, proposal_file_name, proposal_file_path, proof_file_name, proof_file_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.case_id,
            p.proposal_name,
            p.organization,
            p.bentuk_donasi,
            p.product_detail,
            p.jumlah_produk,
            p.budget,
            p.catatan,
            p.reject_reason,
            p.status,
            p.bright_status,
            p.pic_name,
            p.pic_email,
            p.proposal_date,
            p.proposal_file_name,
            p.proposal_file_path,
            p.proof_file_name,
            p.proof_file_path,
          ],
        );
        totalInserted++;

        if ((i + 1) % 50 === 0) {
          console.log(`   ✓ ${i + 1}/${allProposals.length} inserted...`);
        }
      } catch (err) {
        console.warn(
          `   ⚠️  Gagal insert ${p.case_id}: ${err.message.slice(0, 80)}`,
        );
      }
    }

    console.log(
      `\n✅ Selesai! ${totalInserted} proposal berhasil dimasukkan.\n`,
    );

    // Tampilkan ringkasan dari database
    console.log("📊 Ringkasan Database (semua tahun):\n");
    const [stats] = await pool.query(`
      SELECT 
        YEAR(proposal_date) as year,
        COUNT(*) as count,
        SUM(budget) as total_budget
      FROM donation_proposals
      GROUP BY YEAR(proposal_date)
      ORDER BY year
    `);

    if (stats.length > 0) {
      for (const stat of stats) {
        console.log(
          `${stat.year}:\n  - Proposals: ${stat.count}, Total Budget: Rp${stat.total_budget.toLocaleString("id-ID")}`,
        );
      }
    }

    const [total] = await pool.query(
      "SELECT COUNT(*) as total FROM donation_proposals",
    );
    console.log(`\n📈 Total proposals di DB: ${total[0].total}\n`);

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await pool.end();
    process.exit(1);
  }
}

insertDummyProposals2026Realistic();
