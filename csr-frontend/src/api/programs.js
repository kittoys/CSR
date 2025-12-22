import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPrograms = async () => {
  const res = await axios.get(`${API_BASE}/programs`);
  return res.data;
};

export const getProgram = async (id) => {
  const res = await axios.get(`${API_BASE}/programs/${id}`);
  return res.data;
};

// Placeholder untuk operasi admin (create/update/delete)
export const createProgram = async (payload) => {
  const res = await axios.post(`${API_BASE}/programs`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateProgram = async (id, payload) => {
  const res = await axios.put(`${API_BASE}/programs/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteProgram = async (id) => {
  const res = await axios.delete(`${API_BASE}/programs/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
};
