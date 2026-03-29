import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Login from "./pages/Login";
import ProgramDashboard from "./pages/ProgramDashboard";
import ProposalDashboard from "./pages/ProposalDashboard";
import ChartDashboard from "./pages/chart";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

const PRIVATE_SIDEBAR_STORAGE_KEY = "csr:privateSidebarHidden";

const AppContent = () => {
  const location = useLocation();
  const [isPrivateSidebarHidden, setIsPrivateSidebarHidden] = useState(() => {
    return localStorage.getItem(PRIVATE_SIDEBAR_STORAGE_KEY) === "1";
  });
  const isLoginPage = /^\/login(\/|$)/.test(location.pathname);
  const isPrivatePage =
    /^\/program(\/|$)/.test(location.pathname) ||
    /^\/admin(\/|$)/.test(location.pathname) ||
    /^\/proposals(\/|$)/.test(location.pathname) ||
    /^\/chart(\/|$)/.test(location.pathname);
  const shouldHideNavbar = isLoginPage;
  const mainClassName = `app-main ${shouldHideNavbar ? "app-main--no-navbar" : ""} ${isPrivatePage ? "app-main--with-sidebar" : ""}`;

  useEffect(() => {
    localStorage.setItem(
      PRIVATE_SIDEBAR_STORAGE_KEY,
      isPrivateSidebarHidden ? "1" : "0",
    );
  }, [isPrivateSidebarHidden]);

  return (
    <div
      className={`app-shell ${
        isPrivatePage && isPrivateSidebarHidden
          ? "app-shell--sidebar-hidden"
          : ""
      }`}
    >
      {!shouldHideNavbar && (
        <Navbar
          mode={isPrivatePage ? "private" : "public"}
          isSidebarHidden={isPrivateSidebarHidden}
          onToggleSidebar={() =>
            setIsPrivateSidebarHidden((prevHidden) => !prevHidden)
          }
        />
      )}
      <main className={mainClassName}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/program"
            element={<ProtectedRoute element={<ProgramDashboard />} />}
          />
          <Route path="/admin" element={<Navigate to="/program" replace />} />
          <Route
            path="/proposals"
            element={<ProtectedRoute element={<ProposalDashboard />} />}
          />
          <Route
            path="/chart"
            element={<ProtectedRoute element={<ChartDashboard />} />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
