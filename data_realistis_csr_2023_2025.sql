-- ============================================================
-- DATA REALISTIS CSR 2023-2025 (Pola Musiman Nyata)
-- Jan/Feb rendah | Mar/Apr spike Ramadan/Lebaran
-- Jul/Agu naik tahun ajaran | Nov/Des spike tutup RKAP
-- 2023: 148 proposal Rp185jt | 2024: 162 Rp213jt | 2025: 155 Rp204jt
-- ============================================================
USE csr_db;

-- Bersihkan SEMUA data lama
DELETE FROM donation_proposals WHERE case_id LIKE 'CSR-%-DUMMY-%' OR case_id LIKE 'CSR-%-TEST-%' OR case_id IN ('CSR-2025-001','CSR-2025-003','CSR-2024-039','CSR-2024-032','CSR-2024-028','CSR-2024-021','CSR-2024-015');

-- TAHUN 2023 | 148 proposal | Rp185,000,000
-- 2023-01 (Jan): 6 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0001','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-01-30'),
  ('CSR-2023-DUMMY-0002','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-01-18'),
  ('CSR-2023-DUMMY-0003','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-01-03'),
  ('CSR-2023-DUMMY-0004','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-01-15'),
  ('CSR-2023-DUMMY-0005','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-01-17'),
  ('CSR-2023-DUMMY-0006','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-01-29');

-- 2023-02 (Feb): 7 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0007','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-02-15'),
  ('CSR-2023-DUMMY-0008','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-02-20'),
  ('CSR-2023-DUMMY-0009','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-02-06'),
  ('CSR-2023-DUMMY-0010','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-02-17'),
  ('CSR-2023-DUMMY-0011','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-02-22'),
  ('CSR-2023-DUMMY-0012','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-02-06'),
  ('CSR-2023-DUMMY-0013','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-02-02');

-- 2023-03 (Mar): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0014','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-03-21'),
  ('CSR-2023-DUMMY-0015','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-03-07'),
  ('CSR-2023-DUMMY-0016','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Lina','lina@csr.com','2023-03-15'),
  ('CSR-2023-DUMMY-0017','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-03-09'),
  ('CSR-2023-DUMMY-0018','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-03-18'),
  ('CSR-2023-DUMMY-0019','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-03-13'),
  ('CSR-2023-DUMMY-0020','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-03-27'),
  ('CSR-2023-DUMMY-0021','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-03-25'),
  ('CSR-2023-DUMMY-0022','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-03-05'),
  ('CSR-2023-DUMMY-0023','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-03-12'),
  ('CSR-2023-DUMMY-0024','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-03-31'),
  ('CSR-2023-DUMMY-0025','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2023-03-23'),
  ('CSR-2023-DUMMY-0026','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Bu Lina','lina@csr.com','2023-03-16');

-- 2023-04 (Apr): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0027','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-04-25'),
  ('CSR-2023-DUMMY-0028','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-04-16'),
  ('CSR-2023-DUMMY-0029','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-04-26'),
  ('CSR-2023-DUMMY-0030','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-04-08'),
  ('CSR-2023-DUMMY-0031','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-04-28'),
  ('CSR-2023-DUMMY-0032','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-04-09'),
  ('CSR-2023-DUMMY-0033','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-04-04'),
  ('CSR-2023-DUMMY-0034','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-04-28'),
  ('CSR-2023-DUMMY-0035','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-04-27'),
  ('CSR-2023-DUMMY-0036','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-04-12'),
  ('CSR-2023-DUMMY-0037','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-04-06'),
  ('CSR-2023-DUMMY-0038','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-04-22'),
  ('CSR-2023-DUMMY-0039','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-04-03'),
  ('CSR-2023-DUMMY-0040','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-04-17');

-- 2023-05 (Mei): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0041','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-05-13'),
  ('CSR-2023-DUMMY-0042','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-05-25'),
  ('CSR-2023-DUMMY-0043','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-05-15'),
  ('CSR-2023-DUMMY-0044','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-05-08'),
  ('CSR-2023-DUMMY-0045','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-05-10'),
  ('CSR-2023-DUMMY-0046','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2023-05-28'),
  ('CSR-2023-DUMMY-0047','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-05-21'),
  ('CSR-2023-DUMMY-0048','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-05-08'),
  ('CSR-2023-DUMMY-0049','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-05-21'),
  ('CSR-2023-DUMMY-0050','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-05-24'),
  ('CSR-2023-DUMMY-0051','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-05-10'),
  ('CSR-2023-DUMMY-0052','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-05-04'),
  ('CSR-2023-DUMMY-0053','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-05-28');

