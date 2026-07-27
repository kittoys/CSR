import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  BarElement,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  BarChart3,
  CalendarDays,
  Filter,
  LineChart,
  ZoomOut,
  ZoomIn,
} from "lucide-react";
import { getProposalMonthlyStats, getProposalStats } from "../api/proposals";
import { getForecastOverview, getComparisonData } from "../api/forecast";
import PeriodComparisonChart from "../components/PeriodComparisonChart";
import ForecastLineChart from "../components/ForecastLineChart";
import "./chart.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  BarElement,
);

const MONTHS = [
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

const MONTHS_SHORT = MONTHS;

const CHART_PALETTE = {
  bar: "rgba(0, 119, 200, 0.85)",
  line: "rgba(14, 116, 144, 0.95)",
  pie: ["#0ea5e9", "#f59e0b", "#22c55e"],
  doughnut: ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 14,
        boxHeight: 14,
        useBorderRadius: true,
        borderRadius: 4,
      },
    },
  },
};

const ChartDashboard = () => {
  const currentYear = new Date().getFullYear().toString();
  const [activeTab, setActiveTab] = useState("data");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearOptions, setYearOptions] = useState([currentYear]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [summaryStats, setSummaryStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Comparison chart state
  const [comparisonMonth, setComparisonMonth] = useState("05");
  const [comparisonYears, setComparisonYears] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  // Forecast line chart state
  const [forecastMetric, setForecastMetric] = useState("budget");
  const [forecastZoomLevel, setForecastZoomLevel] = useState(2);
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  const FORECAST_ZOOM_LEVELS = {
    1: { label: "Zoom Out", historyMonths: 999 },
    2: { label: "Default", historyMonths: 12 },
    3: { label: "Zoom In", historyMonths: 6 },
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchYearOptions = async () => {
      try {
        const allMonthly = await getProposalMonthlyStats();
        if (isCancelled) return;

        const years = Array.from(
          new Set(
            (Array.isArray(allMonthly) ? allMonthly : [])
              .map((item) => String(item?.month || "").slice(0, 4))
              .filter((year) => /^\d{4}$/.test(year)),
          ),
        ).sort((a, b) => Number(b) - Number(a));

        const nextOptions = years.length ? years : [currentYear];
        setYearOptions(nextOptions);
        setSelectedYear((prevYear) =>
          nextOptions.includes(prevYear) ? prevYear : nextOptions[0],
        );
      } catch (_error) {
        if (isCancelled) return;
        setYearOptions([currentYear]);
      }
    };

    const fetchOverviewForComparison = async () => {
      try {
        const overview = await getForecastOverview(12);
        if (isCancelled) return;
        setOverviewData(overview);

        // Auto-populate comparison years dengan 2 tahun terakhir
        if (overview.yearly && overview.yearly.length > 0) {
          const years = overview.yearly
            .map((y) => y.year)
            .sort((a, b) => b - a)
            .slice(0, 2)
            .map((y) => String(y));
          setComparisonYears(years);
        }
      } catch (_error) {
        if (isCancelled) return;
      }
    };

    fetchYearOptions();
    fetchOverviewForComparison();
    return () => {
      isCancelled = true;
    };
  }, [currentYear]);

  useEffect(() => {
    let isCancelled = false;

    const fetchStats = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const params = { year: selectedYear };
        if (selectedMonth !== "all") {
          params.month = selectedMonth;
        }

        const [summary, monthly] = await Promise.all([
          getProposalStats(params),
          getProposalMonthlyStats(params),
        ]);

        if (isCancelled) return;
        setSummaryStats(summary || null);
        setMonthlyStats(Array.isArray(monthly) ? monthly : []);
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage("Gagal memuat statistik proposal");
        setSummaryStats(null);
        setMonthlyStats([]);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isCancelled = true;
    };
  }, [selectedYear, selectedMonth]);

  // Fetch comparison data when month or years change
  useEffect(() => {
    const fetchComparison = async () => {
      if (comparisonYears.length < 2) {
        setComparisonData(null);
        return;
      }

      try {
        setComparisonLoading(true);
        setComparisonError(null);
        const data = await getComparisonData(comparisonMonth, comparisonYears);
        setComparisonData(data.comparison || []);
      } catch (err) {
        console.error("Comparison fetch error:", err);
        setComparisonError("Gagal memuat data perbandingan");
        setComparisonData(null);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchComparison();
  }, [comparisonMonth, comparisonYears]);

  // Fetch forecast data when zoom level changes
  // useEffect(() => {
  //   let isCancelled = false;

  //   const fetchForecastData = async () => {
  //     try {
  //       setForecastLoading(true);
  //       setForecastError(null);
  //       const historyMonths =
  //         FORECAST_ZOOM_LEVELS[forecastZoomLevel].historyMonths;
  //       const overview = await getForecastOverview(historyMonths);
  //       if (isCancelled) return;

  //       // Transform data: combine monthly + forecast into single array
  //       const transformedData = [];

  //       // Add historical monthly data
  //       if (overview.monthly && Array.isArray(overview.monthly)) {
  //         overview.monthly.forEach((item) => {
  //           transformedData.push({
  //             type: "historical",
  //             month: item.month,
  //             year: item.year,
  //             budget: item.budget || 0,
  //             proposals: item.proposals || 0,
  //           });
  //         });
  //       }

  //       // Add forecast data
  //       if (overview.forecast && Array.isArray(overview.forecast)) {
  //         overview.forecast.forEach((item) => {
  //           transformedData.push({
  //             type: "forecast",
  //             month: item.month,
  //             year: item.year,
  //             budget: item.budget || 0,
  //             proposals: item.proposals || 0,
  //           });
  //         });
  //       }

  //       setForecastData(transformedData);
  //     } catch (err) {
  //       console.error("Forecast data fetch error:", err);
  //       setForecastError("Gagal memuat data forecast");
  //       setForecastData(null);
  //     } finally {
  //       if (!isCancelled) setForecastLoading(false);
  //     }
  //   };

  //   fetchForecastData();
  //   return () => {
  //     isCancelled = true;
  //   };
  // }, [forecastZoomLevel]);

  const parsedSummary = useMemo(() => {
    const total = Number(summaryStats?.total_proposals || 0);
    const inProgress = Number(summaryStats?.in_progress || 0);
    const waiting = Number(summaryStats?.waiting || 0);
    const completed = Number(summaryStats?.completed || 0);
    const totalBudget = Number(summaryStats?.total_budget || 0);

    return { total, inProgress, waiting, completed, totalBudget };
  }, [summaryStats]);

  const monthlySeries = useMemo(() => {
    if (!monthlyStats.length) {
      const label =
        selectedMonth === "all"
          ? `Tahun ${selectedYear}`
          : `${MONTHS[Math.max(0, Number(selectedMonth) - 1)]} ${selectedYear}`;

      return {
        labels: [label],
        proposalCount: [parsedSummary.total],
        budgetTotal: [parsedSummary.totalBudget],
      };
    }

    return {
      labels: monthlyStats.map((item) => item.label),
      proposalCount: monthlyStats.map((item) => Number(item.total || 0)),
      budgetTotal: monthlyStats.map((item) => Number(item.total_budget || 0)),
    };
  }, [
    monthlyStats,
    parsedSummary.total,
    parsedSummary.totalBudget,
    selectedMonth,
    selectedYear,
  ]);

  const barData = {
    labels: monthlySeries.labels,
    datasets: [
      {
        label: "Jumlah Proposal",
        data: monthlySeries.proposalCount,
        backgroundColor: CHART_PALETTE.bar,
        borderRadius: 10,
      },
    ],
  };

  const lineData = {
    labels: monthlySeries.labels,
    datasets: [
      {
        label: "Total Budget Proposal",
        data: monthlySeries.budgetTotal,
        borderColor: CHART_PALETTE.line,
        backgroundColor: "rgba(14, 116, 144, 0.18)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["In Progress", "Siap Diambil", "Done"],
    datasets: [
      {
        label: "Distribusi Status Proposal",
        data: [
          parsedSummary.inProgress,
          parsedSummary.waiting,
          parsedSummary.completed,
        ],
        backgroundColor: CHART_PALETTE.pie,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ["Selesai", "Belum Selesai"],
    datasets: [
      {
        label: "Rasio Penyelesaian Proposal",
        data: [
          parsedSummary.completed,
          Math.max(0, parsedSummary.total - parsedSummary.completed),
        ],
        backgroundColor: CHART_PALETTE.doughnut.slice(0, 2),
        borderColor: "#ffffff",
        borderWidth: 2,
        cutout: "62%",
      },
    ],
  };

  // Compact monthly donut: show months' budget totals as a small donut
  const monthlyDonutData = {
    labels: monthlySeries.labels,
    datasets: [
      {
        label: "Budget Per Bulan",
        data: monthlySeries.budgetTotal,
        backgroundColor: monthlySeries.labels.map(
          (_, i) => CHART_PALETTE.doughnut[i % CHART_PALETTE.doughnut.length],
        ),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const [isMonthDetailOpen, setIsMonthDetailOpen] = useState(false);

  const tabButtons = [
    { key: "data", label: "Data Proposal" },
    { key: "status", label: "Status Proposal" },
    { key: "anggaran", label: "Anggaran Proposal" },
    { key: "perbandingan", label: "Perbandingan Periode" },
    { key: "forecast-line", label: "Perbandingan Forecast" },
  ];

  const activeTabLabel =
    tabButtons.find((tab) => tab.key === activeTab)?.label || "Data Proposal";

  return (
    <div className="chart-page">
      <header className="chart-navbar">
        <div className="chart-navbar__brand">
          <BarChart3 size={20} />
          <span>Dashboard Data Proposal</span>
        </div>
        <nav className="chart-navbar__menu">
          {tabButtons.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`chart-nav-btn ${activeTab === tab.key ? "chart-nav-btn--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="chart-filter card-animate">
        <div className="chart-filter__title">
          <Filter size={18} />
          <h2>Filter Data</h2>
        </div>

        <div className="chart-filter__controls">
          <label className="chart-control">
            <span>Tahun</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="chart-control">
            <span>Bulan</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">Semua Bulan</option>
              {MONTHS.map((month, index) => (
                <option key={month} value={String(index + 1).padStart(2, "0")}>
                  {month}
                </option>
              ))}
            </select>
          </label>

          <div className="chart-filter__badge">
            <CalendarDays size={16} />
            <span>
              {selectedMonth === "all"
                ? `Tahun ${selectedYear}`
                : `${MONTHS[Math.max(0, Number(selectedMonth) - 1)]} ${selectedYear}`}
            </span>
          </div>
        </div>
      </section>

      {(isLoading || errorMessage) && (
        <section
          className="chart-filter card-animate"
          style={{ marginBottom: "1rem" }}
        >
          <div className="chart-filter__title">
            <Filter size={18} />
            <h2>{isLoading ? "Memuat data proposal..." : errorMessage}</h2>
          </div>
        </section>
      )}

      <section key={activeTab} className="chart-grid chart-grid--switch">
        <article
          className="chart-card card-animate"
          style={{ gridColumn: "1 / -1" }}
        >
          <div className="chart-card__header">
            <h3>Menampilkan: {activeTabLabel}</h3>
          </div>
        </article>

        {(activeTab === "data" || activeTab === "anggaran") && (
          <article className="chart-card card-animate">
            <div className="chart-card__header">
              <h3>Bar Chart - Jumlah Proposal per Periode</h3>
            </div>
            <div className="chart-canvas">
              <Bar
                data={barData}
                options={{
                  ...baseOptions,
                  animation: { duration: 1000, easing: "easeOutQuart" },
                }}
              />
            </div>
          </article>
        )}

        {(activeTab === "data" || activeTab === "anggaran") && (
          <article className="chart-card card-animate chart-delay-1">
            <div className="chart-card__header">
              <h3>Line Chart - Tren Budget Proposal</h3>
            </div>
            <div className="chart-canvas">
              <Line
                data={lineData}
                options={{
                  ...baseOptions,
                  animation: { duration: 1100, easing: "easeOutCubic" },
                }}
              />
            </div>
          </article>
        )}

        {/* Compact monthly donut card (click to view details) */}
        {(activeTab === "data" || activeTab === "anggaran") && (
          <article
            className="chart-card card-animate chart-card--compact chart-delay-1"
            onClick={() => setIsMonthDetailOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && setIsMonthDetailOpen(true)
            }
            aria-label="Buka detail tren bulanan"
          >
            <div className="chart-card__header">
              <h3>Tren Bulan (ringkas)</h3>
            </div>
            <div className="chart-canvas chart-canvas--compact">
              <Doughnut
                data={monthlyDonutData}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { position: "bottom" },
                  },
                  animation: { duration: 900 },
                }}
              />
            </div>
          </article>
        )}

        {/* Month detail modal */}
        {isMonthDetailOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsMonthDetailOpen(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detail Tren Bulanan</h2>
                <button
                  className="modal-close"
                  onClick={() => setIsMonthDetailOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div style={{ padding: 20, minWidth: 640 }}>
                <div style={{ height: 360 }}>
                  <Line
                    data={lineData}
                    options={{ ...baseOptions, animation: { duration: 900 } }}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <h4>Rincian per bulan</h4>
                  <ul>
                    {monthlySeries.labels.map((lbl, idx) => (
                      <li key={lbl}>
                        {lbl}:{" "}
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(monthlySeries.budgetTotal[idx] || 0)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "data" || activeTab === "status") && (
          <article className="chart-card card-animate chart-delay-2">
            <div className="chart-card__header">
              <h3>Pie Chart - Distribusi Status Proposal</h3>
            </div>
            <div className="chart-canvas">
              <Pie
                data={pieData}
                options={{
                  ...baseOptions,
                  animation: { duration: 1150, easing: "easeOutExpo" },
                }}
              />
            </div>
          </article>
        )}

        {(activeTab === "data" || activeTab === "status") && (
          <article className="chart-card card-animate chart-delay-3">
            <div className="chart-card__header chart-card__header--icon">
              <LineChart size={18} />
              <h3>Doughnut Chart - Rasio Penyelesaian Proposal</h3>
            </div>
            <div className="chart-canvas">
              <Doughnut
                data={doughnutData}
                options={{
                  ...baseOptions,
                  animation: { duration: 1200, easing: "easeOutQuart" },
                }}
              />
            </div>
          </article>
        )}

        {/* Comparison Period Section */}
        {activeTab === "perbandingan" && (
          <>
            <article
              className="chart-card card-animate"
              style={{ gridColumn: "1 / -1" }}
            >
              <div className="chart-card__header">
                <h3>Perbandingan Budget Antar Periode Tahunan</h3>
              </div>

              {/* Comparison Filters */}
              <div className="comparison-filters" style={{ marginTop: "16px" }}>
                <div className="filter-group">
                  <label htmlFor="comparison-month">Pilih Bulan:</label>
                  <select
                    id="comparison-month"
                    value={comparisonMonth}
                    onChange={(e) => setComparisonMonth(e.target.value)}
                    className="filter-select"
                  >
                    {MONTHS_SHORT.map((month, idx) => (
                      <option
                        key={idx}
                        value={String(idx + 1).padStart(2, "0")}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {overviewData?.yearly && (
                  <div className="filter-group">
                    <label htmlFor="comparison-years">Pilih Tahun:</label>
                    <div className="year-checkboxes">
                      {overviewData.yearly.map((y) => (
                        <label key={y.year} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={y.year}
                            checked={comparisonYears.includes(String(y.year))}
                            onChange={(e) => {
                              const year = String(e.target.value);
                              if (e.target.checked) {
                                setComparisonYears(
                                  [...comparisonYears, year].sort(),
                                );
                              } else {
                                setComparisonYears(
                                  comparisonYears.filter((y) => y !== year),
                                );
                              }
                            }}
                          />
                          {y.year}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Comparison Chart */}
            <article
              className="chart-card card-animate"
              style={{ gridColumn: "1 / -1" }}
            >
              <PeriodComparisonChart
                comparisonData={comparisonData}
                selectedMonth={comparisonMonth}
                metric="budget"
                loading={comparisonLoading}
                error={comparisonError}
              />
            </article>
          </>
        )}

        {/* Forecast Line Chart Section */}
        {activeTab === "forecast-line" && (
          <>
            {/* Controls */}
            <article
              className="chart-card card-animate"
              style={{ gridColumn: "1 / -1" }}
            >
              <div className="chart-card__header">
                <h3>Perbandingan Data Historis vs Forecast</h3>
              </div>

              {/* Metric Toggle and Zoom Controls */}
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  gap: "24px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* Metric Toggle */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setForecastMetric("budget")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      backgroundColor:
                        forecastMetric === "budget" ? "#0b6bbd" : "#ffffff",
                      color:
                        forecastMetric === "budget" ? "#ffffff" : "#1f2937",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: "14px",
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                  >
                    Budget
                  </button>
                  <button
                    onClick={() => setForecastMetric("proposals")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                      backgroundColor:
                        forecastMetric === "proposals" ? "#0b6bbd" : "#ffffff",
                      color:
                        forecastMetric === "proposals" ? "#ffffff" : "#1f2937",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: "14px",
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                  >
                    Jumlah Proposal
                  </button>
                </div>

                {/* Zoom Controls */}
                <div
                  style={{ display: "flex", gap: "8px", marginLeft: "auto" }}
                >
                  {Object.entries(FORECAST_ZOOM_LEVELS).map(
                    ([level, config]) => (
                      <button
                        key={level}
                        onClick={() => setForecastZoomLevel(Number(level))}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border:
                            forecastZoomLevel === Number(level)
                              ? "2px solid #0b6bbd"
                              : "1px solid #e5e7eb",
                          backgroundColor:
                            forecastZoomLevel === Number(level)
                              ? "#f0f9ff"
                              : "#ffffff",
                          color: "#1f2937",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "12px",
                          transition:
                            "border-color 0.2s, background-color 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {Number(level) === 1 && <ZoomOut size={16} />}
                        {Number(level) === 3 && <ZoomIn size={16} />}
                        {config.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </article>

            {/* Chart */}
            <article
              className="chart-card card-animate"
              style={{ gridColumn: "1 / -1" }}
            >
              <ForecastLineChart
                data={forecastData}
                metric={forecastMetric}
                loading={forecastLoading}
                error={forecastError}
              />
            </article>
          </>
        )}
      </section>
    </div>
  );
};

export default ChartDashboard;
