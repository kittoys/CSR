import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export const loginUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/auth/login`, payload);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/auth/register`, payload);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