-- 2023-06 (Jun): 12 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0054','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-06-10'),
  ('CSR-2023-DUMMY-0055','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-06-30'),
  ('CSR-2023-DUMMY-0056','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2023-06-22'),
  ('CSR-2023-DUMMY-0057','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-06-28'),
  ('CSR-2023-DUMMY-0058','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-06-11'),
  ('CSR-2023-DUMMY-0059','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-06-26'),
  ('CSR-2023-DUMMY-0060','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-06-16'),
  ('CSR-2023-DUMMY-0061','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-06-18'),
  ('CSR-2023-DUMMY-0062','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-06-05'),
  ('CSR-2023-DUMMY-0063','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-06-30'),
  ('CSR-2023-DUMMY-0064','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-06-29'),
  ('CSR-2023-DUMMY-0065','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Budi','budi@csr.com','2023-06-09');

-- 2023-07 (Jul): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0066','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-07-12'),
  ('CSR-2023-DUMMY-0067','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-07-23'),
  ('CSR-2023-DUMMY-0068','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-07-10'),
  ('CSR-2023-DUMMY-0069','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-07-31'),
  ('CSR-2023-DUMMY-0070','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-07-28'),
  ('CSR-2023-DUMMY-0071','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-07-07'),
  ('CSR-2023-DUMMY-0072','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-07-29'),
  ('CSR-2023-DUMMY-0073','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-07-22'),
  ('CSR-2023-DUMMY-0074','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-07-22'),
  ('CSR-2023-DUMMY-0075','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2023-07-06'),
  ('CSR-2023-DUMMY-0076','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-07-26'),
  ('CSR-2023-DUMMY-0077','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-07-21'),
  ('CSR-2023-DUMMY-0078','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-07-09'),
  ('CSR-2023-DUMMY-0079','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-07-22');

-- 2023-08 (Agu): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0080','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-08-26'),
  ('CSR-2023-DUMMY-0081','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-08-15'),
  ('CSR-2023-DUMMY-0082','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-08-30'),
  ('CSR-2023-DUMMY-0083','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-08-07'),
  ('CSR-2023-DUMMY-0084','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-08-09'),
  ('CSR-2023-DUMMY-0085','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2023-08-24'),
  ('CSR-2023-DUMMY-0086','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Lina','lina@csr.com','2023-08-28'),
  ('CSR-2023-DUMMY-0087','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-08-24'),
  ('CSR-2023-DUMMY-0088','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-08-14'),
  ('CSR-2023-DUMMY-0089','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-08-15'),
  ('CSR-2023-DUMMY-0090','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-08-18'),
  ('CSR-2023-DUMMY-0091','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-08-17'),
  ('CSR-2023-DUMMY-0092','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-08-21'),
  ('CSR-2023-DUMMY-0093','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-08-20');

-- 2023-09 (Sep): 12 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0094','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-09-21'),
  ('CSR-2023-DUMMY-0095','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2023-09-23'),
  ('CSR-2023-DUMMY-0096','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2023-09-19'),
  ('CSR-2023-DUMMY-0097','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-09-19'),
  ('CSR-2023-DUMMY-0098','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-09-10'),
  ('CSR-2023-DUMMY-0099','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-09-07'),
  ('CSR-2023-DUMMY-0100','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-09-25'),
  ('CSR-2023-DUMMY-0101','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-09-04'),
  ('CSR-2023-DUMMY-0102','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-09-28'),
  ('CSR-2023-DUMMY-0103','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-09-26'),
  ('CSR-2023-DUMMY-0104','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-09-13'),
  ('CSR-2023-DUMMY-0105','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2023-09-13');

-- 2023-10 (Okt): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0106','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-10-28'),
  ('CSR-2023-DUMMY-0107','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-10-29'),
  ('CSR-2023-DUMMY-0108','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-10-23'),
  ('CSR-2023-DUMMY-0109','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-10-13'),
  ('CSR-2023-DUMMY-0110','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-10-06'),
  ('CSR-2023-DUMMY-0111','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-10-27'),
  ('CSR-2023-DUMMY-0112','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-10-30'),
  ('CSR-2023-DUMMY-0113','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-10-30'),
  ('CSR-2023-DUMMY-0114','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-10-16'),
  ('CSR-2023-DUMMY-0115','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-10-19'),
  ('CSR-2023-DUMMY-0116','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-10-29'),
  ('CSR-2023-DUMMY-0117','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-10-21'),
  ('CSR-2023-DUMMY-0118','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-10-29');

