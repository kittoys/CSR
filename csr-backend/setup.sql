-- Buat database CSR jika belum ada
CREATE DATABASE IF NOT EXISTS csr_db;
USE csr_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel csr_programs
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
);

-- Tambah kolom image_url jika belum ada (untuk DB yang sudah berjalan)
ALTER TABLE csr_programs ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) AFTER status;

-- Insert sample admin user (password: admin123 - harus di-hash dengan bcrypt di production)
-- Untuk testing: gunakan password yang sudah di-hash
-- Buat user admin dengan password: admin123 (hashed dengan bcrypt)
INSERT INTO users (email, password, name, role) VALUES 
('admin@csr.com', '$2b$10$X1Z2q8K9pL3wM5n7bV6cZeY4tR8sQ2jH1uI0fP9eO8dN7cM6bL5', 'Admin User', 'admin');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Lingkungan', 'Program yang fokus pada keberlanjutan lingkungan'),
('Pendidikan', 'Program pemberdayaan di bidang pendidikan'),
('Kesehatan', 'Program kesehatan masyarakat'),
('Ekonomi', 'Program pemberdayaan ekonomi lokal');

-- Tabel donation_proposals (untuk proposal donasi)
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
);

-- Insert sample programs
INSERT INTO csr_programs (title, description, category_id, location, start_date, end_date, status, image_url) VALUES 
('Program Penanaman Pohon', 'Penanaman 10.000 pohon di kawasan hutan rusak', 1, 'Bogor, Jawa Barat', '2025-01-15', '2025-03-15', 'planned', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80'),
('Beasiswa Pendidikan', 'Memberikan beasiswa kepada 100 siswa berprestasi', 2, 'Jakarta dan sekitarnya', '2025-02-01', '2025-12-31', 'ongoing', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80'),
('Klinik Kesehatan Gratis', 'Layanan kesehatan gratis untuk masyarakat kurang mampu', 3, 'Bekasi', '2024-12-20', '2025-01-31', 'completed', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80');

-- Insert sample donation proposals
INSERT INTO donation_proposals (case_id, proposal_name, organization, product_detail, budget, status, pic_name, pic_email, proposal_date) VALUES 
('CSR-2025-001', 'Proposal Bantuan Air Bersi...', 'Kepala Desa A', 'Air mineral kemasan 200ml. 50 dus 200ml', 500000, 'In Progress', 'Pak Ilham', 'ilham@company.com', '2025-01-15'),
('CSR-2025-003', 'PHBI MAULID NABI', 'MASID AL-Balman', 'Produk 30 Box 200M 30 Box 200M', 3000000, 'Siap Diambil', 'Pak Ilham', 'ilham@company.com', '2025-01-10'),
('CSR-2024-039', 'Pelatihan Keterampilan Ibu...', 'PKK Kelurahan Maju', 'Peralatan jahit dan bordir unt... 50 set alat', 12000000, 'In Progress', 'Bu Sarah', 'sarah@company.com', '2024-12-08'),
('CSR-2024-032', 'Program Kesehatan Lansia', 'Puskesmas Kecamat...', 'Paket obat dan vitamin untuk... 200 paket obat', 8000000, 'In Progress', 'Pak Ahmad', 'ahmad@company.com', '2024-12-11'),
('CSR-2024-028', 'Bantuan Korban Banjir', 'PMI Cabang Kota', 'Paket sembako untuk korban ... 500 paket', 15000000, 'Siap Diambil', 'Pak Ilham', 'ilham@company.com', '2024-05-10'),
('CSR-2024-021', 'Renovasi Masjid Desa Suka...', 'DKM Masjid Al-Ikhlas', 'Material untuk renovasi atap ... 1 paket renovasi', 25000000, 'Done', 'Bu Sarah', 'sarah@company.com', '2024-10-09'),
('CSR-2024-015', 'Bantuan Pendidikan Anak-Y...', 'Yayasan Peduli Anak', 'Beasiswa pendidikan untuk a... 20 beasiswa', 10000000, 'Done', 'Pak Ilham', 'ilham@company.com', '2024-08-15');
