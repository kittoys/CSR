import { NavLink, useNavigate } from "react-router-dom";
import { getAuthToken, logoutUser } from "../api/auth";
import "./Navbar.css";

const Navbar = () => {
  const token = getAuthToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">CSR Portal</div>
      <nav className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/programs"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Programs
        </NavLink>
        {token ? (
          <>
            <NavLink
              to="/proposals"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Proposals
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Admin
            </NavLink>
            <button onClick={handleLogout} className="navbar__logout">
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
