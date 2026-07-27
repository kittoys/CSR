import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  FileText,
  BarChart3,
  Target,
  Sparkles,
  Loader2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
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
  const [zoomLevel, setZoomLevel] = useState(2); // 1=full, 2=12+12 months, 3=6+12 months (closer)
  const [scrollOffset, setScrollOffset] = useState(0);

  const ZOOM_LEVELS = useMemo(
    () => ({
      1: { label: "Zoom Out", historyMonths: 999, forecastMonths: 12 },
      2: { label: "Default", historyMonths: 12, forecastMonths: 12 },
      3: { label: "Zoom In", historyMonths: 6, forecastMonths: 12 },
    }),
    [],
  );

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const historyMonths = ZOOM_LEVELS[zoomLevel].historyMonths;
        const overviewData = await getForecastOverview(historyMonths);
        setOverview(overviewData);
        setScrollOffset(0); // Reset scroll when zoom changes
      } catch (err) {
        console.error("Forecast fetch error:", err);
        setError("Gagal memuat data forecast. Pastikan server berjalan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [zoomLevel, ZOOM_LEVELS]);

  // ---- Budget Chart Data ----
  const budgetChartData = useMemo(() => {
    if (!overview) return null;

    let monthData = overview.monthly;

    // Apply scroll offset if zoomed in
    if (zoomLevel >= 2 && scrollOffset > 0) {
      const maxOffset = Math.max(
        0,
        monthData.length - ZOOM_LEVELS[zoomLevel].historyMonths,
      );
      const actualOffset = Math.min(scrollOffset, maxOffset);
      monthData = monthData.slice(actualOffset);
    }

    // Build unified timeline by merging historical, historical forecast (backtest),
    // and future forecast — but limit forecasts to the currently displayed window.
    const displayedMonths = monthData.map((m) => m.month);
    const lastDisplayedMonthStr =
      displayedMonths[displayedMonths.length - 1] ||
      overview.monthly[overview.monthly.length - 1]?.month;
    const forecastMonthsCount = ZOOM_LEVELS[zoomLevel].forecastMonths || 12;

    // compute allowed future months starting from the month after lastDisplayedMonthStr
    const allowedFutureMonths = [];
    if (lastDisplayedMonthStr) {
      const [ly, lm] = lastDisplayedMonthStr.split("-");
      const base = new Date(`${ly}-${lm}-01`);
      for (let i = 1; i <= forecastMonthsCount; i++) {
        const d = new Date(base);
        d.setMonth(d.getMonth() + i);
        allowedFutureMonths.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        );
      }
    }

    const forecastComparisonFiltered = overview.forecastComparison?.filter(
      (f) => displayedMonths.includes(f.month),
    );
    const forecastFutureFiltered = overview.forecast?.filter((f) =>
      allowedFutureMonths.includes(f.month),
    );

    const allKeysSet = new Set();
    displayedMonths.forEach((m) => allKeysSet.add(m));
    forecastComparisonFiltered?.forEach((f) => allKeysSet.add(f.month));
    forecastFutureFiltered?.forEach((f) => allKeysSet.add(f.month));
    const allKeys = Array.from(allKeysSet).sort();

    const labels = allKeys.map((k) => monthLabel(k));

    // Map values to unified timeline
    const actualMap = new Map();
    const forecastHistoricalMap = new Map();
    const forecastFutureMap = new Map();

    monthData.forEach((m) => actualMap.set(m.month, m.budget));
    forecastComparisonFiltered?.forEach((f) =>
      forecastHistoricalMap.set(f.month, f.forecast_budget),
    );
    forecastFutureFiltered?.forEach((f) =>
      forecastFutureMap.set(f.month, f.budget),
    );

    const actualBudgets = allKeys.map((k) => actualMap.get(k) || null);
    const forecastHistBudgets = allKeys.map(
      (k) => forecastHistoricalMap.get(k) || null,
    );
    const forecastFutureBudgets = allKeys.map(
      (k) => forecastFutureMap.get(k) || null,
    );

    // Merge forecast: use historical forecast for historical months, future forecast for future
    const mergedForecasts = allKeys.map((k, idx) => {
      if (forecastHistBudgets[idx] !== null) return forecastHistBudgets[idx];
      if (forecastFutureBudgets[idx] !== null)
        return forecastFutureBudgets[idx];
      return null;
    });

    return {
      labels,
      datasets: [
        {
          label: "Budget Historis",
          data: actualBudgets,
          backgroundColor: "rgba(11, 107, 189, 0.7)",
          borderColor: "#0b6bbd",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "Prediksi Budget",
          data: mergedForecasts,
          backgroundColor: "rgba(15, 159, 139, 0.6)",
          borderColor: "#0f9f8b",
          borderWidth: 2,
          borderDash: [6, 4],
          borderRadius: 6,
        },
      ],
    };
  }, [overview, zoomLevel, scrollOffset, ZOOM_LEVELS]);

  // ---- Proposal Chart Data ----
  const proposalChartData = useMemo(() => {
    if (!overview) return null;

    let monthData = overview.monthly;

    // Apply scroll offset if zoomed in
    if (zoomLevel >= 2 && scrollOffset > 0) {
      const maxOffset = Math.max(
        0,
        monthData.length - ZOOM_LEVELS[zoomLevel].historyMonths,
      );
      const actualOffset = Math.min(scrollOffset, maxOffset);
      monthData = monthData.slice(actualOffset);
    }

    // Build unified timeline by merging historical, historical forecast (backtest),
    // and future forecast — but limit forecasts to the currently displayed window.
    const displayedMonths = monthData.map((m) => m.month);
    const lastDisplayedMonthStr =
      displayedMonths[displayedMonths.length - 1] ||
      overview.monthly[overview.monthly.length - 1]?.month;
    const forecastMonthsCount = ZOOM_LEVELS[zoomLevel].forecastMonths || 12;

    // compute allowed future months starting from the month after lastDisplayedMonthStr
    const allowedFutureMonths = [];
    if (lastDisplayedMonthStr) {
      const [ly, lm] = lastDisplayedMonthStr.split("-");
      const base = new Date(`${ly}-${lm}-01`);
      for (let i = 1; i <= forecastMonthsCount; i++) {
        const d = new Date(base);
        d.setMonth(d.getMonth() + i);
        allowedFutureMonths.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        );
      }
    }

    const forecastComparisonFiltered = overview.forecastComparison?.filter(
      (f) => displayedMonths.includes(f.month),
    );
    const forecastFutureFiltered = overview.forecast?.filter((f) =>
      allowedFutureMonths.includes(f.month),
    );

    const allKeysSet = new Set();
    displayedMonths.forEach((m) => allKeysSet.add(m));
    forecastComparisonFiltered?.forEach((f) => allKeysSet.add(f.month));
    forecastFutureFiltered?.forEach((f) => allKeysSet.add(f.month));
    const allKeys = Array.from(allKeysSet).sort();

    const labels = allKeys.map((k) => monthLabel(k));

    // Map values to unified timeline
    const actualMap = new Map();
    const forecastHistoricalMap = new Map();
    const forecastFutureMap = new Map();

    monthData.forEach((m) => actualMap.set(m.month, m.proposals));
    forecastComparisonFiltered?.forEach((f) =>
      forecastHistoricalMap.set(f.month, f.forecast_proposals),
    );
    forecastFutureFiltered?.forEach((f) =>
      forecastFutureMap.set(f.month, f.proposals),
    );

    const actualProposals = allKeys.map((k) => actualMap.get(k) || null);
    const forecastHistProposals = allKeys.map(
      (k) => forecastHistoricalMap.get(k) || null,
    );
    const forecastFutureProposals = allKeys.map(
      (k) => forecastFutureMap.get(k) || null,
    );

    // Merge forecast: use historical forecast for historical months, future forecast for future
    const mergedForecasts = allKeys.map((k, idx) => {
      if (forecastHistProposals[idx] !== null)
        return forecastHistProposals[idx];
      if (forecastFutureProposals[idx] !== null)
        return forecastFutureProposals[idx];
      return null;
    });

    return {
      labels,
      datasets: [
        {
          label: "Proposal Historis",
          data: actualProposals,
          borderColor: "#0b6bbd",
          backgroundColor: "rgba(11,107,189,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: "Prediksi Proposal",
          data: mergedForecasts,
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
  }, [overview, zoomLevel, scrollOffset, ZOOM_LEVELS]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 8, padding: 16 },
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
            Prediksi budget, proposal, dan donasi Aqua 12 bulan ke depan
            menggunakan Exponential Smoothing & Linear Regression.
          </p>
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
            <h3>
              {overview ? `${overview.summary.confidence.toFixed(1)}%` : "-"}
            </h3>
            <span className="forecast-trend forecast-trend--up">
              <Sparkles size={14} />
              MAPE: {overview?.summary?.budgetMAPE?.toFixed(1) || 0}%
            </span>
          </div>
        </article>
      </section>

      {/* Timeline Zoom Controls */}
      <section className="forecast-timeline-controls">
        <div className="zoom-controls">
          <button
            className={`zoom-btn ${zoomLevel === 1 ? "active" : ""}`}
            onClick={() => setZoomLevel(1)}
            title="Tampilkan semua historis"
          >
            <ZoomOut size={18} />
            Zoom Out
          </button>
          <button
            className={`zoom-btn ${zoomLevel === 2 ? "active" : ""}`}
            onClick={() => setZoomLevel(2)}
            title="12 bulan historis + 12 bulan prediksi"
          >
            <ZoomOut size={18} />
            Default (12+12)
          </button>
          <button
            className={`zoom-btn ${zoomLevel === 3 ? "active" : ""}`}
            onClick={() => setZoomLevel(3)}
            title="Zoom in untuk detail"
          >
            <ZoomIn size={18} />
            Zoom In (6+12)
          </button>
        </div>

        {/* Scroll Navigation untuk Zoom Level >= 2 */}
        {zoomLevel >= 2 && overview?.monthly && (
          <div className="scroll-controls">
            <button
              className="scroll-btn"
              onClick={() => setScrollOffset(Math.max(0, scrollOffset - 1))}
              disabled={scrollOffset === 0}
              title="Geser ke belakang"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="scroll-info">
              {overview.monthly.length > 0 &&
                `${scrollOffset + 1} - ${Math.min(
                  scrollOffset + ZOOM_LEVELS[zoomLevel].historyMonths,
                  overview.monthly.length,
                )} dari ${overview.monthly.length} bulan`}
            </div>
            <button
              className="scroll-btn"
              onClick={() =>
                setScrollOffset(
                  Math.min(
                    scrollOffset + 1,
                    Math.max(
                      0,
                      overview.monthly.length -
                        ZOOM_LEVELS[zoomLevel].historyMonths,
                    ),
                  ),
                )
              }
              disabled={
                scrollOffset >=
                Math.max(
                  0,
                  overview.monthly.length -
                    ZOOM_LEVELS[zoomLevel].historyMonths,
                )
              }
              title="Geser ke depan"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>

      {/* Budget Chart */}
      <section className="forecast-chart-section">
        <div className="forecast-chart-header">
          <Wallet size={18} />
          <h2>Prediksi Budget Tahunan</h2>
        </div>
        <p className="forecast-chart-desc">
          Bar biru = data historis. Bar hijau striped = prediksi 12 bulan ke
          depan.
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

      {/* Monthly Forecast Table */}
      {overview?.forecast?.length > 0 && (
        <section className="forecast-yearly-section">
          <div className="forecast-chart-header">
            <Sparkles size={18} />
            <h2>Detail Prediksi 12 Bulan ke Depan</h2>
          </div>
          <div className="forecast-table-wrapper">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Bulan</th>
                  <th>Prediksi Budget</th>
                  <th>Prediksi Proposal</th>
                </tr>
              </thead>
              <tbody>
                {overview.forecast.map((f) => (
                  <tr key={f.month}>
                    <td>
                      {monthLabel(f.month)} {f.month?.split("-")[0]}
                    </td>
                    <td>{formatCurrency(f.budget)}</td>
                    <td>{f.proposals}</td>
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
