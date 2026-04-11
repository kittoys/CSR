# Frontend Toolchain Upgrade Plan (Tanpa Force)

## Tujuan

- Menurunkan vulnerability frontend secara signifikan tanpa menjalankan `npm audit fix --force`.
- Menjaga aplikasi tetap stabil selama proses transisi.

## Kondisi Saat Ini

- Toolchain utama masih berbasis `react-scripts@5.0.1`.
- Vulnerability dominan berasal dari dependency transitive lama di ekosistem CRA (webpack-dev-server, svgo chain, serialize-javascript, dll).
- Safe fix biasa (`npm audit fix`) tidak cukup untuk menutup semua temuan.

## Strategi Utama

- Hindari patch paksa pada dependency transitive CRA.
- Migrasi bertahap dari CRA ke bundler modern yang aktif dipelihara (disarankan: Vite).

## Fase Eksekusi

### Fase 0 - Baseline dan Freeze

1. Tetapkan baseline saat ini:
   - `npm run test -- --watchAll=false`
   - `npm run build`
   - `npm audit --audit-level=low`
2. Freeze perubahan fitur besar selama migrasi toolchain.
3. Gunakan branch khusus migrasi.

### Fase 1 - Persiapan Kompatibilitas

1. Pastikan versi Node untuk tim/CI minimal Node 20 LTS.
2. Rapikan entry point agar netral bundler:
   - Pastikan import asset dan env vars tidak bergantung ke API internal CRA.
3. Ganti akses env ke pola `process.env.REACT_APP_*` yang mudah dipetakan ke `import.meta.env.VITE_*`.

### Fase 2 - Migrasi ke Vite (Non-Force)

1. Tambah dependency inti:
   - `vite`
   - `@vitejs/plugin-react`
2. Buat file konfigurasi:
   - `vite.config.js`
3. Buat/migrasikan entry HTML ke format Vite (`index.html` di root frontend).
4. Update script di `frontend/package.json`:
   - `dev`: `vite`
   - `build`: `vite build`
   - `preview`: `vite preview`
5. Lepas `react-scripts` setelah build dan dev server Vite stabil.

### Fase 3 - Adaptasi Testing

1. Opsi aman bertahap:
   - Tetap pakai Jest sementara untuk menghindari perubahan besar sekaligus.
2. Opsi lanjutan (disarankan setelah stabil):
   - Migrasi ke Vitest + Testing Library.
3. Pastikan smoke test saat ini tetap hijau sebelum dan sesudah migrasi.

### Fase 4 - Hardening dan Audit Ulang

1. Jalankan ulang:
   - `npm run test -- --watchAll=false`
   - `npm run build`
   - `npm audit --audit-level=low`
2. Evaluasi selisih vulnerability vs baseline.
3. Jika masih ada temuan residual, tangani pada dependency direct terlebih dahulu (tanpa force).

## Estimasi Risiko dan Mitigasi

- Risiko: Perbedaan handling asset/CSS.
  - Mitigasi: validasi halaman kunci (Home, Programs, Program Dashboard, Proposal Dashboard, Chart).
- Risiko: Perbedaan variabel environment.
  - Mitigasi: siapkan mapping `REACT_APP_*` -> `VITE_*` bertahap.
- Risiko: Perubahan perilaku test runner.
  - Mitigasi: pertahankan smoke test minimal, migrasi test framework dilakukan setelah build stabil.

## Kriteria Selesai

- Dev server dan build tidak lagi bergantung pada `react-scripts`.
- Smoke test frontend tetap pass.
- Jumlah vulnerability high/moderate turun signifikan dibanding baseline awal.
- Tidak ada penggunaan `npm audit fix --force`.
