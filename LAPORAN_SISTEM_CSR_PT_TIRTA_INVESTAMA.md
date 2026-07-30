# 📊 LAPORAN SISTEM INFORMASI MANAJEMEN CSR (CORPORATE SOCIAL RESPONSIBILITY)
# PT TIRTA INVESTAMA

## Tanggal Laporan: 23 Desember 2025

---

## 1. Ringkasan Eksekutif

**Sistem Informasi Manajemen CSR PT Tirta Investama** adalah platform digital yang dirancang untuk mendukung pengelolaan program-program tanggung jawab sosial perusahaan (Corporate Social Responsibility) PT Tirta Investama. Website ini menyediakan platform terpusat untuk mengelola program CSR, proposal donasi, dan kategori program dengan sistem autentikasi yang aman, guna mendukung komitmen perusahaan dalam memberikan dampak positif bagi masyarakat dan lingkungan.

---

## 2. Deskripsi Umum Website

### 2.1 Tujuan Website
- Menyediakan platform manajemen program CSR yang terintegrasi
- Memfasilitasi pengelolaan proposal donasi dengan sistem CASE ID
- Memberikan akses kontrol berbasis peran (admin/user)
- Menyajikan informasi program CSR kepada publik

### 2.2 Target Pengguna
- **Administrator**: Mengelola program, kategori, dan proposal
- **Publik**: Melihat informasi program CSR yang tersedia

---

## 3. Arsitektur Teknis

### 3.1 Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | React, React Router, Axios, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL/MariaDB |
| **Autentikasi** | JWT (JSON Web Tokens), bcrypt |

### 3.2 Struktur Direktori

```
csr-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Koneksi MySQL
│   ├── middleware/
│   │   └── authMiddleware.js  # Verifikasi JWT
│   ├── routes/
│   │   ├── auth.js            # Login/Register
│   │   ├── programs.js        # Program CRUD
│   │   ├── categories.js      # Kategori
│   │   └── proposals.js       # Proposal donasi
│   └── index.js               # Entry point
├── scripts/                   # Script setup database
├── setup.sql                  # Schema database
└── package.json

csr-frontend/
├── src/
│   ├── api/                   # API calls
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Programs.jsx       # Daftar program
│   │   ├── ProgramDetail.jsx  # Detail program
│   │   ├── AdminDashboard.jsx # Panel admin
│   │   ├── ProposalDashboard.jsx # Dashboard proposal
│   │   └── Login.jsx          # Halaman login
│   ├── components/
│   │   ├── Navbar.jsx         # Navigasi
│   │   ├── ProgramCard.jsx    # Kartu program
│   │   ├── ProposalModal.jsx  # Modal proposal
│   │   └── ProtectedRoute.jsx # Proteksi route
│   └── App.js                 # Main app
└── package.json
```

---

## 4. Fitur Website

### 4.1 Fitur Utama

| No | Fitur | Status | Deskripsi |
|----|-------|--------|-----------|
| 1 | Login Admin | ✅ Aktif | Sistem autentikasi JWT untuk admin |
| 2 | Manajemen Program | ✅ Aktif | CRUD (Create, Read, Update, Delete) program CSR |
| 3 | Manajemen Kategori | ✅ Aktif | Pengorganisasian program berdasarkan kategori |
| 4 | Manajemen Proposal | ✅ Aktif | Input proposal dengan CASE ID manual |
| 5 | Responsive Design | ✅ Aktif | Tampilan mobile-friendly |
| 6 | Password Hashing | ✅ Aktif | Keamanan password dengan bcrypt |

### 4.2 Kategori Program CSR

Website mendukung 4 kategori utama program CSR:
1. **Lingkungan** - Program keberlanjutan lingkungan
2. **Pendidikan** - Program pemberdayaan di bidang pendidikan
3. **Kesehatan** - Program kesehatan masyarakat
4. **Ekonomi** - Program pemberdayaan ekonomi lokal

### 4.3 Status Program

Program CSR dapat memiliki salah satu dari 3 status:
- `planned` - Program yang direncanakan
- `ongoing` - Program yang sedang berjalan
- `completed` - Program yang telah selesai

### 4.4 Status Proposal Donasi

Proposal donasi memiliki sistem tracking dengan status:
- `In Progress` - Sedang diproses
- `Siap Diambil` - Siap untuk diambil/didistribusikan
- `Done` - Selesai

---

## 5. Halaman Website

### 5.1 Halaman Publik

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Home | `/` | Landing page dengan informasi umum |
| Programs | `/programs` | Daftar semua program CSR |
| Program Detail | `/programs/:id` | Detail program tertentu |
| Login | `/login` | Halaman login untuk admin |

### 5.2 Halaman Admin (Memerlukan Login)

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Admin Dashboard | `/admin` | Panel manajemen program CSR |
| Proposal Dashboard | `/proposals` | Manajemen proposal donasi |

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| POST | `/api/auth/login` | Login admin | Tidak |
| POST | `/api/auth/register` | Registrasi user | Tidak |

### 6.2 Programs

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| GET | `/api/programs` | Daftar semua program | Tidak |
| GET | `/api/programs/:id` | Detail program | Tidak |
| POST | `/api/programs` | Buat program baru | Ya (Admin) |
| PUT | `/api/programs/:id` | Update program | Ya (Admin) |
| DELETE | `/api/programs/:id` | Hapus program | Ya (Admin) |

