const pool = require("../src/config/db");
require("dotenv").config();

const PRICE_PER_DUS = 63000;

// Data anggaran per tahun
const budgetData = {
  2023: {
    total_budget: 195170466,
    min_proposals: 310,
    max_proposals: 443,
  },
  2024: {
    total_budget: 209351926,
    min_proposals: 332,
    max_proposals: 475,
  },
  2025: {
    total_budget: 230091479,
    min_proposals: 365,
    max_proposals: 522,
  },
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

function getRandomDate(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
}

function generateDustDistribution(totalDus, numProposals) {
  // Distribusikan dus ke proposal (target 7-10 dus/proposal)
  const baseDus = Math.floor(totalDus / numProposals);
  const remainder = totalDus - baseDus * numProposals;

  const distribution = Array(numProposals).fill(baseDus);

  // Tambahkan sisa ke proposal pertama
  for (let i = 0; i < remainder; i++) {
    distribution[i]++;
  }

  // Shuffle untuk terlihat acak
  for (let i = distribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
  }

  return distribution;
}

async function insertDummyProposals() {
  try {
    console.log("📝 Mulai membuat dummy proposal untuk 2023-2025...\n");

    const allProposals = [];
    let totalInserted = 0;

    for (const year of [2023, 2024, 2025]) {
      const yearData = budgetData[year];
      const totalDus = Math.round(yearData.total_budget / PRICE_PER_DUS);
      const numProposals = getRandomInt(
        yearData.min_proposals,
        yearData.max_proposals,
      );
      const dusDist = generateDustDistribution(totalDus, numProposals);

      console.log(
        `📊 Tahun ${year}: Anggaran Rp${yearData.total_budget.toLocaleString(
          "id-ID",
        )} = ${totalDus} dus, ${numProposals} proposal`,
      );

      let yearTotal = 0;
      for (let i = 0; i < numProposals; i++) {
        const dus = dusDist[i];
        const budget = dus * PRICE_PER_DUS;
        yearTotal += budget;

        const bright_status = getRandomElement(BRIGHT_STATUSES);
        const reject_reason =
          bright_status === "Rejected"
            ? getRandomElement(REJECT_REASONS)
            : null;

        const proposal = {
          case_id: getRandomCaseId(),
          proposal_name: `Proposal Bantuan ${year}-${i + 1}`,
          organization: getRandomElement(ORGANIZATIONS),
          bentuk_donasi: "Air Mineral",
          product_detail: `Air mineral kemasan 600ml, ${dus} dus x 24 botol/dus`,
          jumlah_produk: `${dus} dus`,
          budget: budget,
          catatan: `Dummy data generated: ${dus} dus @ Rp${PRICE_PER_DUS.toLocaleString(
            "id-ID",
          )}/dus`,
          reject_reason: reject_reason,
          status: getRandomElement(STATUSES),
          bright_status: bright_status,
          pic_name: getRandomElement(PIC_NAMES),
          pic_email: `pic${i + 1}@company.com`,
          proposal_date: getRandomDate(year),
          proposal_file_name: null,
          proposal_file_path: null,
          proof_file_name: null,
          proof_file_path: null,
        };

        allProposals.push(proposal);
      }

      const expectedTotal = yearData.total_budget;
      const diff = Math.abs(yearTotal - expectedTotal);
      console.log(
        `   Total budget terkumpul: Rp${yearTotal.toLocaleString(
          "id-ID",
        )} (diff: Rp${diff.toLocaleString("id-ID")})\n`,
      );
    }

    // Insert semua proposal ke database
    console.log(
      `\n📥 Memasukkan ${allProposals.length} proposal ke database...\n`,
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

        if ((i + 1) % 100 === 0) {
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
    const [stats] = await pool.query(`
      SELECT 
        YEAR(proposal_date) as tahun,
        COUNT(*) as jumlah_proposal,
        SUM(CAST(jumlah_produk AS UNSIGNED)) as total_dus,
        SUM(budget) as total_budget
      FROM donation_proposals
      WHERE YEAR(proposal_date) IN (2023, 2024, 2025)
      GROUP BY YEAR(proposal_date)
      ORDER BY tahun
    `);

    console.log("📊 Ringkasan Database:\n");
    stats.forEach((row) => {
      console.log(`${row.tahun}:`);
      console.log(
        `  - Proposals: ${row.jumlah_proposal}, Total Budget: Rp${row.total_budget.toLocaleString(
          "id-ID",
        )}`,
      );
    });

    const [totalCount] = await pool.query(
      `SELECT COUNT(*) as count FROM donation_proposals`,
    );
    console.log(`\n📈 Total proposals di DB: ${totalCount[0].count}\n`);

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    try {
      await pool.end();
    } catch (e) {}
    process.exit(1);
  }
}

insertDummyProposals();