-- 2023-11 (Nov): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0119','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-11-11'),
  ('CSR-2023-DUMMY-0120','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-11-14'),
  ('CSR-2023-DUMMY-0121','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-11-09'),
  ('CSR-2023-DUMMY-0122','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-11-06'),
  ('CSR-2023-DUMMY-0123','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-11-05'),
  ('CSR-2023-DUMMY-0124','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2023-11-19'),
  ('CSR-2023-DUMMY-0125','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2023-11-30'),
  ('CSR-2023-DUMMY-0126','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Lina','lina@csr.com','2023-11-02'),
  ('CSR-2023-DUMMY-0127','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-11-13'),
  ('CSR-2023-DUMMY-0128','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-11-02'),
  ('CSR-2023-DUMMY-0129','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-11-02'),
  ('CSR-2023-DUMMY-0130','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-11-11'),
  ('CSR-2023-DUMMY-0131','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-11-17'),
  ('CSR-2023-DUMMY-0132','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-11-08');

-- 2023-12 (Des): 16 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2023-DUMMY-0133','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-12-18'),
  ('CSR-2023-DUMMY-0134','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2023-12-03'),
  ('CSR-2023-DUMMY-0135','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2023-12-24'),
  ('CSR-2023-DUMMY-0136','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Lina','lina@csr.com','2023-12-22'),
  ('CSR-2023-DUMMY-0137','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-12-04'),
  ('CSR-2023-DUMMY-0138','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-12-24'),
  ('CSR-2023-DUMMY-0139','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2023-12-05'),
  ('CSR-2023-DUMMY-0140','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2023-12-27'),
  ('CSR-2023-DUMMY-0141','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2023-12-05'),
  ('CSR-2023-DUMMY-0142','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2023-12-05'),
  ('CSR-2023-DUMMY-0143','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2023-12-18'),
  ('CSR-2023-DUMMY-0144','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Siti','siti@csr.com','2023-12-03'),
  ('CSR-2023-DUMMY-0145','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2023-12-02'),
  ('CSR-2023-DUMMY-0146','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2023-12-25'),
  ('CSR-2023-DUMMY-0147','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2023-12-17'),
  ('CSR-2023-DUMMY-0148','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2023-12-21');

-- TAHUN 2024 | 162 proposal | Rp213,000,000
-- 2024-01 (Jan): 7 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0149','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-01-09'),
  ('CSR-2024-DUMMY-0150','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-01-11'),
  ('CSR-2024-DUMMY-0151','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-01-19'),
  ('CSR-2024-DUMMY-0152','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-01-02'),
  ('CSR-2024-DUMMY-0153','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-01-19'),
  ('CSR-2024-DUMMY-0154','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-01-13'),
  ('CSR-2024-DUMMY-0155','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-01-01');

-- 2024-02 (Feb): 8 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0156','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-02-03'),
  ('CSR-2024-DUMMY-0157','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-02-02'),
  ('CSR-2024-DUMMY-0158','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-02-12'),
  ('CSR-2024-DUMMY-0159','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-02-06'),
  ('CSR-2024-DUMMY-0160','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-02-20'),
  ('CSR-2024-DUMMY-0161','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-02-22'),
  ('CSR-2024-DUMMY-0162','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-02-11'),
  ('CSR-2024-DUMMY-0163','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-02-28');

-- 2024-03 (Mar): 16 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0164','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-03-02'),
  ('CSR-2024-DUMMY-0165','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-03-07'),
  ('CSR-2024-DUMMY-0166','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-03-08'),
  ('CSR-2024-DUMMY-0167','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-03-21'),
  ('CSR-2024-DUMMY-0168','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-03-09'),
  ('CSR-2024-DUMMY-0169','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-03-06'),
  ('CSR-2024-DUMMY-0170','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-03-27'),
  ('CSR-2024-DUMMY-0171','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-03-19'),
  ('CSR-2024-DUMMY-0172','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-03-04'),
  ('CSR-2024-DUMMY-0173','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-03-14'),
  ('CSR-2024-DUMMY-0174','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-03-01'),
  ('CSR-2024-DUMMY-0175','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-03-19'),
  ('CSR-2024-DUMMY-0176','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-03-31'),
  ('CSR-2024-DUMMY-0177','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-03-01'),
  ('CSR-2024-DUMMY-0178','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-03-27'),
  ('CSR-2024-DUMMY-0179','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-03-07');

-- 2024-04 (Apr): 15 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0180','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-04-14'),
  ('CSR-2024-DUMMY-0181','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-04-05'),
  ('CSR-2024-DUMMY-0182','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-04-16'),
  ('CSR-2024-DUMMY-0183','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-04-30'),
  ('CSR-2024-DUMMY-0184','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Siti','siti@csr.com','2024-04-20'),
  ('CSR-2024-DUMMY-0185','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-04-03'),
  ('CSR-2024-DUMMY-0186','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Lina','lina@csr.com','2024-04-12'),
  ('CSR-2024-DUMMY-0187','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-04-17'),
  ('CSR-2024-DUMMY-0188','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-04-06'),
  ('CSR-2024-DUMMY-0189','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-04-08'),
  ('CSR-2024-DUMMY-0190','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-04-24'),
  ('CSR-2024-DUMMY-0191','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-04-19'),
  ('CSR-2024-DUMMY-0192','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-04-16'),
  ('CSR-2024-DUMMY-0193','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-04-07'),
  ('CSR-2024-DUMMY-0194','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-04-23');

