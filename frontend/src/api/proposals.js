import axios from "axios";
import { getAuthToken } from "./auth";
import { API_BASE } from "../utils/apiConfig";

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProposals = async () => {
  const res = await axios.get(`${API_BASE}/proposals`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getProposal = async (id) => {
  const res = await axios.get(`${API_BASE}/proposals/${id}`, {
    headers: authHeaders(),
  });
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
  const headers = authHeaders();
  console.log("🗑️ Delete Proposal - Headers:", headers);
  console.log("🗑️ Token dari sessionStorage:", getAuthToken());

  const res = await axios.delete(`${API_BASE}/proposals/${id}`, {
    headers,
  });
  return res.data;
};

export const getProposalStats = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/proposals/stats/summary`, {
    params: params,
    headers: authHeaders(),
  });
  return res.data;
};

export const getProposalMonthlyStats = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/proposals/stats/monthly`, {
    params: params,
    headers: authHeaders(),
  });
  return res.data;
};
