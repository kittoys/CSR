import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthToken, logoutUser } from "../api/auth";
import {
  Droplets,
  Home,
  Briefcase,
  FileText,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const token = getAuthToken();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      { to: "/admin", label: "Admin", icon: Shield }
    );
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      >
        <div className="navbar__container">
          <NavLink to="/" className="navbar__brand">
            <motion.div
              className="navbar__logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Droplets size={28} />
            </motion.div>
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
              <motion.button
                onClick={handleLogout}
                className="navbar__logout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
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
          <motion.button
            className="navbar__toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="navbar__mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              className="navbar__links navbar__links--mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {navLinks.map(({ to, label, icon: Icon, end }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
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
                </motion.div>
              ))}

              {token ? (
                <motion.button
                  onClick={handleLogout}
                  className="navbar__logout"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
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
                </motion.div>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
