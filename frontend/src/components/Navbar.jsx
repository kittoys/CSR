import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthToken, logoutUser } from "../api/auth";
import {
  Home,
  Briefcase,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
// Animations removed: framer-motion no longer used
import "./Navbar.css";

const Navbar = ({
  mode = "public",
  isSidebarHidden = false,
  onToggleSidebar,
}) => {
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

  const navLinks =
    mode === "private"
      ? [
          { to: "/proposals", label: "Proposals", icon: FileText },
          { to: "/admin", label: "Admin", icon: Shield },
        ]
      : [
          { to: "/", label: "Home", icon: Home, end: true },
          { to: "/programs", label: "Programs", icon: Briefcase },
        ];

  const publicQuickLinks = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/programs", label: "Programs", icon: Briefcase },
  ];

  const showLogout = mode === "private" && token;

  if (mode === "private") {
    return (
      <>
        <aside
          className={`sidebar ${isSidebarHidden ? "sidebar--hidden" : ""}`}
        >
          <div className="sidebar__top">
            <NavLink to="/admin" className="sidebar__brand">
              <div className="sidebar__logo">
                <img
                  src={logoSrc}
                  alt="CSR Aqua Logo"
                  onError={() => setLogoSrc("/logo_CSR_AQUA.png")}
                />
              </div>
              <span className="sidebar__title">
                <span className="sidebar__title-main">CSR AQUA</span>
                <span className="sidebar__title-sub">Mekarsari</span>
              </span>
            </NavLink>

            <button
              type="button"
              className="sidebar__collapse"
              onClick={onToggleSidebar}
              aria-label="Sembunyikan sidebar"
              title="Sembunyikan sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          <nav className="sidebar__links">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar__section">
            <p className="sidebar__section-title">Halaman Publik</p>
            <nav className="sidebar__links">
              {publicQuickLinks.map(({ to, label, icon: Icon }) => (
                <a
                  key={`public-${to}`}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar__link"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>

          {showLogout && (
            <button onClick={handleLogout} className="sidebar__logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </aside>

        {isSidebarHidden && (
          <button
            type="button"
            className="sidebar__reopen"
            onClick={onToggleSidebar}
            aria-label="Tampilkan sidebar"
            title="Tampilkan sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        <header className="sidebar-mobile">
          <NavLink to="/admin" className="sidebar-mobile__brand">
            <div className="sidebar-mobile__logo">
              <img
                src={logoSrc}
                alt="CSR Aqua Logo"
                onError={() => setLogoSrc("/logo_CSR_AQUA.png")}
              />
            </div>
            <span className="sidebar-mobile__title">CSR AQUA</span>
          </NavLink>

          <button
            type="button"
            className="sidebar-mobile__toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {mobileMenuOpen && (
          <>
            <div
              className="sidebar__mobile-backdrop"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="sidebar__mobile-drawer">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <div className="sidebar__section">
                <p className="sidebar__section-title">Halaman Publik</p>
                {publicQuickLinks.map(({ to, label, icon: Icon }) => (
                  <a
                    key={`mobile-public-${to}`}
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar__link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>

              {showLogout && (
                <button onClick={handleLogout} className="sidebar__logout">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </nav>
          </>
        )}
      </>
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

            {showLogout && (
              <button onClick={handleLogout} className="navbar__logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
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

            {showLogout && (
              <button onClick={handleLogout} className="navbar__logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