-- 2024-05 (Mei): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0195','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2024-05-18'),
  ('CSR-2024-DUMMY-0196','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-05-03'),
  ('CSR-2024-DUMMY-0197','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-05-08'),
  ('CSR-2024-DUMMY-0198','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-05-08'),
  ('CSR-2024-DUMMY-0199','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-05-17'),
  ('CSR-2024-DUMMY-0200','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-05-08'),
  ('CSR-2024-DUMMY-0201','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-05-22'),
  ('CSR-2024-DUMMY-0202','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-05-23'),
  ('CSR-2024-DUMMY-0203','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-05-14'),
  ('CSR-2024-DUMMY-0204','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-05-13'),
  ('CSR-2024-DUMMY-0205','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2024-05-17'),
  ('CSR-2024-DUMMY-0206','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-05-18'),
  ('CSR-2024-DUMMY-0207','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-05-03');

-- 2024-06 (Jun): 16 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0208','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-06-07'),
  ('CSR-2024-DUMMY-0209','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-06-24'),
  ('CSR-2024-DUMMY-0210','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-06-12'),
  ('CSR-2024-DUMMY-0211','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-06-04'),
  ('CSR-2024-DUMMY-0212','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-06-06'),
  ('CSR-2024-DUMMY-0213','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-06-12'),
  ('CSR-2024-DUMMY-0214','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-06-13'),
  ('CSR-2024-DUMMY-0215','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-06-05'),
  ('CSR-2024-DUMMY-0216','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-06-23'),
  ('CSR-2024-DUMMY-0217','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-06-10'),
  ('CSR-2024-DUMMY-0218','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-06-17'),
  ('CSR-2024-DUMMY-0219','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-06-09'),
  ('CSR-2024-DUMMY-0220','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-06-07'),
  ('CSR-2024-DUMMY-0221','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-06-15'),
  ('CSR-2024-DUMMY-0222','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-06-02'),
  ('CSR-2024-DUMMY-0223','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-06-01');

-- 2024-07 (Jul): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0224','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-07-31'),
  ('CSR-2024-DUMMY-0225','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-07-03'),
  ('CSR-2024-DUMMY-0226','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-07-21'),
  ('CSR-2024-DUMMY-0227','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-07-01'),
  ('CSR-2024-DUMMY-0228','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-07-14'),
  ('CSR-2024-DUMMY-0229','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-07-04'),
  ('CSR-2024-DUMMY-0230','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-07-22'),
  ('CSR-2024-DUMMY-0231','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-07-14'),
  ('CSR-2024-DUMMY-0232','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-07-03'),
  ('CSR-2024-DUMMY-0233','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-07-23'),
  ('CSR-2024-DUMMY-0234','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-07-28'),
  ('CSR-2024-DUMMY-0235','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2024-07-24'),
  ('CSR-2024-DUMMY-0236','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-07-12'),
  ('CSR-2024-DUMMY-0237','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-07-16');

-- 2024-08 (Agu): 16 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0238','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-08-15'),
  ('CSR-2024-DUMMY-0239','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-08-22'),
  ('CSR-2024-DUMMY-0240','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-08-15'),
  ('CSR-2024-DUMMY-0241','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-08-17'),
  ('CSR-2024-DUMMY-0242','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-08-01'),
  ('CSR-2024-DUMMY-0243','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-08-20'),
  ('CSR-2024-DUMMY-0244','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-08-24'),
  ('CSR-2024-DUMMY-0245','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-08-09'),
  ('CSR-2024-DUMMY-0246','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-08-03'),
  ('CSR-2024-DUMMY-0247','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-08-25'),
  ('CSR-2024-DUMMY-0248','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-08-13'),
  ('CSR-2024-DUMMY-0249','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-08-04'),
  ('CSR-2024-DUMMY-0250','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-08-24'),
  ('CSR-2024-DUMMY-0251','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-08-01'),
  ('CSR-2024-DUMMY-0252','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-08-10'),
  ('CSR-2024-DUMMY-0253','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-08-16');

