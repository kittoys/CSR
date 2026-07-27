import { getAuthToken } from "./auth";
import { API_BASE } from "../utils/apiConfig";

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getFocData() {
  const res = await fetch(`${API_BASE}/foc`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch FOC data");
  const result = await res.json();
  return result.data || [];
}

export async function addFocData(data) {
  const res = await fetch(`${API_BASE}/foc`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add FOC data");
  return res.json();
}

export async function updateFocData(id, data) {
  const res = await fetch(`${API_BASE}/foc/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update FOC data");
  return res.json();
}

export async function deleteFocData(id) {
  const res = await fetch(`${API_BASE}/foc/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete FOC data");
  return res.json();
}

export async function batchAddFocData(records) {
  const res = await fetch(`${API_BASE}/foc/batch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ records }),
  });
  if (!res.ok) throw new Error("Failed to batch add FOC data");
  return res.json();
}
