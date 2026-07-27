import axios from "axios";
import { API_BASE } from "../utils/apiConfig";

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
};
