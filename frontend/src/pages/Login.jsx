import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, setAuthSession } from "../api/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      const allowedRoles = ["admin", "petugas"];
      if (!allowedRoles.includes(data.user?.role)) {
        setError("Role tidak diizinkan untuk login");
        return;
      }

      if (data.token) {
        setAuthSession(data.token, data.user);
        navigate("/proposals");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img src="/logo_CSR_AQUA.png" alt="CSR Aqua Logo" />
          </div>
          <h1 className="login-title">Masuk CSR</h1>
          <p className="login-subtitle">
            Masukkan kredensial admin atau petugas untuk melanjutkan
          </p>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="petugas@csr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, var(--color-support) 100%)",
                color: "var(--color-on-primary)",
                boxShadow: "0 4px 12px rgba(var(--color-primary-rgb), 0.28)",
                transition: "all 0.2s ease",
                lineHeight: "1.5",
                textAlign: "center",
                opacity: loading ? 0.6 : 1,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(var(--color-primary-rgb), 0.35)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(var(--color-primary-rgb), 0.28)";
              }}
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </button>
          </form>

          <p className="login-footer">
            Hubungi admin untuk membuat akun petugas atau admin baru.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
