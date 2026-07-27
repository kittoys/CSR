import { Navigate } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../api/auth";

const RoleBasedRoute = ({ element, allowedRoles }) => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default RoleBasedRoute;
