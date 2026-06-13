const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export async function getBudgetForecast() {
  const res = await fetch(`${API_BASE}/forecast/budget`);
  if (!res.ok) throw new Error("Failed to fetch budget forecast");
  return res.json();
}

export async function getProposalsForecast() {
  const res = await fetch(`${API_BASE}/forecast/proposals`);
  if (!res.ok) throw new Error("Failed to fetch proposals forecast");
  return res.json();
}

export async function getDonationsForecast() {
  const res = await fetch(`${API_BASE}/forecast/donations`);
  if (!res.ok) throw new Error("Failed to fetch donations forecast");
  return res.json();
}

export async function getForecastOverview(historyMonths = 999) {
  const params = historyMonths < 999 ? `?months=${historyMonths}` : "";
  const res = await fetch(`${API_BASE}/forecast/overview${params}`);
  if (!res.ok) throw new Error("Failed to fetch forecast overview");
  return res.json();
}
