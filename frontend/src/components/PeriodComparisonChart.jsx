import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

const COLORS = {
  year1: "#0b6bbd", // Primary Blue
  year2: "#0f9f8b", // Secondary Teal
  year3: "#8b5cf6", // Purple
  year4: "#f59e0b", // Amber
};


const formatCompact = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}rb`;
  return value.toFixed(0);
};

/**
 * PeriodComparisonChart - Grouped bar chart untuk membandingkan budget/proposal
 * antar tahun untuk bulan yang sama
 *
 * Props:
 *   - comparisonData: Array of { year, month, budget, proposals }
 *   - selectedMonth: String 'MM' (e.g., '05')
 *   - metric: 'budget' | 'proposals' (mana yang ditampilkan, default: 'budget')
 *   - loading: Boolean
 *   - error: String | null
 */
const PeriodComparisonChart = ({
  comparisonData = [],
  selectedMonth = "05",
  metric = "budget",
  loading = false,
  error = null,
}) => {
  const chartData = useMemo(() => {
    if (!comparisonData || comparisonData.length === 0) {
      return null;
    }

    // Group data by year
    const groupedByYear = {};
    comparisonData.forEach((item) => {
      if (!groupedByYear[item.year]) {
        groupedByYear[item.year] = item;
      }
    });

    const years = Object.keys(groupedByYear)
      .map((y) => parseInt(y, 10))
      .sort((a, b) => a - b);

    if (years.length === 0) {
      return null;
    }

    // Get month name
    const monthIdx = parseInt(selectedMonth, 10) - 1;
    const monthName = MONTHS_SHORT[monthIdx] || selectedMonth;

    // Prepare datasets - one bar per year
    const datasets = years.map((year, idx) => {
      const colorKey = `year${idx + 1}`;
      const color = COLORS[colorKey] || COLORS.year1;
      const data = groupedByYear[year];
      const metricValue = metric === "budget" ? data.budget : data.proposals;

      return {
        label: `${year}`,
        data: [metricValue],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
      };
    });

    return {
      labels: [monthName],
      datasets,
    };
  }, [comparisonData, selectedMonth, metric]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 16,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              if (metric === "budget") {
                return `${context.dataset.label}: ${formatCompact(value)}`;
              }
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => (metric === "budget" ? formatCompact(v) : v),
          },
          title: {
            display: true,
            text: metric === "budget" ? "Budget (Rp)" : "Jumlah Proposal",
          },
        },
        x: {
          title: {
            display: true,
            text: "Periode",
          },
        },
      },
    }),
    [metric],
  );

  // Calculate comparison stats
  const stats = useMemo(() => {
    if (!comparisonData || comparisonData.length < 2) {
      return null;
    }

    const sorted = [...comparisonData].sort((a, b) => a.year - b.year);
    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    if (!latest || !previous) return null;

    const latestValue = metric === "budget" ? latest.budget : latest.proposals;
    const prevValue =
      metric === "budget" ? previous.budget : previous.proposals;

    const change = latestValue - prevValue;
    const changePercent = prevValue > 0 ? (change / prevValue) * 100 : 0;
    const isIncrease = change > 0;

    return {
      latest: {
        year: latest.year,
        value: latestValue,
      },
      previous: {
        year: previous.year,
        value: prevValue,
      },
      change,
      changePercent: Math.abs(changePercent).toFixed(1),
      isIncrease,
    };
  }, [comparisonData, metric]);

  if (loading) {
    return (
      <div className="comparison-chart-loading">
        <div className="spinner" />
        <p>Memuat data perbandingan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-chart-error">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <div className="comparison-chart-empty">
        <AlertCircle size={24} />
        <p>Tidak ada data perbandingan untuk periode ini</p>
      </div>
    );
  }

  return (
    <div className="period-comparison-chart">
      <div className="comparison-chart-body">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Comparison Stats */}
      {stats && (
        <div className="comparison-stats">
          <div className="stat-item">
            <span className="stat-label">
              {stats.latest.year} vs {stats.previous.year}
            </span>
            <div className="stat-change">
              {stats.isIncrease ? (
                <TrendingUp size={16} className="stat-icon stat-icon--up" />
              ) : (
                <TrendingDown size={16} className="stat-icon stat-icon--down" />
              )}
              <span
                className={`stat-value ${
                  stats.isIncrease ? "stat-value--up" : "stat-value--down"
                }`}
              >
                {stats.isIncrease ? "+" : "-"}
                {stats.changePercent}%
              </span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              {metric === "budget" ? "Selisih Budget" : "Selisih Proposal"}
            </span>
            <span
              className={`stat-value ${
                stats.isIncrease ? "stat-value--up" : "stat-value--down"
              }`}
            >
              {stats.isIncrease ? "+" : "-"}
              {metric === "budget"
                ? formatCompact(Math.abs(stats.change))
                : Math.abs(stats.change)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodComparisonChart;
