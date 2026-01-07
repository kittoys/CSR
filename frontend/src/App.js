import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProposalDashboard from "./pages/ProposalDashboard";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={<ProtectedRoute element={<AdminDashboard />} />}
              />
              <Route
                path="/proposals"
                element={<ProtectedRoute element={<ProposalDashboard />} />}
              />
              <Route path="/" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
