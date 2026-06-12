import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  FileText,
  Droplets,
  BarChart3,
  Target,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { getForecastOverview } from "../api/forecast";
import "./ForecastCenter.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}rb`;
  return value;
};

const monthLabel = (monthKey) => {
  if (!monthKey) return "";
  const parts = monthKey.split("-");
  const m = parseInt(parts[1], 10);
  return MONTHS_SHORT[m - 1] || monthKey;
};

const ForecastCenter = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const overviewData = await getForecastOverview();
        setOverview(overviewData);
      } catch (err) {
        console.error("Forecast fetch error:", err);
        setError("Gagal memuat data forecast. Pastikan server berjalan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  // ---- Budget Chart Data dengan Confidence Interval ----
  const budgetChartData = useMemo(() => {
    if (!overview) return null;

    const historicalLabels = overview.monthly.map((m) => monthLabel(m.month));
    const forecastLabels = overview.forecast.map((m) => monthLabel(m.month));
    const allLabels = [...historicalLabels, ...forecastLabels];

    const histBudgets = overview.monthly.map((m) => m.budget);
    const forecastBudgets = overview.forecast.map((m) => m.budget);
    const forecastUpper = overview.forecast.map((m) => m.budgetUpper);
    const forecastLower = overview.forecast.map((m) => m.budgetLower);

    // Pad historical to same length for overlay
    const histPadded = [
      ...histBudgets,
      ...Array(forecastBudgets.length).fill(null),
    ];
    const forecastPadded = [
      ...Array(histBudgets.length).fill(null),
      ...forecastBudgets,
    ];
    const confidenceUpperPadded = [
      ...Array(histBudgets.length).fill(null),
      ...forecastUpper,
    ];
    const confidenceLowerPadded = [
      ...Array(histBudgets.length).fill(null),
      ...forecastLower,
    ];

    return {
      labels: allLabels,
      datasets: [
        {
          label: "Budget Historis",
          data: histPadded,
          backgroundColor: "rgba(11, 107, 189, 0.7)",
          borderColor: "#0b6bbd",
          borderWidth: 1,
          borderRadius: 6,
          type: "bar",
        },
        {
          label: "Prediksi Budget",
          data: forecastPadded,
          backgroundColor: "rgba(15, 159, 139, 0.6)",
          borderColor: "#0f9f8b",
          borderWidth: 2,
          borderDash: [6, 4],
          borderRadius: 6,
          type: "bar",
        },
        {
          label: "Batas Atas (Kepercayaan)",
          data: confidenceUpperPadded,
          borderColor: "rgba(15, 159, 139, 0.3)",
          borderWidth: 1,
          borderDash: [3, 3],
          backgroundColor: "rgba(15, 159, 139, 0.05)",
          fill: false,
          tension: 0,
          pointRadius: 0,
          type: "line",
        },
        {
          label: "Batas Bawah (Kepercayaan)",
          data: confidenceLowerPadded,
          borderColor: "rgba(15, 159, 139, 0.3)",
          borderWidth: 1,
          borderDash: [3, 3],
          backgroundColor: "rgba(15, 159, 139, 0.05)",
          fill: "-1",
          tension: 0,
          pointRadius: 0,
          type: "line",
        },
      ],
    };
  }, [overview]);

  // ---- Proposal Chart Data ----
  const proposalChartData = useMemo(() => {
    if (!overview) return null;

    const historicalLabels = overview.monthly.map((m) => monthLabel(m.month));
    const forecastLabels = overview.forecast.map((m) => monthLabel(m.month));
    const allLabels = [...historicalLabels, ...forecastLabels];

    const histCounts = overview.monthly.map((m) => m.proposals);
    const forecastCounts = overview.forecast.map((m) => m.proposals);

    const histPadded = [
      ...histCounts,
      ...Array(forecastCounts.length).fill(null),
    ];
    const forecastPadded = [
      ...Array(histCounts.length).fill(null),
      ...forecastCounts,
    ];

    return {
      labels: allLabels,
      datasets: [
        {
          label: "Proposal Historis",
          data: histPadded,
          borderColor: "#0b6bbd",
          backgroundColor: "rgba(11,107,189,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: "Prediksi Proposal",
          data: forecastPadded,
          borderColor: "#0f9f8b",
          borderDash: [6, 4],
          borderWidth: 2,
          backgroundColor: "rgba(15,159,139,0.05)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#0f9f8b",
        },
      ],
    };
  }, [overview]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 8, padding: 16 },
      },
      filler: {
        propagate: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => (v >= 1_000_000 ? formatCompact(v) : v),
        },
      },
      x: { ticks: { maxRotation: 45 } },
    },
  };

  if (loading) {
    return (
      <div className="forecast-loading">
        <Loader2 size={32} className="forecast-spinner" />
        <p>Memuat data forecast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forecast-error">
        <AlertTriangle size={32} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="forecast-page">
      {/* Header */}
      <header className="forecast-header">
        <div>
          <p className="forecast-eyebrow">CSR AQUA MEKARSARI</p>
          <h1>Forecast Center</h1>
          <p className="forecast-subtitle">
            Prediksi budget, proposal, dan donasi Aqua 12 bulan ke depan.
            {overview?.summary?.methodUsed === "seasonal_decomposition"
              ? " 📊 Menggunakan Seasonal Decomposition (pola musiman terdeteksi)."
              : " 📈 Menggunakan Exponential Smoothing & Linear Regression Blend."}
          </p>
          {overview?.summary?.seasonalityDetected && (
            <div className="forecast-seasonality-badge">
              <span className="forecast-badge-icon">📈</span>
              <span>
                <strong>Seasonal Pattern Detected:</strong>{" "}
                {overview.summary.seasonalityDescription} (Strength:{" "}
                {Math.round(overview.summary.seasonalStrength * 100)}%)
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Summary Cards */}
      <section className="forecast-summary-grid">
        <article className="forecast-summary-card">
          <div className="forecast-summary-icon forecast-summary-icon--blue">
            <Wallet size={20} />
          </div>
          <div>
            <p>Proyeksi Budget 1 Tahun</p>
            <h3>
              {overview
                ? formatCompact(overview.summary.projectedAnnualBudget)
                : "-"}
            </h3>
            <span
              className={`forecast-trend forecast-trend--${overview?.summary?.budgetTrend || "stable"}`}
            >
              {overview?.summary?.budgetTrend === "up" ? (
                <TrendingUp size={14} />
              ) : overview?.summary?.budgetTrend === "down" ? (
                <TrendingDown size={14} />
              ) : (
                <Target size={14} />
              )}
              {overview?.summary?.budgetTrend === "up"
                ? "Tren Naik"
                : overview?.summary?.budgetTrend === "down"
                  ? "Tren Turun"
                  : "Stabil"}
            </span>
          </div>
        </article>

        <article className="forecast-summary-card">
          <div className="forecast-summary-icon forecast-summary-icon--teal">
            <BarChart3 size={20} />
          </div>
          <div>
            <p>Rata-rata Budget/Bulan</p>
            <h3>
              {overview
                ? formatCompact(overview.summary.projectedAvgMonthly)
                : "-"}
            </h3>
            <span className="forecast-trend forecast-trend--neutral">
              <Calendar size={14} />
              per bulan (proyeksi)
            </span>
          </div>
        </article>

        <article className="forecast-summary-card">
          <div className="forecast-summary-icon forecast-summary-icon--confidence">
            <Target size={20} />
          </div>
          <div>
            <p>Tingkat Keyakinan</p>
            <h3>{overview ? `${overview.summary.confidence}%` : "-"}</h3>
            <span className="forecast-trend forecast-trend--up">
              <Sparkles size={14} />
              MAPE: {overview?.summary?.budgetMAPE || 0}%
            </span>
          </div>
        </article>
      </section>

      {/* Method & Seasonality Info Cards */}
      <section className="forecast-method-grid">
        <article className="forecast-method-card">
          <div className="forecast-method-label">
            <BarChart3 size={16} />
            <span>Method</span>
          </div>
          <div className="forecast-method-value">
            {overview?.summary?.methodUsed === "seasonal_decomposition"
              ? "📊 Seasonal Decomposition"
              : "📈 Blended (ES + LR)"}
          </div>
          <div className="forecast-method-desc">
            {overview?.summary?.methodUsed === "seasonal_decomposition"
              ? "Advanced trend & seasonal analysis"
              : "Exponential Smoothing + Linear Regression"}
          </div>
        </article>

        {overview?.summary?.seasonalityDetected && (
          <article className="forecast-method-card forecast-method-card--seasonal">
            <div className="forecast-method-label">
              <TrendingUp size={16} />
              <span>Seasonality</span>
            </div>
            <div className="forecast-method-value">
              {Math.round(overview.summary.seasonalStrength * 100)}% Strength
            </div>
            <div className="forecast-method-desc">
              {overview.summary.seasonalityDescription}
            </div>
          </article>
        )}
      </section>

      {/* Budget Chart */}
      <section className="forecast-chart-section">
        <div className="forecast-chart-header">
          <Wallet size={18} />
          <h2>Prediksi Budget Tahunan</h2>
        </div>
        <p className="forecast-chart-desc">
          Bar biru = 12 bulan historis. Bar hijau = prediksi 12 bulan ke depan.
          Garis putus-putus = batas kepercayaan (±10%).
        </p>
        <div className="forecast-chart-body forecast-chart-body--large">
          {budgetChartData ? (
            <Bar data={budgetChartData} options={chartOptions} />
          ) : (
            <p className="forecast-no-data">Belum ada data budget</p>
          )}
        </div>
      </section>

      {/* Proposal Chart */}
      <section className="forecast-chart-section">
        <div className="forecast-chart-header">
          <FileText size={18} />
          <h2>Prediksi Jumlah Proposal</h2>
        </div>
        <p className="forecast-chart-desc">
          Garis biru = data historis. Garis hijau putus-putus = prediksi.
        </p>
        <div className="forecast-chart-body forecast-chart-body--large">
          {proposalChartData ? (
            <Line data={proposalChartData} options={chartOptions} />
          ) : (
            <p className="forecast-no-data">Belum ada data proposal</p>
          )}
        </div>
      </section>

      {/* Yearly Historical Table */}
      {overview?.yearly?.length > 0 && (
        <section className="forecast-yearly-section">
          <div className="forecast-chart-header">
            <Calendar size={18} />
            <h2>Riwayat Budget Tahunan</h2>
          </div>
          <div className="forecast-table-wrapper">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Tahun</th>
                  <th>Total Budget</th>
                  <th>Jumlah Proposal</th>
                </tr>
              </thead>
              <tbody>
                {overview.yearly.map((y) => (
                  <tr key={y.year}>
                    <td>{y.year}</td>
                    <td>{formatCurrency(y.budget)}</td>
                    <td>{y.proposals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Monthly Forecast Table dengan Confidence Interval */}
      {overview?.forecast?.length > 0 && (
        <section className="forecast-yearly-section">
          <div className="forecast-chart-header">
            <Sparkles size={18} />
            <h2>Detail Prediksi 12 Bulan ke Depan</h2>
          </div>
          <p className="forecast-chart-desc">
            Menampilkan prediksi budget dengan interval kepercayaan dan jumlah
            proposal yang diharapkan.
          </p>
          <div className="forecast-table-wrapper">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Bulan</th>
                  <th>Prediksi Budget</th>
                  <th className="forecast-table-note">Batas Bawah</th>
                  <th className="forecast-table-note">Batas Atas</th>
                  <th>Prediksi Proposal</th>
                  <th className="forecast-table-note">Keyakinan</th>
                </tr>
              </thead>
              <tbody>
                {overview.forecast.map((f) => (
                  <tr key={f.month}>
                    <td className="forecast-table-month">
                      {monthLabel(f.month)} {f.month?.split("-")[0]}
                    </td>
                    <td className="forecast-table-value">
                      {formatCurrency(f.budget)}
                    </td>
                    <td className="forecast-table-note forecast-table-lower">
                      {formatCurrency(f.budgetLower)}
                    </td>
                    <td className="forecast-table-note forecast-table-upper">
                      {formatCurrency(f.budgetUpper)}
                    </td>
                    <td>{f.proposals} proposal</td>
                    <td className="forecast-table-note">{f.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default ForecastCenter;
