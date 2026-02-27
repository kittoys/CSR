# 🎯 CSR (Corporate Social Responsibility) Portal

Sistem manajemen program CSR dengan login admin, CRUD program/kategori, dashboard proposal lengkap dengan statistik dan auto-generated CASE ID.

> 📚 **Dokumentasi Lengkap**: Lihat folder [docs/](docs/) untuk dokumentasi teknis lengkap

---

## 📋 Fitur Utama

- ✅ **Login Admin** - Sistem autentikasi untuk admin
- ✅ **Manajemen Program** - Create, Read, Update, Delete program CSR dengan image upload
- ✅ **Kategori** - Organisasi program berdasarkan kategori
- ✅ **Proposal Dashboard** - Dashboard lengkap dengan statistik dan monitoring proposal
- ✅ **Form Proposal** - Form input proposal terstruktur 3 section dengan auto-generated CASE ID (CSR-YYYY-###)
- ✅ **Upload File** - Drag & drop file pendukung (PDF, DOC, DOCX, JPG, PNG) max 5MB
- ✅ **Statistics** - Dashboard statistik dengan monthly trend dan status breakdown
- ✅ **Export Data** - Cetak/export data proposal
- ✅ **Responsive Design** - Desain mobile-friendly untuk seluruh halaman
- ✅ **Pemisahan Layout** - Halaman publik terpisah dari dashboard internal admin
- ✅ **JWT Authentication** - Keamanan token-based
- ✅ **Password Hashing** - Password di-hash dengan bcrypt

---

## 🛠️ Tech Stack

### Frontend

- React 19.2.3 + React Router 7.10.1
- Axios 1.13.2 (HTTP client)
- Framer Motion 12.23.26 (Animations)
- Lucide React 0.562.0 (Icons)
- React Intersection Observer (Scroll animations)
- CSS3 + Bootstrap Icons

## 🆕 Changelog (Januari–Februari 2026)

- Admin Dashboard: filter status & kategori diperbaiki; counter total program mengikuti hasil filter.
- Kebersihan repo: menghapus file bawaan CRA yang tidak dipakai (App.test.js, setupTests.js, reportWebVitals.js, README duplikat frontend).
- Pemisahan routing publik (`/`, `/programs`) dan internal (`/admin`, `/proposals`) dengan mode layout berbeda.
- Navbar internal diubah menjadi sidebar dashboard (desktop) + mobile drawer.
- Sidebar internal mendukung collapse/expand dan state disimpan di `localStorage`.
- Ditambahkan quick link halaman publik dari sidebar admin, membuka tab baru.
- Perapihan responsivitas dan keterbacaan dashboard proposal/admin.
- Perbaikan konflik class CSS `filter-badge` agar style antar halaman tidak bentrok.

### Backend

- Node.js + Express 5.2.1
- MySQL2 3.16.0 (MySQL/MariaDB driver)
- JWT 9.0.3 (JSON Web Tokens)
- bcrypt 6.0.0 (Password hashing)
- Multer 2.0.2 (File upload)
- CORS 2.8.5

---

## 📦 Prerequisites

- Node.js v16+ - [Download](https://nodejs.org/)
- MySQL/MariaDB - [Download](https://www.mysql.com/downloads/)
- Git

---

## 🚀 Quick Start

### Option A: Otomatis dengan Script (Recommended)

**Windows:**

```bash
setup.bat
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

**Script akan otomatis:**

- ✅ Setup database & seed data
- ✅ Install dependencies backend & frontend
- ✅ Start backend server (port 5000)
- ✅ Start frontend server (port 3000)

### Option B: Manual Setup

#### 1. Database Setup

```bash
cd backend
npm install
npm run setup-db
npm run seed-db
```

Atau manual dengan MySQL CLI:

```bash
mysql -u root -p < backend/setup.sql
```

#### 2. Backend Setup

```bash
cd backend

# Copy environment variables (jika belum ada .env)
# cp .env.example .env

# Edit .env sesuai konfigurasi MySQL Anda
# nano .env

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Backend akan running di `http://localhost:5000`

#### 3. Frontend Setup

Di terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm start
```

Frontend akan running di `http://localhost:3000` (halaman publik di `/`, login admin di `/login`)

---

## 🔐 Login Credentials

Setelah setup selesai, gunakan:

- **Email**: `admin@csr.com`
- **Password**: `admin123`

---

## 📊 Dashboard Features

### Admin Dashboard (`/admin`)

- ✅ Manajemen Program CSR (Create, Read, Update, Delete)
- ✅ Manajemen Kategori
- ✅ Upload gambar program (drag & drop)
- ✅ Filter program berdasarkan status dan kategori
- ✅ Counter total program yang tampil dan mengikuti filter
- ✅ Responsive table dan cards view

### Proposal Dashboard (`/proposals`)

- ✅ **Statistics Cards**: Total Proposals, In Progress, Waiting, Done, Total Budget
- ✅ **Monthly Trend Chart**: Line chart dengan status breakdown
- ✅ **Data Table**: Sortable, searchable, filterable
- ✅ **Modal Form**: 3-section structured form
  - Section 1: Informasi Dasar (Nama, Organisasi, PIC, Tanggal, Status)
  - Section 2: Informasi Produk (Bentuk Donasi, Tipe, Detail, Jumlah, Budget)
  - Section 3: Informasi Tambahan (Catatan, File Upload)
- ✅ **File Upload**: Drag & drop dengan preview (PDF, DOC, DOCX, JPG, PNG)
- ✅ **Quick Actions**: Edit, Delete, View File
- ✅ **Export**: Print/export data
- ✅ **Filter**: By month/year, by status
- ✅ **Search**: Search all fields
- ✅ **Auto CASE ID**: CSR-2025-001, CSR-2025-002, etc.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification & admin check
│   ├── routes/
│   │   ├── auth.js                # Login/Register
│   │   ├── programs.js            # Program CRUD + image upload
│   │   ├── categories.js          # Categories CRUD
│   │   ├── proposals.js           # Proposal CRUD + stats + file upload
│   │   └── upload.js              # Image upload endpoint
│   └── index.js                   # Entry point
├── scripts/
│   ├── setupDb.js                 # Setup database schema
│   ├── setupDbFull.js             # Full setup with sample data
│   ├── seed.js                    # Seed sample data
│   ├── createAdmin.js             # Create admin user
│   ├── testDb.js                  # Test database connection
│   ├── checkDatabase.js           # Database status checker
│   ├── testAPI.js                 # API endpoint tester
│   ├── upgradeProposalTable.js    # Upgrade proposal table structure
│   └── createDonationProposals.js # Create donation proposals table
├── uploads/                       # Uploaded files directory
├── setup.sql                      # Database schema
├── .env                           # Environment variables
└── package.json

frontend/
├── src/
│   ├── api/
│   │   ├── auth.js                # Auth API calls
│   │   ├── programs.js            # Programs API calls
│   │   ├── categories.js          # Categories API calls
│   │   └── proposals.js           # Proposals API calls
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Programs.jsx           # List programs
│   │   ├── ProgramDetail.jsx      # Program details
│   │   ├── AdminDashboard.jsx     # Admin panel (programs & categories)
│   │   ├── ProposalDashboard.jsx  # Proposal dashboard with stats
│   │   └── Login.jsx              # Login page
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── ProgramCard.jsx        # Program card component
│   │   ├── ProposalModal.jsx      # Proposal form modal (3 sections)
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── App.js                     # Main app with routing
│   └── index.js                   # Entry point
├── public/                        # Static files
└── package.json
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/login`    | Login admin   |
| POST   | `/api/auth/register` | Register user |

**Login Request:**

```json
{
  "email": "admin@csr.com",
  "password": "admin123"
}
```

**Login Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@csr.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Programs (Require Authentication)

| Method | Endpoint            | Description         | Auth        |
| ------ | ------------------- | ------------------- | ----------- |
| GET    | `/api/programs`     | Get all programs    | No          |
| GET    | `/api/programs/:id` | Get program details | No          |
| POST   | `/api/programs`     | Create program      | Yes (Admin) |
| PUT    | `/api/programs/:id` | Update program      | Yes (Admin) |
| DELETE | `/api/programs/:id` | Delete program      | Yes (Admin) |

### Categories

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/categories` | Get all categories |

### Proposals

| Method | Endpoint                       | Description            | Auth        |
| ------ | ------------------------------ | ---------------------- | ----------- |
| GET    | `/api/proposals`               | Get all proposals      | Yes (Admin) |
| GET    | `/api/proposals/:id`           | Get proposal by ID     | Yes (Admin) |
| GET    | `/api/proposals/stats/summary` | Get statistics summary | No          |
| GET    | `/api/proposals/stats/monthly` | Get monthly statistics | No          |
| POST   | `/api/proposals`               | Create proposal        | Yes (Admin) |
| PUT    | `/api/proposals/:id`           | Update proposal        | Yes (Admin) |
| PATCH  | `/api/proposals/:id/status`    | Update proposal status | Yes (Admin) |
| DELETE | `/api/proposals/:id`           | Delete proposal        | Yes (Admin) |

**Create Proposal Request:**

```json
{
  "proposal_name": "Donasi Alat Tulis Sekolah",
  "organization": "Yayasan Pendidikan Bersama",
  "bentuk_donasi": "Barang",
  "tipe_proposal": "Sosial",
  "product_detail": "Paket alat tulis lengkap untuk 100 siswa",
  "jumlah_produk": "100 paket",
  "budget": 5000000,
  "catatan": "Untuk sekolah di daerah terpencil",
  "status": "In Progress",
  "pic_name": "John Doe",
  "pic_email": "john@example.com",
  "proposal_date": "2025-01-04",
  "file_pendukung": "proposal-doc.pdf"
}
```

**Response:**

```json
{
  "id": 8,
  "case_id": "CSR-2025-008",
  "message": "Proposal berhasil dibuat"
}
```

**CASE ID:**

- Auto-generated dengan format: **CSR-YYYY-###** (contoh: CSR-2025-001)
- YYYY = tahun saat ini
- ### = nomor urut proposal (3 digit, zero-padded)

### Upload

| Method | Endpoint      | Description  | Auth |
| ------ | ------------- | ------------ | ---- |
| POST   | `/api/upload` | Upload image | No   |

**Upload Request:**

- Content-Type: `multipart/form-data`
- Field name: `image`
- Max size: 5MB
- Allowed types: JPEG, JPG, PNG, GIF, WEBP

**Response:**

```json
{
  "message": "File berhasil diupload",
  "url": "http://localhost:5000/uploads/filename-123456789.jpg",
  "path": "/uploads/filename-123456789.jpg",
  "filename": "filename-123456789.jpg"
}
```

## 🎨 Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=csr_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend (.env)

```
REACT_APP_API_BASE=http://localhost:5000/api
```

## 📝 Available Scripts

### Backend

```bash
npm run dev                    # Development server dengan nodemon
npm run start                  # Production server
npm run setup-db               # Setup database schema
npm run seed-db                # Seed sample data
npm run test-db                # Test database connection
npm run create-admin           # Create new admin user
npm run create-proposals-table # Create donation_proposals table
```

### Frontend

```bash
npm start            # Development server
npm run build        # Production build
npm run test         # Run tests
```

## 🐛 Troubleshooting

### MySQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Pastikan MySQL service running

```bash
# Windows
net start MySQL80

# Linux
sudo systemctl start mysql

# macOS
brew services start mysql
```

### "Unknown database 'csr_db'"

**Solution**: Jalankan setup database

```bash
cd backend
npm run setup-db
npm run seed-db
```

### "Gagal memuat data. Pastikan server backend berjalan."

**Solution**:

1. Cek apakah backend running di port 5000
2. Cek apakah tabel `donation_proposals` ada:
   ```bash
   cd backend
   node scripts/checkDatabase.js
   ```
3. Test API endpoints:
   ```bash
   node scripts/testAPI.js
   ```

### "Token tidak valid"

**Solution**: Login ulang dan pastikan token disimpan di localStorage

### CORS Error

**Solution**: Pastikan backend URL di `.env` frontend benar

```
REACT_APP_API_BASE=http://localhost:5000/api
```

### File Upload Error

**Solution**:

1. Pastikan folder `backend/uploads/` ada dan writable
2. Check file size (max 5MB)
3. Check file type (allowed: PDF, DOC, DOCX, JPG, PNG)

### Port Already in Use

**Solution**: Kill process atau ubah port

```bash
# Windows - Kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac - Kill port 5000
lsof -ti:5000 | xargs kill -9
```

Untuk troubleshooting lengkap, lihat [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## 🔒 Security Notes

- ✅ Password di-hash dengan bcrypt (salt: 10 rounds)
- ✅ JWT token expire dalam 24 jam
- ✅ Admin-only endpoints dilindungi middleware (`verifyToken` & `isAdmin`)
- ✅ File upload validation (type & size)
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS enabled dengan proper configuration
- ⚠️ **Production**: Ubah `JWT_SECRET` ke nilai yang kuat dan random
- ⚠️ **Production**: Gunakan HTTPS untuk semua komunikasi
- ⚠️ **Production**: Setup environment variables di server (jangan commit .env)
- ⚠️ **Production**: Limit file upload size dan lokasi penyimpanan
- ⚠️ **Production**: Setup rate limiting untuk API endpoints
- ⚠️ **Production**: Gunakan prepared statements untuk semua query

## 📚 Database Schema

### users

```sql
id (INT, PK, AUTO_INCREMENT)
email (VARCHAR(255), UNIQUE)
password (VARCHAR(255))
name (VARCHAR(255))
role (ENUM: 'admin', 'user')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### categories

```sql
id (INT, PK, AUTO_INCREMENT)
name (VARCHAR(255))
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### csr_programs

```sql
id (INT, PK, AUTO_INCREMENT)
title (VARCHAR(255))
description (TEXT)
category_id (INT, FK -> categories.id)
location (VARCHAR(255))
start_date (DATE)
end_date (DATE)
status (ENUM: 'planned', 'ongoing', 'completed')
image_url (VARCHAR(500))
source_link (VARCHAR(500))
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### donation_proposals

```sql
id (INT, PK, AUTO_INCREMENT)
case_id (VARCHAR(20), UNIQUE) - Auto-generated (CSR-YYYY-###)
proposal_name (VARCHAR(255))
organization (VARCHAR(255))
bentuk_donasi (VARCHAR(100)) - Barang/Uang/Jasa/Lainnya
tipe_proposal (VARCHAR(100)) - Sosial/Pendidikan/Kesehatan/Ekonomi/Lingkungan
product_detail (TEXT)
jumlah_produk (VARCHAR(255))
budget (DECIMAL(15,2))
catatan (TEXT)
status (ENUM: 'In Progress', 'Siap Diambil', 'Done')
bright_status (ENUM: 'Pending', 'Approved', 'Rejected')
pic_name (VARCHAR(255))
pic_email (VARCHAR(255))
proposal_date (DATE)
file_pendukung (VARCHAR(255)) - Original filename
file_path (VARCHAR(255)) - Stored file path
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Project Status

**Last Updated:** February 27, 2026  
**Version:** 1.1.0  
**Status:** ✅ Production Ready

### Completed Features

- ✅ User Authentication (Login/Register)
- ✅ Program Management with Image Upload
- ✅ Category Management
- ✅ Proposal Dashboard with Statistics
- ✅ Auto-generated CASE ID
- ✅ File Upload System
- ✅ Monthly Trend Analytics
- ✅ Responsive Design
- ✅ Public vs Admin Layout Separation
- ✅ Admin Protection Middleware
- ✅ Complete Documentation

---

## 📖 Dokumentasi Lengkap

Semua dokumentasi teknis telah dipindahkan ke folder [docs/](docs/):

- 📘 **[Quick Start Guide](docs/QUICK_START.md)** - Panduan cepat untuk memulai aplikasi
- 🔧 **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Panduan mengatasi error umum
- ⚙️ **[Backend Setup](docs/BACKEND_SETUP.md)** - Setup lengkap backend & database
- ✨ **[Feature Documentation](docs/FEATURE_ADD_PROPOSAL.md)** - Dokumentasi fitur tambah proposal
- 🎨 **[Design System](docs/DESIGN_SYSTEM_DOCUMENTATION.md)** - Dokumentasi sistem desain
- ✅ **[Feature Checklist](docs/FEATURE_CHECKLIST.md)** - Checklist implementasi fitur
- 📊 **[Completion Report](docs/COMPLETION_REPORT.md)** - Laporan penyelesaian setup

> 💡 **Tip**: Mulai dengan [Quick Start Guide](docs/QUICK_START.md) untuk menjalankan aplikasi dengan cepat!

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.

---

**Happy Coding! 🎉**
