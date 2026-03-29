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
import { BarChart3, CalendarDays, Filter, LineChart } from "lucide-react";
import { getProposalMonthlyStats, getProposalStats } from "../api/proposals";
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

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

    fetchYearOptions();
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
  }, [monthlyStats, parsedSummary.total, parsedSummary.totalBudget, selectedMonth, selectedYear]);

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

  const tabButtons = [
    { key: "data", label: "Data Proposal" },
    { key: "status", label: "Status Proposal" },
    { key: "anggaran", label: "Anggaran Proposal" },
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
        <section className="chart-filter card-animate" style={{ marginBottom: "1rem" }}>
          <div className="chart-filter__title">
            <Filter size={18} />
            <h2>{isLoading ? "Memuat data proposal..." : errorMessage}</h2>
          </div>
        </section>
      )}

      <section key={activeTab} className="chart-grid chart-grid--switch">
        <article className="chart-card card-animate" style={{ gridColumn: "1 / -1" }}>
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
      </section>
    </div>
  );
};

export default ChartDashboard;
