# 🔧 Panduan Mengatasi Error Backend

**Status: BERHASIL DISELESAIKAN** ✅

---

## 🔍 Apa yang Terjadi?

Error **"Gagal memuat data. Pastikan server backend berjalan."** terjadi karena:

- Tabel `donation_proposals` belum dibuat di database
- Database hanya memiliki 3 tabel: users, categories, csr_programs

---

## ✅ Solusi yang Telah Dilakukan

### 1. Tabel Dibuat ✅

```
✅ donation_proposals table dibuat dengan struktur lengkap
✅ 7 sample data dimasukkan
```

### 2. Struktur Tabel ✅

```
- id (PRIMARY KEY)
- case_id (UNIQUE)
- proposal_name
- organization
- product_detail
- budget (DECIMAL)
- status (ENUM: 'In Progress', 'Siap Diambil', 'Done')
- pic_name
- pic_email
- proposal_date
- file_path
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. Sample Data ✅

Sudah ada 7 proposal untuk testing:

- CSR-2025-001 - Proposal Bantuan Air Bersi...
- CSR-2025-003 - PHBI MAULID NABI
- CSR-2024-039 - Pelatihan Keterampilan Ibu...
- CSR-2024-032 - Program Kesehatan Lansia
- CSR-2024-028 - Bantuan Korban Banjir
- CSR-2024-021 - Renovasi Masjid Desa Suka...
- CSR-2024-015 - Bantuan Pendidikan Anak-Y...

## 🚀 Langkah Berikutnya

### 1. Pastikan Backend Berjalan

**Terminal 1 - Jalankan Backend:**

```bash
cd c:\Users\HYPE AMD\CSR\backend
npm start
```

Seharusnya muncul:

```
Server running on port 5000
```

### 2. Jalankan Frontend

**Terminal 2 - Jalankan Frontend:**

```bash
cd c:\Users\HYPE AMD\CSR\frontend
npm start
```

Frontend akan terbuka di `http://localhost:3000`

### 3. Login dan Akses Dashboard

1. Buka browser: `http://localhost:3000`
2. Login dengan:
   - **Email:** admin@csr.com
   - **Password:** admin123
3. Buka **sidebar private**, lalu klik menu **"Proposal"**
4. Dashboard Proposal akan menampilkan:
   - ✅ 7 proposal dari sample data
   - ✅ Statistik (Total, In Progress, Siap Diambil, Done, Total Budget)
   - ✅ Tabel dengan semua proposal
   - ✅ Tombol "+ Tambah Proposal" untuk menambah proposal baru

## 📊 Cek Status Database

Jika ingin memverifikasi database kapan saja:

```bash
cd c:\Users\HYPE AMD\CSR\backend
node scripts/checkDatabase.js
```

Output akan menampilkan:

- ✅ Database connection status
- 📋 Semua tabel yang ada
- 📝 Struktur tabel donation_proposals
- 📊 Jumlah proposal di database

## 🛠️ Helper Scripts yang Tersedia

```bash
# Cek status database
node scripts/checkDatabase.js

# Setup tabel proposal (jika perlu ulang)
npm run create-proposals-table

# Test database connection
node scripts/testDb.js
```

## ⚠️ Jika Masih Ada Error

1. **Pastikan MySQL berjalan:**

   ```bash
   # Di PowerShell (jika MySQL tidak otomatis berjalan)
   Get-Service MySQL80 | Start-Service
   ```

2. **Pastikan backend di port 5000:**

   ```
   Cek di browser: http://localhost:5000
   Harusnya muncul: {"message":"CSR API is running"}
   ```

3. **Cek browser console (F12) untuk melihat error:**
   - Buka DevTools (F12)
   - Lihat tab "Network" untuk melihat API request
   - Lihat tab "Console" untuk error messages

4. **Reset database jika perlu:**

   ```bash
   # Hapus database
   mysql -u root -p -e "DROP DATABASE csr_db;"

   # Jalankan setup ulang
   cd c:\Users\HYPE AMD\CSR\backend
   npm run setup-db
   ```

## ✨ Fitur yang Sudah Siap

✅ Dashboard dengan statistik  
✅ Tabel proposal dengan 7 sample data  
✅ Filter berdasarkan status  
✅ Search proposal  
✅ Tombol tambah proposal (modal form)  
✅ Tombol edit & delete (dengan confirmation)  
✅ Responsive design  
✅ API endpoints lengkap

---

**Status: ✅ SIAP DIGUNAKAN**

Sekarang aplikasi seharusnya berjalan dengan sempurna! 🎉
