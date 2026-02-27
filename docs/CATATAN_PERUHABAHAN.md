# Catatan Perubahan Proyek (Harian)

Dokumen ini dipakai untuk mencatat perubahan berdasarkan **Tahun → Hari/Tanggal**.

## 2026

### Kamis, 27 Februari 2026

**Ruang lingkup:** Frontend CSR (routing, navigasi, dashboard, UI, dokumentasi)

#### Perubahan

- Memisahkan alur halaman publik dan internal:
  - Publik: `Home`, `Programs`
  - Internal: `Proposals`, `Admin`
  - Halaman login tanpa navbar.
- Mengubah navigasi internal dari top navbar menjadi sidebar dashboard.
- Menambahkan mode mobile untuk internal (header + drawer).
- Menambahkan fitur sidebar bisa disembunyikan/tampilkan kembali.
- Menyimpan state sidebar (show/hide) ke `localStorage` agar persisten setelah refresh.
- Menambahkan akses cepat **Halaman Publik** pada sidebar admin.
- Mengubah link publik di sidebar agar membuka **tab baru** (bukan pindah tab aktif).
- Merapikan spacing/padding dashboard admin dan proposal agar lebih konsisten.
- Menyamakan tinggi visual header admin dan proposal.
- Meningkatkan responsivitas dan keterbacaan UI (desktop/tablet/mobile).
- Menambahkan ikon pada badge periode di dashboard proposal.
- Memperbaiki konflik class CSS `.filter-badge` antara halaman Programs dan Proposal.
- Menangani artefak visual garis/tanda biru dengan penyesuaian style yang aman.
- Menambahkan guard pseudo-element pada blok atas dashboard proposal untuk mencegah artefak style.

#### File terdampak

- `frontend/src/App.js`
- `frontend/src/App.css`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Navbar.css`
- `frontend/src/pages/AdminDashboard.css`
- `frontend/src/pages/ProposalDashboard.jsx`
- `frontend/src/pages/ProposalDashboard.css`
- `frontend/src/pages/Programs.css`
- `frontend/src/index.css`
- `docs/CATATAN_PERUHABAHAN.md`

#### Validasi

- Build frontend berhasil (`npm run build`) setelah perubahan.

---

## Template Entri Harian

### [Hari], [Tanggal Bulan Tahun]

**Ruang lingkup:**

#### Perubahan

-
-

#### File terdampak

-

#### Validasi

-
