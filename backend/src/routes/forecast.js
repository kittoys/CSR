const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ============================================================
// SIMPLE EXPONENTIAL SMOOTHING + LINEAR REGRESSION UTILS
// ============================================================

/**
 * Simple Exponential Smoothing forecast
 * @param {number[]} actuals - historical values (oldest first)
 * @param {number} periods - how many periods to forecast
 * @param {number} alpha - smoothing factor (0-1), default 0.3
 * @returns {{ forecast: number[], mape: number, trend: string }}
 */
function exponentialSmoothing(actuals, periods = 12, alpha = 0.3) {
  if (actuals.length < 2) {
    // Not enough data, return simple average projection
    const avg = actuals.length ? actuals[0] : 0;
    return {
      forecast: Array(periods).fill(avg),
      mape: 0,
      trend: "stable",
    };
  }

  // Build smoothed series
  const smoothed = [actuals[0]];
  for (let i = 1; i < actuals.length; i++) {
    smoothed.push(alpha * actuals[i] + (1 - alpha) * smoothed[i - 1]);
  }

  // Calculate MAPE to measure model accuracy
  let totalAPE = 0;
  let count = 0;
  for (let i = 1; i < actuals.length; i++) {
    if (actuals[i] !== 0) {
      totalAPE += Math.abs((actuals[i] - smoothed[i - 1]) / actuals[i]);
      count++;
    }
  }
  const mape = count > 0 ? (totalAPE / count) * 100 : 0;

  // Determine trend from last few values
  const recent = actuals.slice(-3);
  const trend =
    recent.length >= 2
      ? recent[recent.length - 1] > recent[0]
        ? "up"
        : recent[recent.length - 1] < recent[0]
          ? "down"
          : "stable"
      : "stable";

  // Forecast: last smoothed value projected forward
  const lastSmoothed = smoothed[smoothed.length - 1];
  const forecast = Array(periods).fill(lastSmoothed);

  // Apply trend correction based on slope of last 3 actuals
  if (actuals.length >= 3) {
    const slope =
      (actuals[actuals.length - 1] - actuals[0]) / (actuals.length - 1);
    for (let i = 0; i < periods; i++) {
      forecast[i] = Math.max(0, lastSmoothed + slope * (i + 1));
    }
  }

  return { forecast, mape: Math.round(mape * 10) / 10, trend };
}

/**
 * Linear regression forecast
 * @param {number[]} yValues - dependent values
 * @param {number} periods - how many periods to forecast
 * @returns {{ forecast: number[], slope: number, intercept: number, r2: number }}
 */
