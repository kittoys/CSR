import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProposals = async () => {
  const res = await axios.get(`${API_BASE}/proposals`);
  return res.data;
};

export const getProposal = async (id) => {
  const res = await axios.get(`${API_BASE}/proposals/${id}`);
  return res.data;
};

export const createProposal = async (payload) => {
  // Build FormData for file upload support
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  const res = await axios.post(`${API_BASE}/proposals`, form, {
    headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProposal = async (id, payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  const res = await axios.put(`${API_BASE}/proposals/${id}`, form, {
    headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProposal = async (id) => {
  const res = await axios.delete(`${API_BASE}/proposals/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getProposalStats = async () => {
  const res = await axios.get(`${API_BASE}/proposals/stats/summary`);
  return res.data;
};

export const getProposalMonthlyStats = async () => {
  const res = await axios.get(`${API_BASE}/proposals/stats/monthly`);
  return res.data;
};
