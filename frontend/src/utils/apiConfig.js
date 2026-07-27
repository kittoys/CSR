const configuredApiBase = process.env.REACT_APP_API_BASE?.trim();

export const API_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/$/, "")
  : "http://localhost:5000/api";

export const FILES_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/api$/, "")
  : "http://localhost:5000";

export const getApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

export const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) return `${FILES_BASE}${url}`;
  return url;
};
