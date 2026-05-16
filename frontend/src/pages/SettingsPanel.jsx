import { SlidersHorizontal } from "lucide-react";

const SettingsPanel = () => {
  return (
    <section className="admin" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div className="card">
        <div className="card-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <SlidersHorizontal size={18} />
            Setting
          </h3>
        </div>
        <p className="muted">
          Halaman pengaturan siap diintegrasikan untuk preferensi notifikasi,
          akses pengguna, dan konfigurasi operasional CSR.
        </p>
      </div>
    </section>
  );
};

export default SettingsPanel;
