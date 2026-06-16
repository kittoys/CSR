import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Loader2, AlertTriangle } from "lucide-react";

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

const ForecastLineChart = ({ data, metric = "budget", loading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    // Separate historical data and forecast data
    const historical = data.filter((item) => item.type === "historical");
    const forecast = data.filter((item) => item.type === "forecast");

    // Create labels for x-axis (month-year)
    const labels = data.map((item) => {
      const monthIdx = parseInt(item.month, 10) - 1;
      return `${MONTHS_SHORT[monthIdx]} ${item.year}`;
    });

    // Extract metric values for both lines
    const metricKey = metric === "budget" ? "budget" : "proposals";
    const historicalValues = data.map((item) =>
      item.type === "historical" ? item[metricKey] : null,
    );
    const forecastValues = data.map((item) =>
      item.type === "forecast" ? item[metricKey] : null,
    );

    const isBudget = metric === "budget";

    return {
      labels,
      datasets: [
        {
          label: "Data Historis",
          data: historicalValues,
          borderColor: "#0b6bbd",
          backgroundColor: "rgba(11, 107, 189, 0.05)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#0b6bbd",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          spanGaps: true,
        },
        {
          label: "Prediksi",
          data: forecastValues,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          borderWidth: 2.5,
          borderDash: [5, 5], // Dashed line for forecast
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          spanGaps: true,
        },
      ],
    };
  }, [data, metric]);

  const chartOptions = useMemo(() => {
    const isBudget = metric === "budget";

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 14,
            boxHeight: 14,
            useBorderRadius: true,
            borderRadius: 4,
            font: {
              size: 12,
              weight: 500,
            },
            padding: 15,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 13,
            weight: "bold",
          },
          bodyFont: {
            size: 12,
          },
          cornerRadius: 6,
          displayColors: true,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                if (isBudget) {
                  label += formatCurrency(context.parsed.y);
                } else {
                  label += formatCompact(context.parsed.y) + " proposal";
                }
              }
              return label;
            },
            afterLabel: function (context) {
              // Show comparison on hover
              const dataIndex = context.dataIndex;
              const historicalValue =
                context.chart.data.datasets[0].data[dataIndex];
              const forecastValue =
                context.chart.data.datasets[1].data[dataIndex];

              if (historicalValue !== null && forecastValue !== null) {
                const diff = forecastValue - historicalValue;
                const diffPercent = ((diff / historicalValue) * 100).toFixed(1);
                const diffFormatted = isBudget
                  ? formatCompact(diff)
                  : diff.toFixed(0);
                const arrow = diff > 0 ? "↑" : "↓";
                return `${arrow} ${diffFormatted} (${diffPercent}%)`;
              }
              return "";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              if (isBudget) {
                return formatCompact(value);
              }
              return value;
            },
            font: {
              size: 11,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawTicks: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawTicks: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };
  }, [metric]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Loader2
          style={{
            animation: "spin 1s linear infinite",
            width: 40,
            height: 40,
            color: "#0b6bbd",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          gap: "12px",
          color: "#dc2626",
        }}
      >
        <AlertTriangle size={32} />
        <p style={{ fontSize: "14px" }}>{error}</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          color: "#6b7280",
        }}
      >
        <p>Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ForecastLineChart;