-- 2024-09 (Sep): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0254','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-09-30'),
  ('CSR-2024-DUMMY-0255','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2024-09-09'),
  ('CSR-2024-DUMMY-0256','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-09-15'),
  ('CSR-2024-DUMMY-0257','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-09-24'),
  ('CSR-2024-DUMMY-0258','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-09-16'),
  ('CSR-2024-DUMMY-0259','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-09-11'),
  ('CSR-2024-DUMMY-0260','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-09-20'),
  ('CSR-2024-DUMMY-0261','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-09-03'),
  ('CSR-2024-DUMMY-0262','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-09-23'),
  ('CSR-2024-DUMMY-0263','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-09-01'),
  ('CSR-2024-DUMMY-0264','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Siti','siti@csr.com','2024-09-02'),
  ('CSR-2024-DUMMY-0265','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-09-19'),
  ('CSR-2024-DUMMY-0266','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-09-03'),
  ('CSR-2024-DUMMY-0267','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-09-21');

-- 2024-10 (Okt): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0268','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-10-29'),
  ('CSR-2024-DUMMY-0269','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-10-10'),
  ('CSR-2024-DUMMY-0270','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-10-06'),
  ('CSR-2024-DUMMY-0271','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-10-27'),
  ('CSR-2024-DUMMY-0272','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-10-05'),
  ('CSR-2024-DUMMY-0273','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-10-27'),
  ('CSR-2024-DUMMY-0274','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-10-25'),
  ('CSR-2024-DUMMY-0275','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-10-23'),
  ('CSR-2024-DUMMY-0276','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2024-10-10'),
  ('CSR-2024-DUMMY-0277','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-10-06'),
  ('CSR-2024-DUMMY-0278','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-10-23'),
  ('CSR-2024-DUMMY-0279','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-10-14'),
  ('CSR-2024-DUMMY-0280','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-10-04');

-- 2024-11 (Nov): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0281','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-11-16'),
  ('CSR-2024-DUMMY-0282','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-11-13'),
  ('CSR-2024-DUMMY-0283','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-11-05'),
  ('CSR-2024-DUMMY-0284','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2024-11-29'),
  ('CSR-2024-DUMMY-0285','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-11-10'),
  ('CSR-2024-DUMMY-0286','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Lina','lina@csr.com','2024-11-20'),
  ('CSR-2024-DUMMY-0287','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-11-16'),
  ('CSR-2024-DUMMY-0288','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-11-07'),
  ('CSR-2024-DUMMY-0289','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-11-28'),
  ('CSR-2024-DUMMY-0290','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-11-28'),
  ('CSR-2024-DUMMY-0291','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-11-25'),
  ('CSR-2024-DUMMY-0292','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-11-17'),
  ('CSR-2024-DUMMY-0293','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-11-10'),
  ('CSR-2024-DUMMY-0294','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2024-11-27');

