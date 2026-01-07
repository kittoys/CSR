# 📘 CSR Backend Setup Guide

---

## 📊 Database Setup (MySQL)

### 1. Install MySQL

- Download dari [mysql.com](https://www.mysql.com/downloads/)
- Atau gunakan package manager:

  ```bash
  # Windows (dengan Chocolatey)
  choco install mysql

  # macOS (dengan Homebrew)
  brew install mysql
  ```

### 2. Start MySQL Service

```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo service mysql start
```

### 3. Login ke MySQL

```bash
mysql -u root -p
# Default password: (kosong, langsung tekan Enter)
```

### 4. Import Database Schema

Di MySQL command line, jalankan:

```sql
SOURCE C:\Users\HYPE AMD\CSR\csr-backend\setup.sql;
```

Atau gunakan MySQL Workbench/DBeaver untuk import file `setup.sql`.

### 5. Verifikasi Database

```sql
USE csr_db;
SHOW TABLES;
SELECT * FROM users;
```

---

## 🛠️ Backend Setup

### 1. Install Dependencies

```bash
cd csr-backend
npm install
```

### 2. Konfigurasi .env

Edit file `.env` dengan konfigurasi MySQL Anda:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=csr_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Jalankan Backend

```bash
npm run dev
```

Backend akan running di `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd csr-frontend
npm install
```

### 2. Konfigurasi .env

```
REACT_APP_API_BASE=http://localhost:5000/api
```

### 3. Jalankan Frontend

```bash
npm start
```

Frontend akan running di `http://localhost:3000`

---

## 🔐 Login Credentials

Setelah setup database selesai, gunakan credentials berikut:

- **Email**: admin@csr.com
- **Password**: admin123

> **Note**: Password sudah di-hash dengan bcrypt. Jika ingin mengubah password, gunakan script atau tool untuk hash password baru dengan bcrypt.

---

## 🔌 API Endpoints

### Auth

- `POST /api/auth/login` - Login admin
- `POST /api/auth/register` - Register user (optional)

### Programs (require auth token)

- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get program by id
- `POST /api/programs` - Create program (admin only)
- `PUT /api/programs/:id` - Update program (admin only)
- `DELETE /api/programs/:id` - Delete program (admin only)

### Categories

- `GET /api/categories` - Get all categories

---

## ⚠️ Troubleshooting

### Error: connect ECONNREFUSED 127.0.0.1:3306

- MySQL service tidak running. Start MySQL terlebih dahulu.

### Error: Access denied for user 'root'@'localhost'

- Password MySQL salah. Sesuaikan di `.env` atau reset password MySQL.

### Error: Unknown database 'csr_db'

- Database belum di-import. Jalankan `setup.sql` terlebih dahulu.
