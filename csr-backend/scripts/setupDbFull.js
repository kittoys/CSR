const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    console.log("🔧 Creating database and tables...");

    // Create database
    await connection.query("CREATE DATABASE IF NOT EXISTS csr_db");
    await connection.query("USE csr_db");

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS csr_programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT,
        location VARCHAR(255),
        start_date DATE,
        end_date DATE,
        status ENUM('planned', 'ongoing', 'completed') DEFAULT 'planned',
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS donation_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        case_id VARCHAR(20) UNIQUE NOT NULL,
        proposal_name VARCHAR(255) NOT NULL,
        organization VARCHAR(255),
        bentuk_donasi VARCHAR(100),
        tipe_proposal VARCHAR(100),
        product_detail TEXT,
        jumlah_produk VARCHAR(255),
        budget DECIMAL(15,2),
        catatan TEXT,
        status ENUM('In Progress', 'Siap Diambil', 'Done') DEFAULT 'In Progress',
        bright_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT NULL,
        pic_name VARCHAR(255),
        pic_email VARCHAR(255),
        proposal_date DATE,
        file_pendukung VARCHAR(255),
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables created");

    // Insert admin user
    // Password: admin123 (hashed with bcrypt)
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await connection.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ["admin@csr.com", hashedPassword, "Admin User", "admin"]
    );

    console.log("✅ Admin user inserted (password: admin123)");

    // Insert categories
    await connection.query(
      `INSERT INTO categories (name, description) VALUES 
       ('Lingkungan', 'Program yang fokus pada keberlanjutan lingkungan'),
       ('Pendidikan', 'Program pemberdayaan di bidang pendidikan'),
       ('Kesehatan', 'Program kesehatan masyarakat'),
       ('Ekonomi', 'Program pemberdayaan ekonomi lokal')
       ON DUPLICATE KEY UPDATE description = VALUES(description)`
    );

    console.log("✅ Categories inserted");

    // Clear old programs
    await connection.query("DELETE FROM csr_programs");
    console.log("🗑️  Old programs cleared");

    // Insert new programs
    const programs = [
      [
        "Program Penanaman Pohon",
        "Penanaman 10.000 pohon di kawasan hutan rusak untuk mengurangi emisi karbon dan menciptakan hutan kota yang berkelanjutan.",
        1,
        "Bogor, Jawa Barat",
        "2025-01-15",
        "2025-03-15",
        "planned",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Beasiswa Pendidikan",
        "Memberikan beasiswa kepada 100 siswa berprestasi dari keluarga kurang mampu untuk melanjutkan pendidikan ke jenjang yang lebih tinggi.",
        2,
        "Jakarta dan sekitarnya",
        "2025-02-01",
        "2025-12-31",
        "ongoing",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Klinik Kesehatan Gratis",
        "Layanan kesehatan gratis untuk masyarakat kurang mampu termasuk pemeriksaan rutin, imunisasi, dan perawatan gigi.",
        3,
        "Bekasi",
        "2024-12-20",
        "2025-01-31",
        "completed",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Program Dapur Umum Desa",
        "Pemberdayaan ekonomi masyarakat melalui pembukaan dapur umum yang menghasilkan makanan berkualitas dengan harga terjangkau.",
        4,
        "Sukabumi, Jawa Barat",
        "2025-03-01",
        "2025-06-30",
        "planned",
        "https://images.unsplash.com/photo-1556910103-2b02b30a0992?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Pemberdayaan UMKM Lokal",
        "Program pelatihan dan modal usaha untuk meningkatkan kapasitas UMKM lokal dalam mengembangkan bisnis mereka.",
        4,
        "Bandung, Jawa Barat",
        "2025-01-20",
        "2025-08-31",
        "ongoing",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Konservasi Air Bersih",
        "Program konservasi dan penyediaan sumber air bersih di daerah terpencil melalui pembangunan sumur bor dan sistem panen air hujan.",
        1,
        "Cianjur, Jawa Barat",
        "2024-11-01",
        "2025-02-28",
        "ongoing",
        "https://images.unsplash.com/photo-1559619048-7f4e676529f2?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Program Literasi Digital",
        "Pelatihan literasi digital dan penggunaan teknologi untuk meningkatkan kompetensi digital masyarakat perkotaan dan pedesaan.",
        2,
        "Depok, Jawa Barat",
        "2025-02-15",
        "2025-05-15",
        "planned",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Rehabilitasi Anak Tunanetra",
        "Program rehabilitasi dan pelatihan keterampilan untuk anak-anak tunanetra agar dapat mandiri dan berintegrasi dalam masyarakat.",
        2,
        "Jakarta Selatan",
        "2024-10-01",
        "2025-03-31",
        "completed",
        "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Penyuluhan Pertanian Organik",
        "Program sosialisasi dan pelatihan pertanian organik untuk meningkatkan hasil panen dan mengurangi penggunaan pupuk kimia berbahaya.",
        1,
        "Garut, Jawa Barat",
        "2025-04-01",
        "2025-07-31",
        "planned",
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Program Pemberian Nutrisi Anak",
        "Pemberian makanan bergizi kepada 200 anak dari keluarga miskin untuk meningkatkan kesehatan dan prestasi belajar mereka.",
        3,
        "Bogor Utara",
        "2025-01-10",
        "2025-12-31",
        "ongoing",
        "https://images.unsplash.com/photo-1449521908519-c73955dc6d92?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Program Pembersihan Pantai dan Pesisir",
        "Program pembersihan dan konservasi pantai serta mangrove untuk menjaga ekosistem laut dan mencegah erosi garis pantai.",
        1,
        "Tangerang, Banten",
        "2025-02-20",
        "2025-05-20",
        "ongoing",
        "https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Adaptasi Perubahan Iklim di Pertanian",
        "Program pelatihan petani dalam adaptasi terhadap perubahan iklim melalui teknologi pertanian berkelanjutan dan irigasi efisien.",
        1,
        "Purwakarta, Jawa Barat",
        "2025-03-10",
        "2025-08-10",
        "planned",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Koperasi Daur Ulang dan Pengolahan Sampah",
        "Pembentukan koperasi masyarakat untuk mengelola sampah plastik menjadi produk bernilai jual tinggi untuk meningkatkan ekonomi lokal.",
        4,
        "Depok, Jawa Barat",
        "2025-01-25",
        "2025-06-25",
        "ongoing",
        "https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Pelatihan Keterampilan dan Kewirausahaan Muda",
        "Program pelatihan keterampilan (menjahit, elektronik, tukang kayu) dan kewirausahaan untuk pemuda putus sekolah dan menganggur.",
        4,
        "Jakarta, Bekasi, Tangerang",
        "2025-02-05",
        "2025-07-05",
        "planned",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Kemitraan Petani dengan Pasar Modern",
        "Program kemitraan antara petani lokal dengan toko modern untuk meningkatkan pemasaran dan harga jual produk pertanian.",
        4,
        "Bogor, Sukabumi, Cianjur",
        "2025-02-10",
        "2025-08-10",
        "ongoing",
        "https://images.unsplash.com/photo-1488459716781-6818f2af8d51?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Rehabilitasi Lahan Degradasi",
        "Program penghijauan dan perbaikan kualitas tanah di lahan-lahan yang mengalami degradasi akibat penambangan atau pertanian intensif.",
        1,
        "Tasikmalaya, Jawa Barat",
        "2025-04-01",
        "2025-09-30",
        "planned",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
      ],
      [
        "Usaha Bersama Kerajinan Tangan Lokal",
        "Pemberdayaan pengrajin lokal untuk meningkatkan kualitas produk dan akses ke pasar regional dan internasional.",
        4,
        "Bandung, Garut, Tasikmalaya",
        "2025-01-30",
        "2025-12-30",
        "ongoing",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      ],
    ];

    for (const program of programs) {
      await connection.query(
        `INSERT INTO csr_programs (title, description, category_id, location, start_date, end_date, status, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        program
      );
    }

    console.log(`✅ ${programs.length} programs inserted`);

    // Clear old proposals first
    await connection.query("DELETE FROM donation_proposals");
    console.log("🗑️  Old proposals cleared");

    // Insert donation proposals
    const proposals = [
      [
        "CSR-2025-001",
        "Bantuan Air Bersih Desa",
        "Kepala Desa A",
        "Air mineral kemasan 200ml, 50 dus",
        500000,
        "In Progress",
        "Pak Ilham",
        "ilham@company.com",
        "2025-01-15",
      ],
      [
        "CSR-2025-002",
        "Paket Sembako Keluarga Kurang Mampu",
        "Kelurahan Merdeka",
        "Beras, minyak, gula, telur 100 paket",
        2000000,
        "Siap Diambil",
        "Bu Siti",
        "siti@company.com",
        "2025-01-20",
      ],
      [
        "CSR-2025-003",
        "Perayaan Maulid Nabi",
        "Masjid Al-Balman",
        "Paket makanan dan dekorasi 30 box",
        3000000,
        "Siap Diambil",
        "Pak Ilham",
        "ilham@company.com",
        "2025-01-10",
      ],
      [
        "CSR-2025-004",
        "Peralatan Sekolah Siswa Berprestasi",
        "SD Negeri 5 Depok",
        "Tas sekolah, alat tulis lengkap 50 set",
        1500000,
        "In Progress",
        "Bu Rini",
        "rini@company.com",
        "2025-02-05",
      ],
      [
        "CSR-2025-005",
        "Perlengkapan Olahraga Komunitas",
        "LDII Kota Jakarta",
        "Bola, cone, raket badminton 30 set",
        3500000,
        "In Progress",
        "Pak Budi",
        "budi@company.com",
        "2025-02-12",
      ],
      [
        "CSR-2025-006",
        "Bantuan Kebutuhan Ibu Hamil",
        "Puskesmas Mampang",
        "Vitamin, susu, makanan bergizi 100 paket",
        5000000,
        "Siap Diambil",
        "Bu Dewi",
        "dewi@company.com",
        "2025-02-18",
      ],
      [
        "CSR-2024-039",
        "Pelatihan Keterampilan Menjahit",
        "PKK Kelurahan Maju",
        "Mesin jahit, kain, benang 50 set",
        12000000,
        "In Progress",
        "Bu Sarah",
        "sarah@company.com",
        "2024-12-08",
      ],
      [
        "CSR-2024-032",
        "Program Kesehatan Lansia Gratis",
        "Puskesmas Kecamatan Grogol",
        "Obat-obatan, pemeriksaan 200 paket",
        8000000,
        "In Progress",
        "Pak Ahmad",
        "ahmad@company.com",
        "2024-12-11",
      ],
      [
        "CSR-2024-028",
        "Bantuan Korban Bencana Banjir",
        "PMI Cabang Kota Jakarta",
        "Paket sembako, tenda 500 paket",
        15000000,
        "Siap Diambil",
        "Pak Ilham",
        "ilham@company.com",
        "2024-05-10",
      ],
      [
        "CSR-2024-021",
        "Renovasi Atap Masjid Desa",
        "DKM Masjid Al-Ikhlas",
        "Genteng, semen, pasir 1 paket",
        25000000,
        "Done",
        "Bu Sarah",
        "sarah@company.com",
        "2024-10-09",
      ],
      [
        "CSR-2024-015",
        "Program Beasiswa Pendidikan",
        "Yayasan Peduli Anak Yatim",
        "Beasiswa penuh SD-SMA 20 penerima",
        10000000,
        "Done",
        "Pak Ilham",
        "ilham@company.com",
        "2024-08-15",
      ],
      [
        "CSR-2024-008",
        "Klinik Kesehatan Mobile",
        "Kelurahan Cipinang",
        "Alat medis, obat, vitamin 5 lokasi",
        7500000,
        "Done",
        "Dr. Eka",
        "eka@company.com",
        "2024-07-22",
      ],
      [
        "CSR-2024-005",
        "Program Literasi Anak Perkotaan",
        "Komunitas Baca Bogor",
        "Buku cerita anak, lemari buku 15 set",
        4000000,
        "Done",
        "Bu Maya",
        "maya@company.com",
        "2024-06-30",
      ],
    ];

    for (const proposal of proposals) {
      try {
        await connection.query(
          `INSERT INTO donation_proposals (case_id, proposal_name, organization, product_detail, budget, status, pic_name, pic_email, proposal_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          proposal
        );
      } catch (err) {
        // Ignore duplicate key errors
      }
    }

    console.log(`✅ ${proposals.length} proposals inserted`);

    // Verify
    const [userCount] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    const [catCount] = await connection.query(
      "SELECT COUNT(*) as count FROM categories"
    );
    const [progCount] = await connection.query(
      "SELECT COUNT(*) as count FROM csr_programs"
    );
    const [propCount] = await connection.query(
      "SELECT COUNT(*) as count FROM donation_proposals"
    );

    console.log("\n📊 Database Summary:");
    console.log(`  Users: ${userCount[0].count}`);
    console.log(`  Categories: ${catCount[0].count}`);
    console.log(`  Programs: ${progCount[0].count}`);
    console.log(`  Proposals: ${propCount[0].count}`);

    await connection.end();
    console.log("\n✅ Database setup completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setupDatabase();
