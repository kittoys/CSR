# ⚡ Quick Start Guide - CSR Monitoring Dashboard

**Status: SEMUA SIAP DIGUNAKAN!** ✅

Aplikasi sudah dikonfigurasi dan siap dijalankan dengan data sample.

---

## 🚀 Langkah 1: Jalankan Backend

**Buka Terminal 1:**

```bash
cd c:\Users\HYPE AMD\CSR\backend
npm start
```

Tunggu sampai muncul:

```
Server running on port 5000
```

---

## 🚀 Langkah 2: Jalankan Frontend

**Buka Terminal 2:**

```bash
cd c:\Users\HYPE AMD\CSR\frontend
npm start
```

Tunggu sampai browser otomatis membuka `http://localhost:3000`

---

## 🔐 Langkah 3: Login

1. Buka `http://localhost:3000/login`
2. Gunakan kredensial berikut

**Gunakan kredensial:**

- 📧 Email: `admin@csr.com`
- 🔑 Password: `admin123`

Klik tombol **"Masuk"**

---

## 📊 Langkah 4: Akses Dashboard Proposal

Setelah login berhasil:

1. Buka menu sidebar (halaman private)
2. Klik **"Proposal"**
3. Dashboard akan menampilkan:
   - ✅ **5 Statistik Cards** (Total, In Progress, Siap Diambil, Done, Total Budget)
   - ✅ **Daftar 7 Proposal** dengan semua data
   - ✅ **Tombol "+ Tambah Proposal"** untuk tambah proposal baru
   - ✅ **Filter & Search** untuk mencari proposal

---

## 🎯 Fitur yang Bisa Dicoba

### Tambah Proposal Baru

1. Klik tombol **"+ Tambah Proposal"**
2. Isi form dengan data:
   - Nama Proposal
   - Asal/Organisasi
   - Detail Produk
   - Budget (dalam Rp)
   - Status (In Progress, Siap Diambil, Done)
   - Nama PIC
   - Email PIC
   - Tanggal Proposal
3. Klik **"Simpan Proposal"**

### Filter & Search

- Gunakan dropdown untuk filter berdasarkan status
- Gunakan search box untuk mencari proposal

### Edit & Delete

- Klik icon **"✎"** untuk edit proposal (coming soon)
- Klik icon **"🗑"** untuk delete proposal (dengan konfirmasi)

---

## 📊 Data Sample

Dashboard sudah berisi 7 proposal:

1. **CSR-2025-001** - Proposal Bantuan Air Bersi... (Rp 500,000 - In Progress)
2. **CSR-2025-003** - PHBI MAULID NABI (Rp 3,000,000 - Siap Diambil)
3. **CSR-2024-039** - Pelatihan Keterampilan Ibu... (Rp 12,000,000 - In Progress)
4. **CSR-2024-032** - Program Kesehatan Lansia (Rp 8,000,000 - In Progress)
5. **CSR-2024-028** - Bantuan Korban Banjir (Rp 15,000,000 - Siap Diambil)
6. **CSR-2024-021** - Renovasi Masjid Desa Suka... (Rp 25,000,000 - Done)
7. **CSR-2024-015** - Bantuan Pendidikan Anak-Y... (Rp 10,000,000 - Done)

**Total Budget: Rp 73,500,000**

---

## ⚠️ Jika Ada Error

### Error: "Gagal memuat data..."

**Pastikan:**

1. ✅ Terminal 1 (Backend) sudah berjalan (port 5000)
2. ✅ Terminal 2 (Frontend) sudah berjalan (port 3000)
3. ✅ MySQL service sudah berjalan
4. ✅ Database `csr_db` sudah dibuat

**Cek Backend:**

```bash
cd backend
node scripts/testAPI.js
```

**Cek Database:**

```bash
cd backend
node scripts/checkDatabase.js
```

### Error: "Cannot find module..."

```bash
cd frontend
npm install

cd ../backend
npm install
```

### MySQL tidak berjalan

Buka Services (Windows):

1. Tekan `Win + R`
2. Ketik `services.msc`
3. Cari "MySQL80" dan klik kanan → Start

---

## 🎨 URL Penting

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000
- **Proposals Endpoint**: http://localhost:5000/api/proposals

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lebih detail, lihat file:

- `TROUBLESHOOTING.md` - Panduan troubleshooting
- `SETUP_PROPOSAL.md` - Setup proposal dashboard
- `README.md` - Dokumentasi lengkap
- `.env` - Konfigurasi database

---

## ✨ Fitur Dashboard

✅ Statistik real-time  
✅ Tabel proposal interaktif  
✅ Filter berdasarkan status  
✅ Search proposal  
✅ Tambah proposal baru  
✅ Edit proposal  
✅ Delete proposal  
✅ Responsive design  
✅ Auto-refresh data  
✅ Error handling

---

## 🎉 Selamat!

Aplikasi CSR Monitoring System sudah siap digunakan!

**Enjoy the dashboard!** 🚀
