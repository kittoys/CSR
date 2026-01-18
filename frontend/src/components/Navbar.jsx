import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthToken, logoutUser } from "../api/auth";
import {
  Home,
  Briefcase,
  FileText,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
// Animations removed: framer-motion no longer used
import "./Navbar.css";

const Navbar = () => {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo_CSR_AQUA.png");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/programs", label: "Programs", icon: Briefcase },
  ];

  if (token) {
    navLinks.push(
      { to: "/proposals", label: "Proposals", icon: FileText },
      { to: "/admin", label: "Admin", icon: Shield },
    );
  }

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container">
          <NavLink to="/" className="navbar__brand">
            <div className="navbar__logo">
              <img
                src={logoSrc}
                alt="CSR Aqua Logo"
                onError={() => setLogoSrc("/logo_CSR_AQUA.png")}
              />
            </div>
            <span className="navbar__title">
              <span className="navbar__title-main">CSR AQUA</span>
              <span className="navbar__title-sub">Mekarsari</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="navbar__links navbar__links--desktop">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}

            {token ? (
              <button onClick={handleLogout} className="navbar__logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar__link navbar__link--login ${
                    isActive ? "navbar__link--active" : ""
                  }`
                }
              >
                <LogIn size={18} />
                <span>Login</span>
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="navbar__toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="navbar__mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="navbar__links navbar__links--mobile">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <div key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? "navbar__link--active" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              </div>
            ))}

            {token ? (
              <button onClick={handleLogout} className="navbar__logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <div>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `navbar__link navbar__link--login ${
                      isActive ? "navbar__link--active" : ""
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </NavLink>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
