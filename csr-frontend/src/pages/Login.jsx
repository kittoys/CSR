import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
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

      if (data.user.role !== "admin") {
        setError("Hanya admin yang bisa login");
        return;
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin");
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
          <h1 className="login-title">CSR Admin Login</h1>
          <p className="login-subtitle">
            Masukkan kredensial Anda untuk melanjutkan
          </p>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
              className="btn btn--primary btn--full"
              disabled={loading}
            >
              {loading ? "Sedang login..." : "Login"}
            </button>
          </form>

          <p className="login-footer">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
