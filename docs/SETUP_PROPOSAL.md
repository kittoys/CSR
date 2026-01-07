# 📘 Setup Guide - Dashboard Proposal Donasi CSR

Dokumentasi lengkap untuk menjalankan aplikasi CSR dengan fitur Dashboard Proposal Donasi.

---

## 📋 Daftar Perubahan

### Database

- ✅ Ditambahkan tabel `donation_proposals` untuk menyimpan data proposal donasi
- ✅ Ditambahkan sample data proposal untuk testing

### Backend

- ✅ Dibuat file `src/routes/proposals.js` - API routes untuk CRUD proposal
- ✅ Ditambahkan route `/api/proposals` di `src/index.js`
- ✅ Support untuk GET, POST, PUT, DELETE proposals
- ✅ Endpoint `/api/proposals/stats/summary` untuk statistik

### Frontend

- ✅ Dibuat `src/api/proposals.js` - API client untuk proposal
- ✅ Dibuat `src/pages/ProposalDashboard.jsx` - Halaman dashboard utama
- ✅ Dibuat `src/pages/ProposalDashboard.css` - Styling dashboard
- ✅ Dibuat `src/components/ProposalModal.jsx` - Form modal untuk tambah proposal
- ✅ Dibuat `src/components/ProposalModal.css` - Styling modal
- ✅ Ditambahkan route `/proposals` di `src/App.js`
- ✅ Ditambahkan link "Proposals" di `src/components/Navbar.jsx`

## 🚀 Cara Menjalankan

### 1. Setup Database

```bash
# Buka MySQL dan jalankan:
mysql -u root -p
```

```sql
SOURCE C:\Users\HYPE AMD\CSR\csr-backend\setup.sql;
```

Atau gunakan MySQL Workbench untuk import file `setup.sql`.

### 2. Jalankan Backend

```bash
cd c:\Users\HYPE AMD\CSR\csr-backend
npm install
npm start
```

Backend akan berjalan di `http://localhost:5000`

### 3. Jalankan Frontend

```bash
cd c:\Users\HYPE AMD\CSR\csr-frontend
npm install
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔑 Kredensial Login

```
Username: admin@csr.com
Password: admin123
```

## 📊 Dashboard Features

### Statistik

- Total Proposals - Jumlah total proposal donasi
- In Progress - Proposal yang sedang diproses
- Siap Diambil - Proposal siap diambil
- Done - Proposal yang sudah selesai
- Total Budget - Total budget dari semua proposal

### Daftar Proposal

- Tampilan tabel dengan kolom: Case ID, Nama Proposal, Asal, Detail Produk, Budget, Status, PIC, Tanggal, File, Aksi
- Filter berdasarkan status (In Progress, Siap Diambil, Done)
- Search berdasarkan nama proposal, case ID, atau organisasi

### Tambah Proposal

- Klik tombol "+ Tambah Proposal"
- Isi form dengan data proposal:
  - Nama Proposal
  - Asal/Organisasi
  - Detail Produk
  - Budget (dalam Rupiah)
  - Status (In Progress, Siap Diambil, Done)
  - Nama PIC (Person In Charge)
  - Email PIC
  - Tanggal Proposal
- Klik "Simpan Proposal"

### Action Buttons

- ✎ Edit - Edit proposal (coming soon)
- 🗑 Delete - Hapus proposal dengan konfirmasi

## 📂 Struktur File Baru

```
csr-backend/
  src/
    routes/
      proposals.js          (BARU) - API routes untuk proposal

csr-frontend/
  src/
    api/
      proposals.js          (BARU) - API client untuk proposal
    components/
      ProposalModal.jsx     (BARU) - Form modal tambah proposal
      ProposalModal.css     (BARU) - Styling modal
    pages/
      ProposalDashboard.jsx (BARU) - Halaman dashboard proposal
      ProposalDashboard.css (BARU) - Styling dashboard
```

## 🎨 Design Features

- **Responsive Design** - Bekerja di semua ukuran layar (mobile, tablet, desktop)
- **Modern UI** - Design yang clean dan professional
- **Statistik Cards** - Menampilkan overview data proposal
- **Tabel Interaktif** - Sorting, filtering, dan search built-in
- **Form Modal** - User-friendly form untuk input proposal baru
- **Status Badges** - Color-coded status untuk visual clarity

## ⚙️ Troubleshooting

### Error: "Gagal memuat data. Pastikan server backend berjalan."

- Pastikan backend sudah berjalan di `http://localhost:5000`
- Cek .env file di frontend sudah ter-set dengan benar: `REACT_APP_API_BASE=http://localhost:5000/api`

### Database tidak ditemukan

- Pastikan MySQL service sudah berjalan
- Import kembali `setup.sql` ke database
- Cek konfigurasi database di `csr-backend/src/config/db.js`

### Login gagal

- Default credentials: `admin@csr.com` / `admin123`
- Password sudah di-hash dengan bcrypt
- Token disimpan di localStorage

## 📝 Notes

- Mode admin diperlukan untuk menambah/mengubah/menghapus proposal
- Setiap proposal akan mendapat Case ID otomatis (CSR-YYYY-###)
- Status dapat diubah antara In Progress, Siap Diambil, dan Done
- Database akan otomatis membuat timestamp untuk created_at dan updated_at

## 🔒 Security

- Semua endpoint proposal dilindungi dengan authentication check
- Hanya admin yang bisa menambah/mengubah/menghapus proposal
- Token JWT digunakan untuk authentication
- Password di-hash dengan bcrypt

## 📞 Support

Jika ada pertanyaan atau masalah, hubungi developer atau cek console browser (F12) untuk error message.
