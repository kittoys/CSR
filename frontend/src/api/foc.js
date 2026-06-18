const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export async function getFocData() {
  const res = await fetch(`${API_BASE}/foc`);
  if (!res.ok) throw new Error("Failed to fetch FOC data");
  const result = await res.json();
  return result.data || [];
}

export async function addFocData(data) {
  const res = await fetch(`${API_BASE}/foc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add FOC data");
  return res.json();
}

export async function updateFocData(id, data) {
  const res = await fetch(`${API_BASE}/foc/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update FOC data");
  return res.json();
}

export async function deleteFocData(id) {
  const res = await fetch(`${API_BASE}/foc/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete FOC data");
  return res.json();
}

export async function batchAddFocData(records) {
  const res = await fetch(`${API_BASE}/foc/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });
  if (!res.ok) throw new Error("Failed to batch add FOC data");
  return res.json();
}
