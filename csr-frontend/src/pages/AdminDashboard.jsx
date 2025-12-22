import { useEffect, useState } from "react";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../api/programs";
import { getCategories } from "../api/categories";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  description: "",
  category_id: "",
  location: "",
  start_date: "",
  end_date: "",
  status: "planned",
  image_url: "",
};

const AdminDashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
    fetchCategories();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Gagal memuat program. Pastikan sudah login admin.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      // ignore if categories endpoint empty
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Judul dan deskripsi wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
      };
      if (editingId) {
        await updateProgram(editingId, payload);
        alert("Program diperbarui");
      } else {
        await createProgram(payload);
        alert("Program dibuat");
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchPrograms();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Sesi berakhir atau belum login admin."
          : "Gagal menyimpan program");
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setForm({
      title: program.title || "",
      description: program.description || "",
      category_id: program.category_id || "",
      location: program.location || "",
      start_date: program.start_date ? program.start_date.slice(0, 10) : "",
      end_date: program.end_date ? program.end_date.slice(0, 10) : "",
      status: program.status || "planned",
      image_url: program.image_url || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus program ini?")) return;
    try {
      await deleteProgram(id);
      await fetchPrograms();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Gagal menghapus program (butuh login admin)";
      alert(msg);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="page admin">
      <div className="admin__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Kelola Program CSR</h2>
          <p className="muted">
            Tambah, ubah, dan hapus program sebagai admin.
          </p>
        </div>
      </div>

      <div className="admin__grid">
        <div className="card form-card">
          <div className="card-header">
            <h3>{editingId ? "Edit Program" : "Tambah Program"}</h3>
            {editingId && (
              <button className="btn btn--ghost" onClick={handleCancel}>
                Batal Edit
              </button>
            )}
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Judul program"
                required
              />
            </div>

            <div className="form-group">
              <label>Deskripsi *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Deskripsi singkat"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>URL Gambar (opsional)</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://... gambar program"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kategori</label>
                {categories.length > 0 ? (
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    placeholder="ID kategori (opsional)"
                  />
                )}
              </div>

              <div className="form-group">
                <label>Lokasi</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lokasi program"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mulai</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Selesai</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : editingId
                  ? "Simpan Perubahan"
                  : "Tambah Program"}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleCancel}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <h3>Daftar Program</h3>
            <p className="muted small">
              Klik edit untuk mengubah, delete untuk menghapus.
            </p>
          </div>

          {error && <div className="alert">{error}</div>}
          {loading ? (
            <p className="muted">Memuat...</p>
          ) : programs.length === 0 ? (
            <p className="muted">Belum ada program.</p>
          ) : (
            <div className="table-wrapper admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Gambar</th>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Status</th>
                    <th>Periode</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="thumb"
                          />
                        ) : (
                          <div className="thumb thumb--placeholder">—</div>
                        )}
                      </td>
                      <td>
                        <div className="cell-title">{p.title}</div>
                        <div className="cell-desc">
                          {p.description?.slice(0, 80) || "-"}
                        </div>
                      </td>
                      <td>{p.category_name || p.category_id || "-"}</td>
                      <td>
                        <span
                          className={`badge badge--${p.status || "planned"}`}
                        >
                          {p.status || "planned"}
                        </span>
                      </td>
                      <td>
                        <div className="cell-dates">
                          <span>
                            {p.start_date ? p.start_date.slice(0, 10) : "-"}
                          </span>
                          <span>→</span>
                          <span>
                            {p.end_date ? p.end_date.slice(0, 10) : "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(p)}
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(p.id)}
                            title="Hapus"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
