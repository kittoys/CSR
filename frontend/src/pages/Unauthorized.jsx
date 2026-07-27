import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">⛔</div>
          <h1 className="unauthorized-title">Akses Ditolak</h1>
          <p className="unauthorized-subtitle">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <p className="unauthorized-role">
            Role Anda: <strong>{user.role}</strong>
          </p>
          <div className="unauthorized-actions">
            <button
              onClick={() => navigate("/proposals")}
              className="btn-primary"
            >
              Kembali ke Dashboard
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">
              Kembali Sebelumnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
