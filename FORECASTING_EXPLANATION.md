# 📊 Dokumentasi Sistem Forecasting CSR

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Mengapa Tren Turun?](#mengapa-tren-turun)
3. [Metode Forecasting](#metode-forecasting)
4. [Cara Kerja Detail](#cara-kerja-detail)
5. [Rumus Matematika](#rumus-matematika)
6. [Implementasi di Kode](#implementasi-di-kode)

---

## Pengenalan

Sistem forecasting CSR memprediksi anggaran donasi 12 bulan ke depan berdasarkan data historis. Hasil prediksi ditampilkan di dashboard dengan informasi:
- **Proyeksi Budget 1 Tahun**: Total prediksi untuk 12 bulan mendatang
- **Tren**: Pola naik (↑), turun (↓), atau stabil (→)
- **Confidence**: Tingkat kepercayaan model (0-100%)

---

## Mengapa Tren Turun?

### 🔴 Alasan Utama: Pola Data Historis Menurun

Sistem forecasting mendeteksi **tren turun** ketika:

#### **1. Data Bulanan Cenderung Menurun**
```
Bulan        Budget
Jun 2025:    500 jt
Mei 2025:    550 jt
Apr 2025:    480 jt
Mar 2025:    520 jt
Feb 2025:    600 jt  ← Lebih tinggi
Jan 2025:    450 jt
```

Jika melihat 6-12 bulan terakhir **cenderung lebih rendah** dari sebelumnya, sistem akan mendeteksi tren turun.

#### **2. Slope Linear Regression Negatif**
Dari kode (baris 255 di forecast.js):
```javascript
trend:
  lrResult.slope > 0.1 ? "up" 
    : lrResult.slope < -0.1 ? "down" 
    : "stable"
```

**Penjelasan:**
- **Slope > 0.1** → Tren naik (garis grafik naik)
- **Slope < -0.1** → **Tren turun** (garis grafik turun) ← **INI YANG TERJADI**
- **-0.1 ≤ Slope ≤ 0.1** → Tren stabil

**Contoh Visual:**
```
Naik       Turun      Stabil
  ╱         ╲            ═══
 ╱           ╲           
╱             ╲          
─────────────────────────────
```

#### **3. Perhitungan Tren Eksplisit**
Ada 2 cara sistem mendeteksi tren:

**Metode 1 - Dari Linear Regression (Budget):**
```
Menggunakan rumus garis lurus: Y = a + bX
- b (slope/koefisien) negatif = turun
- Contoh: Y = 500 - 10X
  (Setiap bulan berkurang 10 juta)
```

**Metode 2 - Dari Exponential Smoothing (Proposal):**
```javascript
// Baris 45-53 forecast.js
const recent = actuals.slice(-3);  // 3 bulan terakhir
trend =
  recent[recent.length - 1] > recent[0]
    ? "up"
    : recent[recent.length - 1] < recent[0]
      ? "down"      // ← Jika bulan terakhir < 3 bln lalu
      : "stable"
```

---

### 📉 Skenario Konkret Tren Turun

**Contoh 1: Budget Proposal Turun**
```
Tahun 2024:  5.000 jt
Tahun 2023:  6.500 jt  ← Tahun sebelumnya lebih besar
Growth Rate: (5000 - 6500) / 6500 = -23.07% ❌ TURUN
```

**Contoh 2: Pola Musiman + Trend Turun**
```
Q1 2025: 1.500 jt
Q2 2025: 1.300 jt  ← Menurun
Q3 2025: 1.100 jt  ← Terus menurun
Q4 2025: 900 jt    ← Prediksi semakin rendah

Slope Trend: -200 jt/quarter → Tren TURUN
```

---

## Metode Forecasting

### 1️⃣ Exponential Smoothing (SES)
**Kapan digunakan:**
- Data proposal count (proposal_forecast)
- Data donasi barang
- Data dengan < 12 bulan

**Karakteristik:**
- Memberikan bobot lebih ke data terbaru
- Sederhana & cepat
- Alpha (α) default = 0.3

**Rumus:**
```
S_t = α·X_t + (1-α)·S_(t-1)

Dimana:
- S_t = nilai smoothed periode t
- X_t = nilai actual periode t
- α = smoothing factor (0-1)
- S_(t-1) = nilai smoothed periode sebelumnya
```

**Contoh:**
```
Bulan    Actual   Smoothed (α=0.3)
Jan      100      100
Feb      120      0.3(120) + 0.7(100) = 106
Mar      110      0.3(110) + 0.7(106) = 107.8
Apr      130      0.3(130) + 0.7(107.8) = 115.46
```

### 2️⃣ Linear Regression
**Kapan digunakan:**
- Untuk menemukan trend component
- Dalam improved seasonal forecast

**Karakteristik:**
- Membuat garis lurus terbaik
- Menghitung slope (kemiringan) & intercept
- Memberikan R² (koefisien determinasi)

**Rumus:**
```
Y = a + bX

b (slope) = (n·ΣXY - ΣX·ΣY) / (n·ΣX² - (ΣX)²)
a (intercept) = (ΣY - b·ΣX) / n

R² = 1 - (SSRes / SSTot)
```

**Interpretasi:**
- **Slope > 0** → Tren naik
- **Slope < 0** → Tren turun ← **KASUS INI**
- **R² = 0.9** → Model cocok 90%

### 3️⃣ Improved Seasonal Forecast (Advanced) ⭐
**Kapan digunakan:**
- Data budget proposal (>= 12 bulan)
- Data dengan pola musiman yang jelas 

**Tahap-tahap:**
1. **Outlier Detection** - Hapus anomali
2. **Detrending** - Pisahkan trend dari seasonal
3. **Calculate Seasonal Index** - Pola setiap bulan
4. **Forecast** - Trend × Seasonal

**Contoh Seasonal Index:**
```
Januari:     1.2x rata-rata (musim tinggi)
Februari:    0.8x rata-rata (musim rendah)
Maret:       1.1x rata-rata
...
Desember:    1.5x rata-rata (akhir tahun)
```

---

## Cara Kerja Detail

### Budget Forecast Flow

```
┌─────────────────────────────────┐
│ Data Historis dari Database     │
│ (donation_proposals)            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Group by Month                  │
│ SUM(budget) per bulan           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Improved Seasonal Forecast      │
│ (jika data >= 12 bulan)        │
│ atau                            │
│ Exponential Smoothing           │
│ (jika data < 12 bulan)         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Hapus Outliers (IQR Method)    │
│ Detrend dengan Moving Average   │
│ Hitung Seasonal Indices         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Linear Regression pada Trend    │
│ Hitung Slope & R²              │
│ ► Jika Slope < -0.1            │
│   ► TREND = "DOWN" ⬇️           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Generate Forecast 12 Bulan      │
│ Forecast = Trend × Seasonal     │
│ Hitung MAPE (akurasi)          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Response API                    │
│ - forecast: [...]              │
│ - trend: "down"                │
│ - confidence: 85%              │
│ - mape: 15.3%                  │
└─────────────────────────────────┘
```

---

## Rumus Matematika

### Exponential Smoothing MAPE
```
MAPE = (1/n) × Σ|Actual - Smoothed| / |Actual| × 100%

Contoh:
Actual:  100, Smoothed: 95    → Error = 5/100 = 5%
Actual:  200, Smoothed: 190   → Error = 10/200 = 5%
Actual:  150, Smoothed: 165   → Error = 15/150 = 10%
MAPE = (5 + 5 + 10) / 3 = 6.67%
```

### Linear Regression Slope (Trend Calculation)
```
Misalkan data: [500, 480, 510, 490, 470] juta

X (bulan):  1, 2, 3, 4, 5
Y (budget): 500, 480, 510, 490, 470

ΣX = 15
ΣY = 2450
ΣXY = 1×500 + 2×480 + 3×510 + 4×490 + 5×470 = 7180
ΣX² = 1 + 4 + 9 + 16 + 25 = 55
n = 5

b = (5×7180 - 15×2450) / (5×55 - 15²)
  = (35900 - 36750) / (275 - 225)
  = -850 / 50
  = -17 ← NEGATIF = TREN TURUN

Interpretasi: Setiap bulan budget berkurang ~17 juta
```

### Seasonal Index Normalization
```
Raw Seasonal Indices:
Jan: 1.5, Feb: 1.2, Mar: 1.0, Apr: 0.8, ... Des: 1.3
Rata-rata: 1.05

Normalized (÷1.05):
Jan: 1.43, Feb: 1.14, Mar: 0.95, Apr: 0.76, ... Des: 1.24

Interpretasi: Januari 43% lebih tinggi dari rata-rata tahunan
```

---

## Implementasi di Kode

### File: backend/src/routes/forecast.js

#### 1. Deteksi Tren di Linear Regression (Baris 255)
```javascript
trend:
  lrResult.slope > 0.1 ? "up" : 
  lrResult.slope < -0.1 ? "down" : 
  "stable"
```
**Logika:**
- Jika slope > 0.1 → Tren Naik
- Jika slope < -0.1 → **Tren Turun** ← Kasus Anda
- Jika -0.1 ≤ slope ≤ 0.1 → Tren Stabil

#### 2. Growth Rate Method (Baris 330-337)
```javascript
const growthRate =
  yearlyBudgets.length >= 2
    ? ((yearlyBudgets[yearlyBudgets.length - 1].budget -
        yearlyBudgets[0].budget) /
        yearlyBudgets[0].budget) *
      100
    : 0;
const trend = growthRate > 2 ? "up" : growthRate < -2 ? "down" : "stable";
```

**Contoh:**
```
Tahun 2023: 10 miliar
Tahun 2024: 8 miliar
Growth Rate = (8 - 10) / 10 × 100 = -20%
Trend = "down" ⬇️
```

#### 3. Exponential Smoothing Trend (Baris 45-53)
```javascript
const recent = actuals.slice(-3);  // 3 data terakhir
trend =
  recent[recent.length - 1] > recent[0]
    ? "up"
    : recent[recent.length - 1] < recent[0]
      ? "down"  // ← Bulan terakhir < 3 bulan lalu
      : "stable";
```

#### 4. Outlier Removal (Baris 131-147)
```javascript
function removeOutliers(data, multiplier = 1.5) {
  // IQR = Q3 - Q1
  // Lower Bound = Q1 - 1.5 × IQR
  // Upper Bound = Q3 + 1.5 × IQR
  // Outlier = nilai di luar range
  // Replace outlier dengan median
}
```

**Contoh IQR:**
```
Data: [10, 12, 15, 18, 20, 100] ← 100 adalah outlier
Sorted: [10, 12, 15, 18, 20, 100]
Q1 = 12, Q3 = 20
IQR = 8
Lower = 12 - 1.5×8 = -0
Upper = 20 + 1.5×8 = 32
100 > 32 → OUTLIER, ganti dengan median 16.5
```

#### 5. Damping Trend (Baris 66, 113)
```javascript
// Exponential Smoothing
forecast[i] += recentSlope * (i + 1) * Math.pow(0.88, i);

// Linear Regression
const weight = Math.pow(0.88, i);
const dampedForecast = lrRaw * weight + yMean2 * (1 - weight);
```

**Alasan Damping:**
```
Tanpa damping:
Bulan 1: -10
Bulan 2: -20
Bulan 3: -30
Bulan 12: -120 ← Terlalu ekstrem!

Dengan damping (0.88^i):
Bulan 1: -10 × 0.88 = -8.8
Bulan 2: -20 × 0.77 = -15.4
Bulan 3: -30 × 0.68 = -20.4
Bulan 12: -120 × 0.09 = -10.8 ← Lebih realistis
```

---

## Kesimpulan

### ✅ Tren Turun Terjadi Karena:

1. **Data historis menunjukkan penurunan konsisten**
   - Budget bulan lalu lebih rendah dari bulan sebelumnya
   
2. **Slope Linear Regression negatif (< -0.1)**
   - Garis trend berbentuk: ╲ (menurun)
   
3. **Growth rate year-over-year negatif**
   - Budget 2024 lebih kecil dari 2023

4. **Damping trend** menyebabkan prediksi semakin mendekati rata-rata:
   - Bulan depan menurun -X
   - 3 bulan nanti menurun -Y (lebih kecil dari X)
   - 12 bulan nanti menurun mendekati rata-rata

### 🎯 Implikasi Bisnis:
- **228 jt** = Total prediksi 12 bulan
- **Tren Turun** = Perlu investigasi:
  - Apakah ada musim?
  - Perubahan kebijakan donasi?
  - Kurangnya campaign?

### 📈 Rekomendasi:
- Analisis data historis lebih detail
- Identifikasi faktor eksternal penurunan
- Buat strategi untuk reverse trend
- Monitor accuracy (MAPE) setiap bulan
