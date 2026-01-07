import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/auth";

const ProtectedRoute = ({ element }) => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