function linearRegression(yValues, periods = 12) {
  const n = yValues.length;
  if (n < 2) {
    const val = yValues[0] || 0;
    return {
      forecast: Array(periods).fill(val),
      slope: 0,
      intercept: val,
      r2: 0,
    };
  }

  const xValues = Array.from({ length: n }, (_, i) => i + 1);
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((a, x, i) => a + x * yValues[i], 0);
  const sumX2 = xValues.reduce((a, x) => a + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const yMean = sumY / n;
  const ssRes = yValues.reduce(
    (a, y, i) => a + Math.pow(y - (slope * xValues[i] + intercept), 2),
    0,
  );
  const ssTot = yValues.reduce((a, y) => a + Math.pow(y - yMean, 2), 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  const forecast = [];
  for (let i = 0; i < periods; i++) {
    forecast.push(Math.max(0, slope * (n + i + 1) + intercept));
  }

  return { forecast, slope, intercept, r2: Math.round(r2 * 1000) / 1000 };
}

// ============================================================
// ENDPOINTS
// ============================================================

/**
 * GET /api/forecast/budget
 * Returns historical budget by month + 12-month forecast
 */
router.get("/budget", async (req, res) => {
  try {
    // Get monthly budget totals from donation_proposals
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m') AS month,
        SUM(budget) AS total_budget
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);

    // Also get yearly totals for reference
    const [yearlyRows] = await pool.query(`
      SELECT 
        YEAR(COALESCE(proposal_date, created_at)) AS year,
        SUM(budget) AS total_budget
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY year
      ORDER BY year ASC
    `);

    // Build monthly data map
    const monthlyData = {};
    rows.forEach((row) => {
      monthlyData[row.month] = parseFloat(row.total_budget) || 0;
    });

    // Get all months from earliest to latest
    const months = Object.keys(monthlyData).sort();
    if (months.length === 0) {
      return res.json({
        historical: [],
        forecast: [],
        yearly: [],
        summary: { totalHistorical: 0, projectedAnnual: 0, growthRate: 0 },
      });
    }

    const historicalBudgets = months.map((m) => monthlyData[m]);

    // Forecast using SES
    const sesResult = exponentialSmoothing(historicalBudgets, 12, 0.35);
    const lrResult = linearRegression(historicalBudgets, 12);

    // Blend SES and Linear Regression (60% SES, 40% LR for stability)
    const blendedForecast = sesResult.forecast.map(
      (v, i) => v * 0.6 + lrResult.forecast[i] * 0.4,
    );

    const totalHistorical = historicalBudgets.reduce((a, b) => a + b, 0);
    const projectedAnnual = blendedForecast.reduce((a, b) => a + b, 0);

    // Calculate growth rate from yearly data
    const yearlyBudgets = yearlyRows.map((r) => ({
      year: r.year,
      budget: parseFloat(r.total_budget) || 0,
    }));
    const growthRate =
      yearlyBudgets.length >= 2
        ? ((yearlyBudgets[yearlyBudgets.length - 1].budget -
            yearlyBudgets[0].budget) /
            yearlyBudgets[0].budget) *
          100
        : 0;

    res.json({
      historical: months.map((m, i) => ({
        month: m,
        budget: historicalBudgets[i],
      })),
      forecast: blendedForecast.map((v, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i + 1);
        const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return { month: fm, budget: Math.round(v) };
      }),
      yearly: yearlyBudgets,
      summary: {
        totalHistorical: Math.round(totalHistorical),
        projectedAnnual: Math.round(projectedAnnual),
        growthRate: Math.round(growthRate * 10) / 10,
        mape: sesResult.mape,
        trend: sesResult.trend,
        confidence: Math.max(0, Math.min(100, 100 - sesResult.mape)),
      },
    });
  } catch (err) {
    console.error("Forecast budget error:", err);
    res.status(500).json({ message: "Error generating budget forecast" });
  }
});

/**
 * GET /api/forecast/proposals
 * Returns historical proposal count by month + 12-month forecast
 */
router.get("/proposals", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m') AS month,
        COUNT(*) AS total_proposals,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'Siap Diambil' THEN 1 ELSE 0 END) AS waiting,
        SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) AS completed
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);

    if (rows.length === 0) {
      return res.json({
        historical: [],
        forecast: [],
        summary: { totalProposals: 0, projectedMonthly: 0, trend: "stable" },
      });
    }

    const months = rows.map((r) => r.month);
    const counts = rows.map((r) => parseInt(r.total_proposals));

    const sesResult = exponentialSmoothing(counts, 12, 0.3);

    const forecast = sesResult.forecast.map((v, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i + 1);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return { month: fm, count: Math.round(v) };
    });

    const totalProposals = counts.reduce((a, b) => a + b, 0);
    const avgMonthly =
      counts.length > 0 ? Math.round(totalProposals / counts.length) : 0;

    res.json({
      historical: rows.map((r) => ({
        month: r.month,
        count: parseInt(r.total_proposals),
        breakdown: {
          in_progress: parseInt(r.in_progress) || 0,
          waiting: parseInt(r.waiting) || 0,
          completed: parseInt(r.completed) || 0,
        },
      })),
      forecast,
      summary: {
        totalProposals,
        projectedMonthly: Math.round(
          forecast.reduce((a, b) => a + b.count, 0) / 12,
        ),
        avgMonthly,
        mape: sesResult.mape,
        trend: sesResult.trend,
        confidence: Math.max(0, Math.min(100, 100 - sesResult.mape)),
      },
    });
  } catch (err) {
    console.error("Forecast proposals error:", err);
    res.status(500).json({ message: "Error generating proposals forecast" });
  }
});

/**
 * GET /api/forecast/donations
 * Forecast donasi Aqua (dummy data for now - integrates with FocBulanan)
 */
