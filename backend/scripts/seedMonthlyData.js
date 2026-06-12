const pool = require("../src/config/db");

// Reference data - rotasi dengan modulo
const ORGS = [
  { org: "Warga Desa Sukamaju", pic: "Pak Ilham", email: "ilham@csr.com" },
  {
    org: "Karang Taruna Mekarsari",
    pic: "Bu Sarah",
    email: "sarah@csr.com",
  },
  { org: "Yayasan Maju Bersama", pic: "Pak Ahmad", email: "ahmad@csr.com" },
  { org: "Komunitas Peduli Anak", pic: "Bu Siti", email: "siti@csr.com" },
  {
    org: "Panti Asuhan Harapan Baru",
    pic: "Pak Budi",
    email: "budi@csr.com",
  },
  { org: "Rumah Singgah Cahaya", pic: "Bu Lina", email: "lina@csr.com" },
  {
    org: "Relawan Peduli Lansia",
    pic: "Pak Hendra",
    email: "hendra@csr.com",
  },
  {
    org: "Yayasan Pendidikan Islam",
    pic: "Bu Nabila",
    email: "nabila@csr.com",
  },
  { org: "DKM Masjid Al-Ikhlas", pic: "Pak Deni", email: "deni@csr.com" },
  { org: "PKK Kelurahan Maju", pic: "Bu Rina", email: "rina@csr.com" },
];

const PROPOSAL_NAMES = [
  "Bantuan Air Bersih Masyarakat",
  "Program Beasiswa Pendidikan",
  "Klinik Kesehatan Gratis",
  "Pelatihan Keterampilan Warga",
  "Bantuan Sembako Dhuafa",
  "Renovasi Fasilitas Ibadah",
  "Program Gizi Anak Balita",
  "Santunan Anak Yatim",
  "Pelatihan UMKM Lokal",
  "Bantuan Korban Bencana",
  "Program Literasi Digital",
  "Pemberdayaan Ibu Rumah Tangga",
];

const STATUS_ROTATION = [
  "Done",
  "Done",
  "Done",
  "Done",
  "Done",
  "Done",
  "Done",
  "Done",
  "Siap Diambil",
  "In Progress",
];

const SEASONAL_WEIGHTS = [
  0.055, 0.06, 0.07, 0.085, 0.09, 0.095, 0.1, 0.095, 0.09, 0.085, 0.08, 0.095,
];

// Fungsi distribusi bulanan yang menjamin total tepat
function distributeMonthly(total, weights) {
  const raw = weights.map((w) => w * total);
  const counts = raw.map((v) => Math.max(1, Math.round(v)));
  const diff = total - counts.reduce((a, b) => a + b, 0);
  // koreksi selisih pembulatan di bulan tengah (Juli, index 6)
  counts[6] += diff;
  return counts;
}

// Hitung budget per proposal dengan koreksi untuk pas dengan target bulanan
function calculateBudgetPerProposal(monthlyBudget, proposalCount, proposalIndex) {
  const budgetPerUnit = monthlyBudget / proposalCount;
  
  // Jika proposal terakhir, hitung sisa agar total tepat
  if (proposalIndex === proposalCount - 1) {
    const budgetForOthers = budgetPerUnit * proposalIndex;
    return monthlyBudget - budgetForOthers;
  }
  
  return budgetPerUnit;
}

