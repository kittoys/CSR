# Interface Color Strategy - CSR Aqua

## 1) Design Intent

Palet diarahkan ke nuansa aqua-blue yang bersih, profesional, dan terpercaya.

- Kesan utama: modern, kredibel, ramah.
- Prioritas UX: keterbacaan, hirarki visual jelas, konsistensi lintas komponen.
- Prinsip: gunakan semantic token, hindari hardcoded color pada komponen baru.

## 2) Core Palette (Updated)

Gunakan token berikut sebagai sumber tunggal warna:

- Primary:
  - `--color-primary: #0b6bbd`
  - `--color-primary-light: #2f84cf`
  - `--color-primary-dark: #084d8a`
- Secondary:
  - `--color-secondary: #0f9f8b`
  - `--color-secondary-light: #36bba8`
  - `--color-secondary-dark: #0b7b6c`
- Feedback:
  - `--color-success: #0f9f6e`
  - `--color-warning: #b7791f`
  - `--color-error: #cf3344`
  - `--color-info: #2e7bcf`
- Neutrals:
  - `--color-dark: #0f1e33`
  - `--color-text: #1b2b42`
  - `--color-text-light: #4b5f79`
  - `--color-muted: #6f8097`
  - `--color-border: #d7e2ee`
  - `--color-background: #f4f8fc`
  - `--color-background-alt: #eaf1f8`
  - `--color-surface: #ffffff`

## 3) Accessibility Rules

Target kontras:

- Body text vs background: minimal WCAG AA normal text (4.5:1).
- Large text (>= 18px regular / 14px bold): minimal 3:1.
- Interactive focus ring harus terlihat jelas di semua state.

Aturan praktis:

- Pakai `--color-text` untuk teks utama.
- Pakai `--color-text-light` hanya untuk meta/helper text.
- Jangan pakai warna accent sebagai warna teks kecil di atas surface terang.
- Focus outline standar: `--color-focus-ring`.

## 4) Consistency and Usage Mapping

Semantic mapping wajib:

- CTA utama: `--gradient-primary` + `--color-on-primary`.
- Tombol sekunder: border dan text `--color-primary`, background `--color-surface`.
- State error/success/info/warning: gunakan token feedback, bukan hex baru.
- Border komponen: default `--color-border`.
- Surface elevated/card: `--color-background-elevated` atau `--color-surface`.

## 5) Emotional Impact Guidelines

- Primary blue: menegaskan trust, stabilitas, dan profesionalitas.
- Secondary teal: memberi kesan segar, progresif, ramah lingkungan.
- Warm accents (warning/accent-2): dipakai hemat untuk perhatian, jangan dominan.
- Error merah: khusus untuk problem/aksi destruktif, hindari penggunaan dekoratif.

## 6) Technical Implementation Workflow

Untuk desainer:

1. Definisikan style library berbasis semantic token.
2. Hindari penggunaan direct hex kecuali token foundation.
3. Validasi kontras sebelum handoff.

Untuk developer:

1. Ambil warna dari token CSS di `src/index.css`.
2. Untuk transparansi, gunakan RGB token:
   - `--color-primary-rgb`
   - `--color-secondary-rgb`
   - `--color-error-rgb`
3. Ganti hardcoded color bertahap pada komponen lama.
4. Lakukan visual QA pada halaman prioritas: Navbar, Login, Dashboard, Proposal.

Contoh pattern:

```css
.component {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.component:hover {
  background: rgba(var(--color-primary-rgb), 0.08);
  color: var(--color-primary);
}
```

## 7) Governance

- Semua perubahan warna baru wajib lewat token.
- PR yang menambah hardcoded hex perlu alasan eksplisit.
- Review UI minimal cek: contrast, consistency, focus visibility, feedback states.