router.get("/donations", async (req, res) => {
  try {
    // Build dummy historical donation data (would come from foc_bulanan table in future)
    const historical = [
      { month: "2025-06", dus: 165, botol: 1480 },
      { month: "2025-05", dus: 208, botol: 700 },
      { month: "2025-04", dus: 30, botol: 0 },
      { month: "2025-03", dus: 18, botol: 280 },
      { month: "2025-02", dus: 0, botol: 0 },
      { month: "2025-01", dus: 0, botol: 0 },
      { month: "2024-11", dus: 18, botol: 0 },
    ];

    const dusActuals = historical.map((h) => h.dus);
    const botolActuals = historical.map((h) => h.botol);

    const dusSES = exponentialSmoothing(dusActuals, 12, 0.3);
    const botolSES = exponentialSmoothing(botolActuals, 12, 0.3);

    const forecast = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i + 1);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return {
        month: fm,
        dus: Math.round(dusSES.forecast[i]),
        botol: Math.round(botolSES.forecast[i]),
      };
    });

    res.json({
      historical,
      forecast,
      summary: {
        totalDusHistorical: dusActuals.reduce((a, b) => a + b, 0),
        totalBotolHistorical: botolActuals.reduce((a, b) => a + b, 0),
        projectedDus: Math.round(forecast.reduce((a, b) => a + b.dus, 0)),
        projectedBotol: Math.round(forecast.reduce((a, b) => a + b.botol, 0)),
        confidence: Math.max(0, Math.min(100, 100 - dusSES.mape)),
      },
    });
  } catch (err) {
    console.error("Forecast donations error:", err);
    res.status(500).json({ message: "Error generating donations forecast" });
  }
});

/**
 * GET /api/forecast/overview
 * Combined overview for the Forecast Center dashboard
 */
router.get("/overview", async (req, res) => {
  try {
    // Get all data in parallel by calling our own endpoints... or query directly
    const [budgetRows] = await pool.query(`
      SELECT 
        YEAR(COALESCE(proposal_date, created_at)) AS year,
        SUM(budget) AS total_budget,
        COUNT(*) AS total_proposals
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY year
      ORDER BY year ASC
    `);

    const [monthlyRows] = await pool.query(`
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m') AS month,
        SUM(budget) AS total_budget,
        COUNT(*) AS total_proposals
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);

    // Budget forecast
    const budgets = monthlyRows.map((r) => parseFloat(r.total_budget) || 0);
    const sesResult = exponentialSmoothing(budgets, 12, 0.35);
    const lrResult = linearRegression(budgets, 12);
    const blendedForecast = sesResult.forecast.map(
      (v, i) => v * 0.6 + lrResult.forecast[i] * 0.4,
    );

    // Proposal count forecast
    const counts = monthlyRows.map((r) => parseInt(r.total_proposals));
    const countSES = exponentialSmoothing(counts, 12, 0.3);

    const projectedAnnual = blendedForecast.reduce((a, b) => a + b, 0);

    const forecastMonths = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i + 1);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return {
        month: fm,
        budget: Math.round(blendedForecast[i]),
        proposals: Math.round(countSES.forecast[i]),
      };
    });

    res.json({
      yearly: budgetRows.map((r) => ({
        year: r.year,
        budget: parseFloat(r.total_budget) || 0,
        proposals: parseInt(r.total_proposals) || 0,
      })),
      monthly: monthlyRows.map((r) => ({
        month: r.month,
        budget: parseFloat(r.total_budget) || 0,
        proposals: parseInt(r.total_proposals) || 0,
      })),
      forecast: forecastMonths,
      summary: {
        projectedAnnualBudget: Math.round(projectedAnnual),
        projectedAvgMonthly: Math.round(projectedAnnual / 12),
        budgetMAPE: sesResult.mape,
        budgetTrend: sesResult.trend,
        proposalTrend: countSES.trend,
        confidence: Math.max(0, Math.min(100, 100 - sesResult.mape)),
      },
    });
  } catch (err) {
    console.error("Forecast overview error:", err);
    res.status(500).json({ message: "Error generating forecast overview" });
  }
});

module.exports = router;
