import { useEffect, useState } from "react";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../api/programs";
import { getCategories } from "../api/categories";
import { useToast } from "../context/ToastContext";
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
  source_link: "",
};

const AdminDashboard = () => {
  const toast = useToast();
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState([]);

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
      await getCategories();
    } catch (err) {
      // ignore if categories endpoint empty
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((prev) => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.warning("Judul dan deskripsi wajib diisi", "Data Tidak Lengkap");
      return;
    }

    // Validasi category_id jika diisi
    if (form.category_id && isNaN(Number(form.category_id))) {
      toast.warning(
        "Kategori harus berupa angka ID. Gunakan: 1=Lingkungan, 2=Pendidikan, 3=Kesehatan, 4=Ekonomi",
        "Kategori Tidak Valid"
      );
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.image_url;

      // Upload image jika ada file baru
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Gagal upload gambar");
        }

        imageUrl = uploadData.url;
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        category_id: form.category_id ? Number(form.category_id) : null,
        source_link: form.source_link || null,
      };

      if (editingId) {
        await updateProgram(editingId, payload);
        toast.success("Program berhasil diperbarui");
      } else {
        await createProgram(payload);
        toast.success("Program berhasil dibuat");
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      setImagePreview("");
      await fetchPrograms();
    } catch (err) {
      console.error("Error saving program:", err);
      const msg =
        err.message ||
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Sesi berakhir atau belum login admin."
          : "Gagal menyimpan program");
      toast.error(msg);
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
      source_link: program.source_link || "",
    });
    setImageFile(null);
    setImagePreview(program.image_url || "");
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
      toast.error(msg);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
  };

  const handleSelectProgram = (id) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrograms.length === programs.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programs.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPrograms.length === 0) return;
    if (
      !window.confirm(`Hapus ${selectedPrograms.length} program yang dipilih?`)
    )
      return;

    try {
      await Promise.all(selectedPrograms.map((id) => deleteProgram(id)));
      setSelectedPrograms([]);
      await fetchPrograms();
      toast.success(`${selectedPrograms.length} program berhasil dihapus`);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Gagal menghapus beberapa program";
      toast.error(msg);
    }
  };

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  // Resolve image URL: if stored as "/uploads/..." prefix backend host
  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads")) return `http://localhost:5000${url}`;
    return url;
  };

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
              <button className="btn-cancel-edit" onClick={handleCancel}>
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
              <label>Link Sumber Berita (opsional)</label>
              <input
                type="url"
                name="source_link"
                value={form.source_link}
                onChange={handleChange}
                placeholder="https://contoh.com/berita"
              />
            </div>

            <div className="form-group">
              <label>Upload Gambar (opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-file-input"
              />
              {imagePreview && (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kategori</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">Pilih kategori</option>
                  <option value="1">Lingkungan</option>
                  <option value="2">Pendidikan</option>
                  <option value="3">Kesehatan</option>
                  <option value="4">Ekonomi</option>
                </select>
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
                className="btn-primary-submit"
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
                className="btn-ghost-reset"
                disabled={saving}
                onClick={handleCancel}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card table-card">
          <div className="card-header">
            <div>
              <h3>Daftar Program</h3>
              <p className="muted small">
                Pilih program untuk hapus massal atau edit/hapus individual.
              </p>
            </div>
            {selectedPrograms.length > 0 && (
              <button
                className="btn-bulk-delete"
                onClick={handleBulkDelete}
                title="Hapus program terpilih"
              >
                🗑 Hapus {selectedPrograms.length} Program
              </button>
            )}
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
                    <th className="th-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          programs.length > 0 &&
                          selectedPrograms.length === programs.length
                        }
                        onChange={handleSelectAll}
                        title="Pilih semua"
                      />
                    </th>
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
                    <tr
                      key={p.id}
                      className={
                        selectedPrograms.includes(p.id) ? "selected" : ""
                      }
                    >
                      <td className="td-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(p.id)}
                          onChange={() => handleSelectProgram(p.id)}
                        />
                      </td>
                      <td>
                        {p.image_url ? (
                          <img
                            src={resolveImageUrl(p.image_url)}
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
