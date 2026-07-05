import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const DevLoginRedirect = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/proposals" replace />;
};

export default DevLoginRedirect;
