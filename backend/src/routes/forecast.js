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

  // Apply trend correction dengan damping agar prediksi tidak liar naik terus
  if (actuals.length >= 3) {
    // Slope hanya dari 6 bulan terakhir, bukan seluruh historis
    const recent = actuals.slice(-12);
    const recentSlope =
      (recent[recent.length - 1] - recent[0]) / (recent.length - 1);
    for (let i = 0; i < periods; i++)
      forecast[i] += recentSlope * (i + 1) * Math.pow(0.88, i); // bobot tren turun 12%/bulan
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

  // Forecast dengan damping: tren LR melandai mendekati rata-rata historis
  const yMean2 = sumY / n;
  const forecast = [];
  for (let i = 0; i < periods; i++) {
    const lrRaw = slope * (n + i + 1) + intercept;
    // Blend antara LR murni dan rata-rata historis, makin jauh makin mendekati rata-rata
    const weight = Math.pow(0.88, i); // bobot LR turun 12%/bulan
    const dampedForecast = lrRaw * weight + yMean2 * (1 - weight);
    forecast.push(Math.max(0, dampedForecast));
  }

  return { forecast, slope, intercept, r2: Math.round(r2 * 1000) / 1000 };
}

// ============================================================
// SEASONAL FORECAST: RLS tahunan + Seasonal Index bulanan
// Menghasilkan prediksi yang naik-turun mengikuti pola musiman
// ============================================================

/**
 * Seasonal Forecast berbasis RLS tahunan + Seasonal Index
 * @param {number[]} monthlyActuals - nilai bulanan urut (min 24 bulan / 2 tahun)
 * @param {number} periodsAhead - berapa bulan ke depan (default 12)
 * @param {number} lastMonth - bulan terakhir data 0-based (0=Jan ... 11=Des)
 */
function seasonalForecast(monthlyActuals, periodsAhead = 12, lastMonth = 11) {
  const n = monthlyActuals.length;
  const yearsCount = Math.floor(n / 12);

  // Jika data < 2 tahun, gunakan Exponential Smoothing + Linear Regression blend
  if (yearsCount < 2) {
    const sesResult = exponentialSmoothing(monthlyActuals, periodsAhead, 0.3);
    const lrResult = linearRegression(monthlyActuals, periodsAhead);

    // Blend: 60% exponential smoothing, 40% linear regression untuk variasi
    const blendedForecast = sesResult.forecast.map(
      (v, i) => v * 0.6 + lrResult.forecast[i] * 0.4,
    );

    const annualPred = blendedForecast.reduce((a, b) => a + b, 0);
    return {
      forecast: blendedForecast.map((v) => Math.round(Math.max(0, v))),
      seasonalIndex: Array(12).fill(1),
      annualPred: Math.round(annualPred),
      mape: sesResult.mape,
    };
  }

  // 1. Total tahunan
  const annualTotals = [];
  for (let yr = 0; yr < yearsCount; yr++) {
    const slice = monthlyActuals.slice(yr * 12, yr * 12 + 12);
    annualTotals.push(slice.reduce((a, b) => a + b, 0));
  }

  // 2. RLS pada data tahunan (Ŷ = a + b*X)
  const nn = yearsCount;
  const xA = annualTotals.map((_, i) => i + 1);
  const sX = xA.reduce((a, b) => a + b, 0);
  const sY = annualTotals.reduce((a, b) => a + b, 0);
  const sXY = xA.reduce((a, x, i) => a + x * annualTotals[i], 0);
  const sX2 = xA.reduce((a, x) => a + x * x, 0);
  const bRLS = (nn * sXY - sX * sY) / (nn * sX2 - sX ** 2);
  const aRLS = (sY - bRLS * sX) / nn;
  const annualPred = Math.max(0, aRLS + bRLS * (nn + 1));

  // 3. Seasonal Index per bulan
  const grandAvg = sY / (yearsCount * 12);
  const seasonalIndex = [];
  for (let m = 0; m < 12; m++) {
    const vals = [];
    for (let yr = 0; yr < yearsCount; yr++) {
      const idx = yr * 12 + m;
      if (idx < n) vals.push(monthlyActuals[idx]);
    }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    seasonalIndex.push(avg / grandAvg);
  }

  // 4. Distribusi prediksi ke bulan-bulan ke depan
  const forecast = [];
  for (let i = 0; i < periodsAhead; i++) {
    const mIdx = (lastMonth + 1 + i) % 12;
    forecast.push(
      Math.round(Math.max(0, (annualPred / 12) * seasonalIndex[mIdx])),
    );
  }

  // 5. MAPE
  let mSum = 0,
    mCnt = 0;
  for (let yr = 0; yr < yearsCount; yr++) {
    const fAnn = aRLS + bRLS * (yr + 1);
    for (let m = 0; m < 12; m++) {
      const idx = yr * 12 + m;
      if (idx < n && monthlyActuals[idx] !== 0) {
        const fitted = (fAnn / 12) * seasonalIndex[m];
        mSum += Math.abs((monthlyActuals[idx] - fitted) / monthlyActuals[idx]);
        mCnt++;
      }
    }
  }
  const mape = mCnt > 0 ? Math.round((mSum / mCnt) * 1000) / 10 : 0;

  return { forecast, seasonalIndex, annualPred: Math.round(annualPred), mape };
}

