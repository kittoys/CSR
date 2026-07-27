import axios from "axios";
import { API_BASE } from "../utils/apiConfig";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "user";

export const loginUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/auth/login`, payload);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await axios.post(`${API_BASE}/auth/register`, payload);
  return res.data;
};

export const setAuthSession = (token, user) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
};

export const getAuthToken = () => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthUser = () => {
  const user = sessionStorage.getItem(AUTH_USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};