-- 2024-12 (Des): 16 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2024-DUMMY-0295','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2024-12-13'),
  ('CSR-2024-DUMMY-0296','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-12-19'),
  ('CSR-2024-DUMMY-0297','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-12-26'),
  ('CSR-2024-DUMMY-0298','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-12-03'),
  ('CSR-2024-DUMMY-0299','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-12-01'),
  ('CSR-2024-DUMMY-0300','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-12-14'),
  ('CSR-2024-DUMMY-0301','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2024-12-03'),
  ('CSR-2024-DUMMY-0302','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2024-12-14'),
  ('CSR-2024-DUMMY-0303','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2024-12-15'),
  ('CSR-2024-DUMMY-0304','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Siti','siti@csr.com','2024-12-04'),
  ('CSR-2024-DUMMY-0305','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2024-12-03'),
  ('CSR-2024-DUMMY-0306','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2024-12-01'),
  ('CSR-2024-DUMMY-0307','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2024-12-07'),
  ('CSR-2024-DUMMY-0308','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2024-12-28'),
  ('CSR-2024-DUMMY-0309','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2024-12-30'),
  ('CSR-2024-DUMMY-0310','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'In Progress','Pending','Bu Rina','rina@csr.com','2024-12-03');

-- TAHUN 2025 | 155 proposal | Rp204,000,000
-- 2025-01 (Jan): 8 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0311','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-01-18'),
  ('CSR-2025-DUMMY-0312','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-01-06'),
  ('CSR-2025-DUMMY-0313','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-01-24'),
  ('CSR-2025-DUMMY-0314','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-01-17'),
  ('CSR-2025-DUMMY-0315','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2025-01-28'),
  ('CSR-2025-DUMMY-0316','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2025-01-26'),
  ('CSR-2025-DUMMY-0317','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-01-18'),
  ('CSR-2025-DUMMY-0318','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-01-10');

-- 2025-02 (Feb): 7 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0319','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-02-18'),
  ('CSR-2025-DUMMY-0320','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-02-10'),
  ('CSR-2025-DUMMY-0321','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-02-27'),
  ('CSR-2025-DUMMY-0322','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-02-12'),
  ('CSR-2025-DUMMY-0323','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-02-06'),
  ('CSR-2025-DUMMY-0324','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-02-18'),
  ('CSR-2025-DUMMY-0325','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2025-02-11');

-- 2025-03 (Mar): 13 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0326','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-03-13'),
  ('CSR-2025-DUMMY-0327','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-03-12'),
  ('CSR-2025-DUMMY-0328','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-03-19'),
  ('CSR-2025-DUMMY-0329','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-03-21'),
  ('CSR-2025-DUMMY-0330','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-03-27'),
  ('CSR-2025-DUMMY-0331','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-03-30'),
  ('CSR-2025-DUMMY-0332','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-03-13'),
  ('CSR-2025-DUMMY-0333','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-03-09'),
  ('CSR-2025-DUMMY-0334','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Siti','siti@csr.com','2025-03-04'),
  ('CSR-2025-DUMMY-0335','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-03-30'),
  ('CSR-2025-DUMMY-0336','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-03-07'),
  ('CSR-2025-DUMMY-0337','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-03-25'),
  ('CSR-2025-DUMMY-0338','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-03-12');

-- 2025-04 (Apr): 19 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0339','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-04-01'),
  ('CSR-2025-DUMMY-0340','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-04-18'),
  ('CSR-2025-DUMMY-0341','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-04-17'),
  ('CSR-2025-DUMMY-0342','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-04-18'),
  ('CSR-2025-DUMMY-0343','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-04-09'),
  ('CSR-2025-DUMMY-0344','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-04-05'),
  ('CSR-2025-DUMMY-0345','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-04-08'),
  ('CSR-2025-DUMMY-0346','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-04-14'),
  ('CSR-2025-DUMMY-0347','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-04-17'),
  ('CSR-2025-DUMMY-0348','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-04-18'),
  ('CSR-2025-DUMMY-0349','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-04-05'),
  ('CSR-2025-DUMMY-0350','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-04-09'),
  ('CSR-2025-DUMMY-0351','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-04-10'),
  ('CSR-2025-DUMMY-0352','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-04-14'),
  ('CSR-2025-DUMMY-0353','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-04-24'),
  ('CSR-2025-DUMMY-0354','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-04-13'),
  ('CSR-2025-DUMMY-0355','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-04-03'),
  ('CSR-2025-DUMMY-0356','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-04-27'),
  ('CSR-2025-DUMMY-0357','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-04-12');

-- 2025-05 (Mei): 14 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0358','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-05-12'),
  ('CSR-2025-DUMMY-0359','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-05-25'),
  ('CSR-2025-DUMMY-0360','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-05-24'),
  ('CSR-2025-DUMMY-0361','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-05-18'),
  ('CSR-2025-DUMMY-0362','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-05-02'),
  ('CSR-2025-DUMMY-0363','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-05-03'),
  ('CSR-2025-DUMMY-0364','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-05-01'),
  ('CSR-2025-DUMMY-0365','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Budi','budi@csr.com','2025-05-27'),
  ('CSR-2025-DUMMY-0366','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2025-05-07'),
  ('CSR-2025-DUMMY-0367','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-05-24'),
  ('CSR-2025-DUMMY-0368','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-05-24'),
  ('CSR-2025-DUMMY-0369','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-05-30'),
  ('CSR-2025-DUMMY-0370','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-05-01'),
  ('CSR-2025-DUMMY-0371','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-05-15');

-- 2025-06 (Jun): 12 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0372','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-06-26'),
  ('CSR-2025-DUMMY-0373','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-06-18'),
  ('CSR-2025-DUMMY-0374','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-06-15'),
  ('CSR-2025-DUMMY-0375','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2025-06-10'),
  ('CSR-2025-DUMMY-0376','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2025-06-27'),
  ('CSR-2025-DUMMY-0377','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-06-20'),
  ('CSR-2025-DUMMY-0378','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-06-01'),
  ('CSR-2025-DUMMY-0379','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-06-25'),
  ('CSR-2025-DUMMY-0380','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-06-27'),
  ('CSR-2025-DUMMY-0381','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-06-24'),
  ('CSR-2025-DUMMY-0382','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-06-27'),
  ('CSR-2025-DUMMY-0383','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-06-02');

-- 2025-07 (Jul): 15 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0384','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-07-27'),
  ('CSR-2025-DUMMY-0385','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-07-07'),
  ('CSR-2025-DUMMY-0386','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-07-22'),
  ('CSR-2025-DUMMY-0387','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-07-14'),
  ('CSR-2025-DUMMY-0388','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-07-31'),
  ('CSR-2025-DUMMY-0389','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-07-22'),
  ('CSR-2025-DUMMY-0390','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-07-09'),
  ('CSR-2025-DUMMY-0391','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-07-06'),
  ('CSR-2025-DUMMY-0392','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-07-17'),
  ('CSR-2025-DUMMY-0393','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-07-09'),
  ('CSR-2025-DUMMY-0394','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Siti','siti@csr.com','2025-07-16'),
  ('CSR-2025-DUMMY-0395','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-07-27'),
  ('CSR-2025-DUMMY-0396','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-07-03'),
  ('CSR-2025-DUMMY-0397','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-07-13'),
  ('CSR-2025-DUMMY-0398','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-07-23');

-- 2025-08 (Agu): 15 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0399','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-08-09'),
  ('CSR-2025-DUMMY-0400','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-08-11'),
  ('CSR-2025-DUMMY-0401','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-08-13'),
  ('CSR-2025-DUMMY-0402','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-08-12'),
  ('CSR-2025-DUMMY-0403','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-08-13'),
  ('CSR-2025-DUMMY-0404','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-08-06'),
  ('CSR-2025-DUMMY-0405','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-08-29'),
  ('CSR-2025-DUMMY-0406','Bantuan Korban Bencana','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-08-09'),
  ('CSR-2025-DUMMY-0407','Program Literasi Digital','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-08-12'),
  ('CSR-2025-DUMMY-0408','Pemberdayaan Ibu Rumah Tangga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-08-26'),
  ('CSR-2025-DUMMY-0409','Bantuan Air Bersih Masyarakat','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-08-06'),
  ('CSR-2025-DUMMY-0410','Program Beasiswa Pendidikan','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-08-01'),
  ('CSR-2025-DUMMY-0411','Klinik Kesehatan Gratis','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-08-05'),
  ('CSR-2025-DUMMY-0412','Pelatihan Keterampilan Warga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-08-18'),
  ('CSR-2025-DUMMY-0413','Bantuan Sembako Dhuafa','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-08-15');

-- 2025-09 (Sep): 11 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0414','Renovasi Fasilitas Ibadah','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-09-26'),
  ('CSR-2025-DUMMY-0415','Program Gizi Anak Balita','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-09-15'),
  ('CSR-2025-DUMMY-0416','Santunan Anak Yatim','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2025-09-07'),
  ('CSR-2025-DUMMY-0417','Pelatihan UMKM Lokal','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-09-17'),
  ('CSR-2025-DUMMY-0418','Bantuan Korban Bencana','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-09-04'),
  ('CSR-2025-DUMMY-0419','Program Literasi Digital','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-09-26'),
  ('CSR-2025-DUMMY-0420','Pemberdayaan Ibu Rumah Tangga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-09-23'),
  ('CSR-2025-DUMMY-0421','Bantuan Air Bersih Masyarakat','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-09-13'),
  ('CSR-2025-DUMMY-0422','Program Beasiswa Pendidikan','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-09-11'),
  ('CSR-2025-DUMMY-0423','Klinik Kesehatan Gratis','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-09-25'),
  ('CSR-2025-DUMMY-0424','Pelatihan Keterampilan Warga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-09-14');

-- 2025-10 (Okt): 10 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0425','Bantuan Sembako Dhuafa','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-10-14'),
  ('CSR-2025-DUMMY-0426','Renovasi Fasilitas Ibadah','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-10-31'),
  ('CSR-2025-DUMMY-0427','Program Gizi Anak Balita','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-10-31'),
  ('CSR-2025-DUMMY-0428','Santunan Anak Yatim','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-10-08'),
  ('CSR-2025-DUMMY-0429','Pelatihan UMKM Lokal','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-10-11'),
  ('CSR-2025-DUMMY-0430','Bantuan Korban Bencana','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-10-03'),
  ('CSR-2025-DUMMY-0431','Program Literasi Digital','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-10-06'),
  ('CSR-2025-DUMMY-0432','Pemberdayaan Ibu Rumah Tangga','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-10-02'),
  ('CSR-2025-DUMMY-0433','Bantuan Air Bersih Masyarakat','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-10-24'),
  ('CSR-2025-DUMMY-0434','Program Beasiswa Pendidikan','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Siti','siti@csr.com','2025-10-02');

-- 2025-11 (Nov): 12 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0435','Klinik Kesehatan Gratis','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Budi','budi@csr.com','2025-11-09'),
  ('CSR-2025-DUMMY-0436','Pelatihan Keterampilan Warga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-11-24'),
  ('CSR-2025-DUMMY-0437','Bantuan Sembako Dhuafa','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-11-06'),
  ('CSR-2025-DUMMY-0438','Renovasi Fasilitas Ibadah','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-11-20'),
  ('CSR-2025-DUMMY-0439','Program Gizi Anak Balita','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-11-30'),
  ('CSR-2025-DUMMY-0440','Santunan Anak Yatim','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-11-05'),
  ('CSR-2025-DUMMY-0441','Pelatihan UMKM Lokal','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-11-16'),
  ('CSR-2025-DUMMY-0442','Bantuan Korban Bencana','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-11-19'),
  ('CSR-2025-DUMMY-0443','Program Literasi Digital','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-11-12'),
  ('CSR-2025-DUMMY-0444','Pemberdayaan Ibu Rumah Tangga','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-11-23'),
  ('CSR-2025-DUMMY-0445','Bantuan Air Bersih Masyarakat','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2500000,'Done','Approved','Pak Budi','budi@csr.com','2025-11-27'),
  ('CSR-2025-DUMMY-0446','Program Beasiswa Pendidikan','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Lina','lina@csr.com','2025-11-05');

-- 2025-12 (Des): 19 proposal
INSERT INTO donation_proposals (case_id,proposal_name,organization,product_detail,budget,status,bright_status,pic_name,pic_email,proposal_date) VALUES
  ('CSR-2025-DUMMY-0447','Klinik Kesehatan Gratis','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-12-24'),
  ('CSR-2025-DUMMY-0448','Pelatihan Keterampilan Warga','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-12-07'),
  ('CSR-2025-DUMMY-0449','Bantuan Sembako Dhuafa','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-12-05'),
  ('CSR-2025-DUMMY-0450','Renovasi Fasilitas Ibadah','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-12-29'),
  ('CSR-2025-DUMMY-0451','Program Gizi Anak Balita','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-12-26'),
  ('CSR-2025-DUMMY-0452','Santunan Anak Yatim','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-12-04'),
  ('CSR-2025-DUMMY-0453','Pelatihan UMKM Lokal','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-12-30'),
  ('CSR-2025-DUMMY-0454','Bantuan Korban Bencana','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Bu Siti','siti@csr.com','2025-12-30'),
  ('CSR-2025-DUMMY-0455','Program Literasi Digital','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Budi','budi@csr.com','2025-12-18'),
  ('CSR-2025-DUMMY-0456','Pemberdayaan Ibu Rumah Tangga','Rumah Singgah Cahaya','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Bu Lina','lina@csr.com','2025-12-14'),
  ('CSR-2025-DUMMY-0457','Bantuan Air Bersih Masyarakat','Relawan Peduli Lansia','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Hendra','hendra@csr.com','2025-12-31'),
  ('CSR-2025-DUMMY-0458','Program Beasiswa Pendidikan','Yayasan Pendidikan Islam','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Nabila','nabila@csr.com','2025-12-18'),
  ('CSR-2025-DUMMY-0459','Klinik Kesehatan Gratis','DKM Masjid Al-Ikhlas','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Siap Diambil','Approved','Pak Deni','deni@csr.com','2025-12-30'),
  ('CSR-2025-DUMMY-0460','Pelatihan Keterampilan Warga','PKK Kelurahan Maju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'In Progress','Pending','Bu Rina','rina@csr.com','2025-12-25'),
  ('CSR-2025-DUMMY-0461','Bantuan Sembako Dhuafa','Warga Desa Sukamaju','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1000000,'Done','Approved','Pak Ilham','ilham@csr.com','2025-12-28'),
  ('CSR-2025-DUMMY-0462','Renovasi Fasilitas Ibadah','Karang Taruna Mekarsari','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',500000,'Done','Approved','Bu Sarah','sarah@csr.com','2025-12-01'),
  ('CSR-2025-DUMMY-0463','Program Gizi Anak Balita','Yayasan Maju Bersama','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',1500000,'Done','Approved','Pak Ahmad','ahmad@csr.com','2025-12-04'),
  ('CSR-2025-DUMMY-0464','Santunan Anak Yatim','Komunitas Peduli Anak','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Bu Siti','siti@csr.com','2025-12-05'),
  ('CSR-2025-DUMMY-0465','Pelatihan UMKM Lokal','Panti Asuhan Harapan Baru','2 Dus Aqua 330ml, 5 Dus Aqua 600ml',2000000,'Done','Approved','Pak Budi','budi@csr.com','2025-12-19');

-- VERIFIKASI
SELECT YEAR(proposal_date) tahun, COUNT(*) jumlah, FORMAT(SUM(budget),0) total_budget, FORMAT(MIN(SUM(budget)) OVER(), 0) min_bulan, FORMAT(MAX(SUM(budget)) OVER(), 0) max_bulan FROM donation_proposals WHERE case_id LIKE 'CSR-%-DUMMY-%' GROUP BY tahun ORDER BY tahun;

SELECT DATE_FORMAT(proposal_date,'%Y-%m') bulan, COUNT(*) proposal, FORMAT(SUM(budget),0) budget FROM donation_proposals WHERE case_id LIKE 'CSR-%-DUMMY-%' GROUP BY bulan ORDER BY bulan;