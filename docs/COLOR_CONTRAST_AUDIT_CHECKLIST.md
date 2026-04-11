# Color Contrast Audit Checklist

Gunakan checklist ini untuk review cepat sebelum release UI.

## Scope Halaman Prioritas

- Login
- Navbar + Sidebar
- Program Dashboard
- Proposal Dashboard
- Chart Dashboard

## Aturan Kontras Minimum

- Teks normal: minimal 4.5:1
- Teks besar (>= 18px regular / >= 14px bold): minimal 3:1
- Komponen non-text penting (icon status, border input aktif): minimal 3:1 terhadap background

## Checklist Komponen

### 1. Typography

- Judul utama terhadap background pass AA
- Teks body terhadap surface pass AA
- Teks muted masih terbaca jelas di semua card/panel

### 2. Buttons

- Primary button: text vs background pass AA
- Secondary button: text/border vs background pass AA
- Disabled state tetap terbaca (tidak terlalu pudar)
- Hover/active tidak menurunkan kontras

### 3. Form Inputs

- Label form jelas terhadap background
- Placeholder tidak disalahartikan sebagai value
- Border input default/hover/focus tetap terlihat
- Focus ring terlihat jelas di keyboard navigation

### 4. Alerts dan Status

- Error alert: teks + icon + border terbaca jelas
- Success/info/warning badge tidak hanya mengandalkan warna
- Status chart legend memiliki kontras memadai

### 5. Navigation

- Link default, hover, active mudah dibedakan
- Sidebar/mobile drawer tetap terbaca saat overlay aktif
- Logout/destructive action jelas berbeda dari action normal

## Teknik Validasi

- DevTools color picker + contrast ratio
- Simulasi light conditions (layar redup/brightness rendah)
- Uji keyboard tab fokus di seluruh area interaktif

## Pass Criteria

- Tidak ada teks utama di bawah 4.5:1
- Tidak ada fokus state yang hilang
- Semua CTA utama tetap jelas pada hover/active/disabled
- Tidak ada elemen kritikal yang mengandalkan warna saja tanpa indikator lain
