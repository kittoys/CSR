import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Login from "./pages/Login";
import ProgramDashboard from "./pages/ProgramDashboard";
import ProposalDashboard from "./pages/ProposalDashboard";
import ChartDashboard from "./pages/chart";
import FocBulanan from "./pages/FocBulanan";
import ForecastCenter from "./pages/ForecastCenter";
import UserManagement from "./pages/UserManagement";
import Unauthorized from "./pages/Unauthorized";
import DevLoginRedirect from "./components/DevLoginRedirect";
import { getAuthToken } from "./api/auth";
import { ToastProvider } from "./context/ToastContext";
import { DashboardProvider } from "./context/DashboardContext";
import "./App.css";

const PRIVATE_SIDEBAR_STORAGE_KEY = "csr:privateSidebarHidden";

const AppContent = () => {
  const location = useLocation();
  const [isPrivateSidebarHidden, setIsPrivateSidebarHidden] = useState(() => {
    return localStorage.getItem(PRIVATE_SIDEBAR_STORAGE_KEY) === "1";
  });

  // Validasi token - jangan langsung redirect ke dashboard tanpa token yang valid
  const hasAuthToken = Boolean(getAuthToken());

  const isLoginPage = /^\/login(\/|$)/.test(location.pathname);
  const isPrivatePage =
    /^\/program(\/|$)/.test(location.pathname) ||
    /^\/admin(\/|$)/.test(location.pathname) ||
    /^\/proposals(\/|$)/.test(location.pathname) ||
    /^\/chart(\/|$)/.test(location.pathname) ||
    /^\/foc-bulanan(\/|$)/.test(location.pathname) ||
    /^\/forecast(\/|$)/.test(location.pathname);
  const shouldHideNavbar = isLoginPage;
  const mainClassName = `app-main ${shouldHideNavbar ? "app-main--no-navbar" : ""} ${isPrivatePage ? "app-main--with-sidebar" : ""}`;

  const handleToggleSidebar = () => {
    setIsPrivateSidebarHidden((prevHidden) => {
      const nextHidden = !prevHidden;
      localStorage.setItem(PRIVATE_SIDEBAR_STORAGE_KEY, nextHidden ? "1" : "0");
      return nextHidden;
    });
  };

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
          onToggleSidebar={handleToggleSidebar}
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
          <Route
            path="/foc-bulanan"
            element={<ProtectedRoute element={<FocBulanan />} />}
          />
          <Route
            path="/forecast"
            element={<ProtectedRoute element={<ForecastCenter />} />}
          />
          <Route
            path="/users"
            element={
              <RoleBasedRoute
                element={<UserManagement />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/dev-login" element={<DevLoginRedirect />} />
          <Route
            path="/"
            element={
              <Navigate to={hasAuthToken ? "/proposals" : "/login"} replace />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route
            path="*"
            element={
              <Navigate to={hasAuthToken ? "/proposals" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <DashboardProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DashboardProvider>
    </ToastProvider>
  );
}

export default App;