// ============================================================
// SEASONAL STRENGTH DETECTION & ADVANCED DECOMPOSITION
// Mendeteksi apakah data memiliki pola musiman yang kuat
// ============================================================

/**
 * Hitung seasonal strength dari data bulanan
 * @param {number[]} monthlyData - data bulanan (min 24 bulan / 2 tahun)
 * @returns {{ strength: number, hasSeasonality: boolean, description: string }}
 */
function analyzeSeasonalStrength(monthlyData) {
  if (monthlyData.length < 24) {
    return {
      strength: 0,
      hasSeasonality: false,
      description: "Insufficient data (< 2 years)",
    };
  }

  const yearsCount = Math.floor(monthlyData.length / 12);

  // 1. Hitung seasonal indices
  const seasonalIndices = [];
  const grandMean = monthlyData.reduce((a, b) => a + b, 0) / monthlyData.length;

  for (let m = 0; m < 12; m++) {
    const monthValues = [];
    for (let yr = 0; yr < yearsCount; yr++) {
      const idx = yr * 12 + m;
      if (idx < monthlyData.length) {
        monthValues.push(monthlyData[idx]);
      }
    }
    const monthAvg =
      monthValues.reduce((a, b) => a + b, 0) / monthValues.length;
    seasonalIndices.push(monthAvg / grandMean);
  }

  // 2. Hitung variance dari seasonal component
  const seasonalVariance =
    seasonalIndices.reduce((sum, idx) => sum + Math.pow(idx - 1, 2), 0) / 12;

  // 3. Hitung detrended residuals variance
  const xVals = Array.from({ length: monthlyData.length }, (_, i) => i + 1);
  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = monthlyData.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((a, x, i) => a + x * monthlyData[i], 0);
  const sumX2 = xVals.reduce((a, x) => a + x * x, 0);
  const n = monthlyData.length;

  // Hindari division by zero
  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 0.0001) {
    return {
      strength: 0,
      hasSeasonality: false,
      description: "Insufficient variance in data",
      seasonalIndices: seasonalIndices,
    };
  }

  const trendSlope = (n * sumXY - sumX * sumY) / denominator;
  const trendIntercept = (sumY - trendSlope * sumX) / n;

  let residualVariance = 0;
  for (let i = 0; i < n; i++) {
    const trendVal = trendIntercept + trendSlope * (i + 1);
    const detrended = monthlyData[i] - trendVal;
    const seasonal = trendVal * (seasonalIndices[i % 12] - 1);
    const residual = detrended - seasonal;
    residualVariance += Math.pow(residual, 2);
  }
  residualVariance /= n;

  // 4. Seasonal strength = seasonal variance / (seasonal variance + residual variance)
  const strength =
    seasonalVariance / (seasonalVariance + Math.max(residualVariance, 0.001));

  return {
    strength: Math.round(strength * 100) / 100,
    hasSeasonality: strength > 0.3, // Threshold 0.3 (30%)
    description:
      strength > 0.5
        ? "Strong seasonality detected"
        : strength > 0.3
          ? "Moderate seasonality detected"
          : "Weak or no seasonality",
    seasonalIndices,
  };
}

/**
 * Advanced Seasonal Decomposition dengan trend extraction
 * @param {number[]} actuals - historical values
 * @param {number} periods - forecast periods
 * @returns {{ forecast: number[], seasonalIndices: number[], strength: number, mape: number }}
 */