// Hitung jumlah hari dalam bulan
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// Format tanggal ke YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function seedMonthlyData() {
  let connection;
  try {
    connection = await pool.getConnection();

    console.log("\n🌱 Mulai seed data bulanan CSR Proposals 2023-2025\n");

    // Step 1: Hapus data dummy lama
    console.log("🗑️  Menghapus data dummy lama...");
    await connection.query(
      "DELETE FROM donation_proposals WHERE case_id LIKE 'CSR-%-DUMMY-%'"
    );
    console.log("✅ Data lama berhasil dihapus\n");

    // Data target per tahun
    const yearTargets = {
      2023: { total: 148, budget: 185000000 },
      2024: { total: 162, budget: 213000000 },
      2025: { total: 155, budget: 204000000 },
    };

    let globalSerialNumber = 1; // nomor serial global 0001-0465

    // Step 2-4: Insert data per tahun
    for (const [year, target] of Object.entries(yearTargets)) {
      const yearNum = parseInt(year);
      console.log(`📅 Insert data ${year}... (${target.total} proposal)`);

      // Distribusi bulanan
      const monthlyProposals = distributeMonthly(
        target.total,
        SEASONAL_WEIGHTS
      );
      const monthlyBudgets = distributeMonthly(target.budget, SEASONAL_WEIGHTS);

      let monthSummary = "  ✓ ";
      let proposalIndex = 0; // untuk rotasi status

      for (let month = 1; month <= 12; month++) {
        const proposalCount = monthlyProposals[month - 1];
        const monthlyBudget = monthlyBudgets[month - 1];
        const daysInMonth = getDaysInMonth(month, yearNum);

        // Insert proposals untuk bulan ini
        for (let i = 0; i < proposalCount; i++) {
          const serialNum = String(globalSerialNumber).padStart(4, "0");
          const caseId = `CSR-${yearNum}-DUMMY-${serialNum}`;

          // Rotasi data referensi
          const orgData = ORGS[globalSerialNumber % ORGS.length];
          const proposalName =
            PROPOSAL_NAMES[globalSerialNumber % PROPOSAL_NAMES.length];
          const status = STATUS_ROTATION[proposalIndex % STATUS_ROTATION.length];

          // Tentukan bright_status berdasarkan status
          const brightStatus = ["Done", "Siap Diambil"].includes(status)
            ? "Approved"
            : "Pending";

          // Generate random date dalam bulan tersebut
          const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
          const proposalDate = new Date(yearNum, month - 1, randomDay);
          const proposalDateStr = formatDate(proposalDate);

          // Hitung budget dengan koreksi untuk proposal terakhir dalam bulan
          const finalBudget = calculateBudgetPerProposal(
            monthlyBudget,
            proposalCount,
            i
          );

          // Insert ke database
          await connection.query(
            `INSERT INTO donation_proposals (
              case_id, proposal_name, organization, bentuk_donasi,
              tipe_proposal, product_detail, jumlah_produk, budget,
              status, bright_status, pic_name, pic_email, proposal_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              caseId,
              proposalName,
              orgData.org,
              "Uang & Barang", // default bentuk donasi
              "Rutin", // default tipe proposal
              "2 Dus Aqua 330ml, 5 Dus Aqua 600ml",
              "10 Item",
              finalBudget,
              status,
              brightStatus,
              orgData.pic,
              orgData.email,
              proposalDateStr,
            ]
          );

          globalSerialNumber++;
          proposalIndex++;
        }

        // Tambahkan ke summary per bulan
        const monthName = new Date(yearNum, month - 1).toLocaleString(
          "id-ID",
          { month: "short" }
        );
        monthSummary += `${monthName}: ${proposalCount} | `;
      }

      console.log(monthSummary.slice(0, -3)); // hapus " | " di akhir
      console.log(`  ✅ Total ${yearNum}: ${target.total} proposal\n`);
    }

    // Step 5: Verifikasi
    console.log("📊 Verifikasi data yang berhasil diinsert:");
    const [verify] = await connection.query(`
      SELECT YEAR(proposal_date) AS tahun,
             COUNT(*) AS jumlah_proposal,
             SUM(budget) AS total_budget
      FROM donation_proposals
      WHERE case_id LIKE 'CSR-%-DUMMY-%'
      GROUP BY tahun ORDER BY tahun
    `);

    console.table(verify);

    // Validasi hasil vs target
    console.log("\n✅ Validasi target:");
    let allValid = true;
    for (const row of verify) {
      const year = row.tahun;
      const target = yearTargets[year];
      const totalBudget = Math.round(parseFloat(row.total_budget));
      const proposalValid =
        row.jumlah_proposal === target.total ? "✓" : "✗";
      const budgetValid = totalBudget === target.budget ? "✓" : "✗";

      console.log(
        `   ${year}: Proposal ${proposalValid} (${row.jumlah_proposal}/${target.total}) | Budget ${budgetValid} (Rp ${totalBudget.toLocaleString("id-ID")} / Rp ${target.budget.toLocaleString("id-ID")})`
      );

      if (row.jumlah_proposal !== target.total || totalBudget !== target.budget) {
        allValid = false;
      }
    }

    if (allValid) {
      console.log("\n✅ Seed selesai! Total: 465 proposal berhasil diinsert.");
      process.exit(0);
    } else {
      console.log("\n⚠️  Ada ketidaksesuaian dengan target!");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Error saat seed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

// Jalankan
seedMonthlyData();
