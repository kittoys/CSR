import { getAuthToken } from "./auth";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getBudgetForecast() {
  const res = await fetch(`${API_BASE}/forecast/budget`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch budget forecast");
  return res.json();
}

export async function getProposalsForecast() {
  const res = await fetch(`${API_BASE}/forecast/proposals`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch proposals forecast");
  return res.json();
}

export async function getDonationsForecast() {
  const res = await fetch(`${API_BASE}/forecast/donations`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch donations forecast");
  return res.json();
}

export async function getForecastOverview(historyMonths = 999) {
  const params = historyMonths < 999 ? `?months=${historyMonths}` : "";
  const res = await fetch(`${API_BASE}/forecast/overview${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch forecast overview");
  return res.json();
}

/**
 * Get comparison data untuk bulan tertentu across tahun
 * @param {string} month - Bulan dalam format '01'-'12'
 * @param {string[]} years - Array tahun, e.g., ['2024', '2025']
 * @returns {Promise<Object>} Data dengan field 'comparison'
 */
export async function getComparisonData(month, years) {
  if (!month || !years || years.length === 0) {
    throw new Error("Month and years are required");
  }
  const yearsStr = years.join(",");
  const params = `?month=${month}&years=${yearsStr}`;
  const res = await fetch(`${API_BASE}/forecast/overview${params}`);
  if (!res.ok) throw new Error("Failed to fetch comparison data");
  return res.json();
}