function advancedSeasonalDecomposition(actuals, periods = 12) {
  const n = actuals.length;
  if (n < 12) {
    // Fallback ke simple exponential smoothing
    const sesResult = exponentialSmoothing(actuals, periods, 0.3);
    return {
      forecast: sesResult.forecast,
      seasonalIndices: Array(12).fill(1),
      strength: 0,
      mape: sesResult.mape,
    };
  }

  // 1. Calculate trend using centered moving average (CMA)
  const trend = [];
  const windowSize = 12;
  for (
    let i = Math.floor(windowSize / 2);
    i < n - Math.floor(windowSize / 2);
    i++
  ) {
    let sum = 0;
    for (
      let j = i - Math.floor(windowSize / 2);
      j <= i + Math.floor(windowSize / 2);
      j++
    ) {
      sum += actuals[j];
    }
    trend.push(sum / windowSize);
  }

  // Extend trend ke awal dan akhir menggunakan linear regression
  const xTrend = Array.from({ length: trend.length }, (_, i) => i);
  const sumX = xTrend.reduce((a, b) => a + b, 0);
  const sumY = trend.reduce((a, b) => a + b, 0);
  const sumXY = xTrend.reduce((a, x, i) => a + x * trend[i], 0);
  const sumX2 = xTrend.reduce((a, x) => a + x * x, 0);
  const m = trend.length;

  // Hindari division by zero
  const denominator = m * sumX2 - sumX * sumX;
  const trendSlope =
    Math.abs(denominator) > 0.0001
      ? (m * sumXY - sumX * sumY) / denominator
      : 0;
  const trendIntercept = (sumY - trendSlope * sumX) / m;

  // Extend trend
  const fullTrend = [];
  for (let i = 0; i < n; i++) {
    if (i < Math.floor(windowSize / 2)) {
      fullTrend.push(
        trendIntercept + trendSlope * (-Math.floor(windowSize / 2) + i),
      );
    } else if (i >= n - Math.floor(windowSize / 2)) {
      const idx = trend.length - 1 + (i - (n - Math.floor(windowSize / 2)));
      fullTrend.push(trendIntercept + trendSlope * idx);
    } else {
      fullTrend.push(trend[i - Math.floor(windowSize / 2)]);
    }
  }

  // 2. Calculate seasonal component
  const seasonalComponent = [];
  for (let i = 0; i < n; i++) {
    seasonalComponent.push(actuals[i] - fullTrend[i]);
  }

  // 3. Calculate seasonal indices
  const seasonalIndices = Array(12).fill(0);
  const seasonalCounts = Array(12).fill(0);
  for (let i = 0; i < n; i++) {
    const monthIdx = i % 12;
    seasonalIndices[monthIdx] += seasonalComponent[i];
    seasonalCounts[monthIdx]++;
  }

  for (let m = 0; m < 12; m++) {
    seasonalIndices[m] =
      seasonalCounts[m] > 0 ? seasonalIndices[m] / seasonalCounts[m] : 0;
  }

  // Normalize seasonal indices
  const avgSeasonal = seasonalIndices.reduce((a, b) => a + b, 0) / 12;
  for (let m = 0; m < 12; m++) {
    seasonalIndices[m] -= avgSeasonal;
  }

  // 4. Calculate residuals dan strength
  let sumSquaredResiduals = 0;
  let sumSquaredSeasonal = 0;
  for (let i = 0; i < n; i++) {
    const seasonal = seasonalIndices[i % 12];
    const residual = actuals[i] - fullTrend[i] - seasonal;
    sumSquaredSeasonal += Math.pow(seasonal, 2);
    sumSquaredResiduals += Math.pow(residual, 2);
  }

  const strength =
    sumSquaredSeasonal /
    (sumSquaredSeasonal + Math.max(sumSquaredResiduals, 1));

  // 5. Forecast
  const forecast = [];
  for (let i = 0; i < periods; i++) {
    const forecastIdx = n + i;
    const forecastTrend =
      trendIntercept + trendSlope * (trend.length - 1 + (i + 1));
    const forecastSeasonal = seasonalIndices[forecastIdx % 12];
    const forecastVal = Math.max(
      0,
      forecastTrend + forecastSeasonal * (1 - (i + 1) * 0.02), // Dampening
    );
    forecast.push(Math.round(forecastVal));
  }

  // 6. Calculate MAPE untuk fitted values
  let mapeSum = 0;
  let mapeCount = 0;
  for (
    let i = Math.floor(windowSize / 2);
    i < n - Math.floor(windowSize / 2);
    i++
  ) {
    const fitted = fullTrend[i] + seasonalIndices[i % 12];
    if (actuals[i] !== 0) {
      mapeSum += Math.abs((actuals[i] - fitted) / actuals[i]);
      mapeCount++;
    }
  }
  const mape =
    mapeCount > 0 ? Math.round((mapeSum / mapeCount) * 1000) / 10 : 0;

  return {
    forecast,
    seasonalIndices,
    strength: Math.round(strength * 100) / 100,
    mape: Math.min(mape, 100), // Cap at 100%
  };
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

    // Deteksi bulan terakhir data (0-based: Jan=0 ... Des=11)
    const lastMonthStr = months[months.length - 1]; // e.g. "2025-12"
    const lastMonthIdx = parseInt(lastMonthStr.split("-")[1], 10) - 1;

    // Seasonal Forecast: RLS tahunan + Seasonal Index bulanan
    const sfResult = seasonalForecast(historicalBudgets, 12, lastMonthIdx);

    const totalHistorical = historicalBudgets.reduce((a, b) => a + b, 0);
    const projectedAnnual = sfResult.annualPred;

    // Tren berdasarkan slope RLS
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
    const trend = growthRate > 2 ? "up" : growthRate < -2 ? "down" : "stable";

    // Buat label bulan untuk forecast
    const lastDate = new Date(lastMonthStr + "-01");
    const forecastMonths = sfResult.forecast.map((budget, i) => {
      const d = new Date(lastDate);
      d.setMonth(d.getMonth() + i + 1);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return { month: fm, budget };
    });

    res.json({
      historical: months.map((m, i) => ({
        month: m,
        budget: historicalBudgets[i],
      })),
      forecast: forecastMonths,
      yearly: yearlyBudgets,
      summary: {
        totalHistorical: Math.round(totalHistorical),
        projectedAnnual: Math.round(projectedAnnual),
        growthRate: Math.round(growthRate * 10) / 10,
        mape: sfResult.mape,
        trend,
        confidence: Math.max(0, Math.min(100, 100 - sfResult.mape)),
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

    // Get SEMUA data historis untuk seasonal analysis
    const [allMonthlyRows] = await pool.query(`
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m') AS month,
        SUM(budget) AS total_budget,
        COUNT(*) AS total_proposals
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
    `);

    // Get last 12 months untuk display
    const [monthlyRows] = await pool.query(`
      SELECT 
        DATE_FORMAT(COALESCE(proposal_date, created_at), '%Y-%m') AS month,
        SUM(budget) AS total_budget,
        COUNT(*) AS total_proposals
      FROM donation_proposals
      WHERE COALESCE(proposal_date, created_at) IS NOT NULL
        AND COALESCE(proposal_date, created_at) >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    // Budget forecast - dengan auto-detection seasonal decomposition
    // Gunakan SEMUA data untuk analisis, tapi cuma 12 bulan terakhir untuk forecast
    const allBudgets = allMonthlyRows.map(
      (r) => parseFloat(r.total_budget) || 0,
    );
    const budgets = monthlyRows.map((r) => parseFloat(r.total_budget) || 0);

    // Analisis seasonal strength menggunakan semua data
    const seasonalAnalysis = analyzeSeasonalStrength(allBudgets);

    // Pilih method berdasarkan seasonal strength
    let forecastResult;
    let methodUsed;

    if (seasonalAnalysis.hasSeasonality) {
      // Gunakan advanced seasonal decomposition jika ada seasonality kuat
      forecastResult = advancedSeasonalDecomposition(budgets, 12);
      methodUsed = "seasonal_decomposition";
    } else {
      // Gunakan blended method (exponential smoothing + linear regression)
      const sesResult = exponentialSmoothing(budgets, 12, 0.35);
      const lrResult = linearRegression(budgets, 12);
      const blendedForecast = sesResult.forecast.map(
        (v, i) => v * 0.6 + lrResult.forecast[i] * 0.4,
      );
      forecastResult = {
        forecast: blendedForecast.map((v) => Math.round(Math.max(0, v))),
        mape: sesResult.mape,
        trend: sesResult.trend,
      };
      methodUsed = "blended_es_lr";
    }

    const blendedForecast = forecastResult.forecast;

    // Proposal count forecast (gunakan hanya 12 bulan terakhir)
    const counts = monthlyRows.map((r) => parseInt(r.total_proposals));
    const countSES = exponentialSmoothing(counts, 12, 0.3);

    // Calculate confidence intervals (±10% dari forecast)
    const forecastWithConfidence = blendedForecast.map((val) => ({
      value: val,
      upper: val * 1.1,
      lower: Math.max(0, val * 0.9),
    }));

    const projectedAnnual = blendedForecast.reduce((a, b) => a + b, 0);

    const forecastMonths = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i + 1);
      const fm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const confidence = forecastWithConfidence[i];
      return {
        month: fm,
        budget: Math.round(confidence.value),
        budgetUpper: Math.round(confidence.upper),
        budgetLower: Math.round(confidence.lower),
        proposals: Math.round(countSES.forecast[i]),
        confidence: Math.max(0, Math.min(100, 100 - forecastResult.mape)),
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
        budgetMAPE: forecastResult.mape,
        budgetTrend: forecastResult.trend || "stable",
        proposalTrend: countSES.trend,
        confidence: Math.max(0, Math.min(100, 100 - forecastResult.mape)),
        // Tambahan: seasonality analysis
        methodUsed: methodUsed,
        seasonalStrength: seasonalAnalysis.strength,
        seasonalityDetected: seasonalAnalysis.hasSeasonality,
        seasonalityDescription: seasonalAnalysis.description,
      },
    });
  } catch (err) {
    console.error("Forecast overview error:", err);
    res.status(500).json({ message: "Error generating forecast overview" });
  }
});

module.exports = router;