### 6.3 Categories

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| GET | `/api/categories` | Daftar kategori | Tidak |

### 6.4 Proposals

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| GET | `/api/proposals` | Daftar proposal | Ya (Admin) |
| POST | `/api/proposals` | Buat proposal | Ya (Admin) |
| PUT | `/api/proposals/:id` | Update proposal | Ya (Admin) |
| DELETE | `/api/proposals/:id` | Hapus proposal | Ya (Admin) |

---

## 7. Database Schema

### 7.1 Tabel `users`

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| id | INT (PK) | Primary key |
| email | VARCHAR(255) | Email unik |
| password | VARCHAR(255) | Password hash |
| name | VARCHAR(255) | Nama pengguna |
| role | ENUM | 'admin' atau 'user' |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

### 7.2 Tabel `categories`

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| id | INT (PK) | Primary key |
| name | VARCHAR(255) | Nama kategori |
| description | TEXT | Deskripsi kategori |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

### 7.3 Tabel `csr_programs`

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| id | INT (PK) | Primary key |
| title | VARCHAR(255) | Judul program |
| description | TEXT | Deskripsi program |
| category_id | INT (FK) | Referensi ke categories |
| location | VARCHAR(255) | Lokasi program |
| start_date | DATE | Tanggal mulai |
| end_date | DATE | Tanggal selesai |
| status | ENUM | planned/ongoing/completed |
| image_url | VARCHAR(500) | URL gambar |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

### 7.4 Tabel `donation_proposals`

| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| id | INT (PK) | Primary key |
| case_id | VARCHAR(20) | CASE ID unik |
| proposal_name | VARCHAR(255) | Nama proposal |
| organization | VARCHAR(255) | Organisasi pengaju |
| bentuk_donasi | VARCHAR(100) | Bentuk donasi |
| tipe_proposal | VARCHAR(100) | Tipe proposal |
| product_detail | TEXT | Detail produk |
| jumlah_produk | VARCHAR(255) | Jumlah produk |
| budget | DECIMAL(15,2) | Anggaran |
| catatan | TEXT | Catatan tambahan |
| status | ENUM | Status proposal |
| bright_status | ENUM | Status approval |
| pic_name | VARCHAR(255) | Nama PIC |
| pic_email | VARCHAR(255) | Email PIC |
| proposal_date | DATE | Tanggal proposal |
| file_pendukung | VARCHAR(255) | Nama file |
| file_path | VARCHAR(255) | Path file |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

---

## 8. Keamanan

### 8.1 Implementasi Keamanan

| Fitur Keamanan | Status | Implementasi |
|----------------|--------|--------------|
| Password Hashing | ✅ | bcrypt dengan 10 salt rounds |
| JWT Authentication | ✅ | Token expire dalam 24 jam |
| Protected Routes | ✅ | Middleware untuk admin-only endpoints |
| CORS Configuration | ✅ | Konfigurasi untuk frontend access |

### 8.2 Rekomendasi Keamanan untuk Production

- ⚠️ Ubah `JWT_SECRET` ke nilai yang kuat dan acak
- ⚠️ Gunakan HTTPS untuk semua komunikasi
- ⚠️ Setup environment variables dengan aman di server
- ⚠️ Implementasi rate limiting untuk mencegah brute force
- ⚠️ Pertimbangkan JWT expiry yang lebih pendek (1-2 jam) dengan refresh token untuk operasi admin sensitif
- ⚠️ Implementasi input validation yang ketat di semua endpoint
- ⚠️ Gunakan parameterized queries untuk mencegah SQL injection
- ⚠️ Implementasi proper error handling untuk menghindari information disclosure

---

## 9. Deployment

### 9.1 Prerequisites
- Node.js v18+ (LTS) atau v20+
- MySQL/MariaDB
- Git

### 9.2 Environment Variables

**Backend (.env):**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=csr_db
JWT_SECRET=your-super-secret-jwt-key
```

**Frontend (.env):**
```
REACT_APP_API_BASE=http://localhost:5000/api
```

### 9.3 URL Default
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 10. Kesimpulan

CSR Portal adalah website yang lengkap dan fungsional untuk mengelola program Corporate Social Responsibility. Website ini menyediakan:

1. **Sistem manajemen yang terintegrasi** - Mengelola program, kategori, dan proposal dalam satu platform
2. **Keamanan yang baik** - JWT authentication dan password hashing
3. **API RESTful yang lengkap** - Mendukung CRUD operations untuk semua entitas
4. **Desain responsive** - Dapat diakses dari berbagai perangkat
5. **Skalabilitas** - Arsitektur yang dapat dikembangkan sesuai kebutuhan

### Rekomendasi Pengembangan Selanjutnya

1. Implementasi notifikasi email untuk proposal baru
2. Dashboard analitik dengan grafik dan statistik
3. Sistem upload file yang lebih robust
4. Multi-language support (internasionalisasi)
5. Integrasi dengan sistem pembayaran untuk donasi online
6. Mobile application menggunakan React Native

---

**Dibuat oleh**: Tim IT PT Tirta Investama  
**Tanggal**: 23 Desember 2025  
**Versi Laporan**: 1.0

---

© 2025 PT Tirta Investama - Sistem Informasi Manajemen CSR - All Rights Reserved
