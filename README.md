# 🎯 CSR (Corporate Social Responsibility) Portal

Sistem manajemen program CSR dengan login admin, CRUD program/kategori, serta formulir proposal dengan CASE ID yang bisa dikontrol manual (dipisah ID NAME dan ID CASE).

## 📋 Fitur Utama

- ✅ **Login Admin**: Hanya admin yang bisa login
- ✅ **Manajemen Program**: Create, Read, Update, Delete program CSR
- ✅ **Kategori**: Organisasi program berdasarkan kategori
- ✅ **Proposal**: Input proposal dengan CASE ID manual (ID NAME + ID CASE)
- ✅ **Responsive Design**: Desain mobile-friendly untuk seluruh halaman
- ✅ **JWT Authentication**: Keamanan token-based
- ✅ **Password Hashing**: Password di-hash dengan bcrypt

## 🛠️ Tech Stack

**Frontend:**

- React + React Router
- Axios (HTTP client)
- CSS3

**Backend:**

- Node.js + Express
- MySQL/MariaDB
- JWT (JSON Web Tokens)
- bcrypt

## 📦 Prerequisites

- Node.js v16+ ([download](https://nodejs.org/))
- MySQL/MariaDB ([download](https://www.mysql.com/downloads/))
- Git

## 🚀 Quick Start

### 1. Database Setup

#### Option A: Otomatis dengan Script

```bash
cd csr-backend
npm run setup-db
npm run seed-db
```

#### Option B: Manual dengan MySQL CLI

```bash
mysql -u root -p < setup.sql
```

### 2. Backend Setup

```bash
cd csr-backend

# Copy environment variables
cp .env.example .env

# Edit .env sesuai konfigurasi MySQL Anda
nano .env

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Backend akan running di `http://localhost:5000`

### 3. Frontend Setup

Di terminal baru:

```bash
cd csr-frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Jalankan development server
npm start
```

Frontend akan running di `http://localhost:3000` dan auto-redirect ke `/login`

## 🔐 Login Credentials

Setelah setup selesai, gunakan:

- **Email**: `admin@csr.com`
- **Password**: `admin123`

## 📁 Project Structure

```
csr-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── routes/
│   │   ├── auth.js            # Login/Register
│   │   ├── programs.js        # Program CRUD
│   │   └── categories.js      # Categories
│   └── index.js               # Entry point
├── scripts/
│   ├── setupDb.js             # Setup database
│   ├── seed.js                # Seed data
│   ├── testDb.js              # Test connection
│   └── createAdmin.js         # Create admin user
├── setup.sql                  # Database schema
├── .env                       # Environment variables
└── package.json

csr-frontend/
├── src/
│   ├── api/
│   │   ├── auth.js            # Auth API calls
│   │   └── programs.js        # Programs API calls
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Programs.jsx       # List programs
│   │   ├── ProgramDetail.jsx  # Program details
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   └── Login.jsx          # Login page
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── ProgramCard.jsx    # Program card component
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── App.jsx                # Main app
│   └── index.js               # Entry point
└── .env                       # Environment variables
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

### Proposals (Require Authentication)

| Method | Endpoint             | Description       | Auth        |
| ------ | -------------------- | ----------------- | ----------- |
| GET    | `/api/proposals`     | Get all proposals | Yes (Admin) |
| POST   | `/api/proposals`     | Create proposal   | Yes (Admin) |
| PUT    | `/api/proposals/:id` | Update proposal   | Yes (Admin) |
| DELETE | `/api/proposals/:id` | Delete proposal   | Yes (Admin) |

**CASE ID:**

- Diisi manual oleh admin dan terbagi dua input: **ID NAME** (contoh: CSR/DONASI/BRIGHT) dan **ID CASE** (contoh: 2025-001). Disatukan saat disimpan sebagai `CASE_ID`.

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
npm run dev          # Development server dengan nodemon
npm run start        # Production server
npm run setup-db     # Setup database schema
npm run seed-db      # Seed sample data
npm run test-db      # Test database connection
npm run create-admin # Create new admin user
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

# macOS
brew services start mysql
```

### "Unknown database 'csr_db'"

**Solution**: Jalankan setup database

```bash
npm run setup-db
npm run seed-db
```

### "Token tidak valid"

**Solution**: Login ulang dan pastikan token disimpan di localStorage

### CORS Error

**Solution**: Pastikan backend URL di `.env` frontend benar

```
REACT_APP_API_BASE=http://localhost:5000/api
```

## 🔒 Security Notes

- ✅ Password di-hash dengan bcrypt (salt: 10 rounds)
- ✅ JWT token expire dalam 24 jam
- ✅ Admin-only endpoints dilindungi middleware
- ⚠️ **Production**: Ubah `JWT_SECRET` ke nilai yang kuat
- ⚠️ **Production**: Gunakan HTTPS
- ⚠️ **Production**: Setup environment variables di server

## 📚 Database Schema

### users

```sql
id (INT, PK, AUTO_INCREMENT)
email (VARCHAR(255), UNIQUE)
password_hash (VARCHAR(255))
name (VARCHAR(255))
role (ENUM: 'admin', 'user')
created_at (TIMESTAMP)
```

### categories

```sql
id (INT, PK, AUTO_INCREMENT)
name (VARCHAR(100))
```

### csr_programs

```sql
id (INT, PK, AUTO_INCREMENT)
title (VARCHAR(255))
description (TEXT)
category_id (INT, FK)
location (VARCHAR(255))
start_date (DATE)
end_date (DATE)
status (ENUM: 'planned', 'ongoing', 'completed')
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

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.

---

**Happy Coding! 🎉**
#   C S R  
 #   C S R  
 