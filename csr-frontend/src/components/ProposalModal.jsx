import { useState, useEffect } from "react";
import "./ProposalModal.css";

const ProposalModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingProposal,
}) => {
  const [formData, setFormData] = useState({
    case_id: "",
    proposal_name: "",
    organization: "",
    bentuk_donasi: "",
    tipe_proposal: "",
    product_detail: "",
    jumlah_produk: "",
    budget: "",
    catatan: "",
    pic_name: "",
    pic_email: "",
    proposal_date: new Date().toISOString().split("T")[0],
    status: "In Progress",
    bright_status: "",
    file_pendukung: null,
  });

  const [fileName, setFileName] = useState("");

  // Update form saat modal dibuka dengan data editing
  useEffect(() => {
    if (editingProposal) {
      // Mode edit: isi form dengan data existing
      setFormData({
        case_id: editingProposal.case_id || "",
        proposal_name: editingProposal.proposal_name || "",
        organization: editingProposal.organization || "",
        bentuk_donasi: editingProposal.bentuk_donasi || "",
        tipe_proposal: editingProposal.tipe_proposal || "",
        product_detail: editingProposal.product_detail || "",
        jumlah_produk: editingProposal.jumlah_produk || "",
        budget: editingProposal.budget || "",
        catatan: editingProposal.catatan || "",
        pic_name: editingProposal.pic_name || "",
        pic_email: editingProposal.pic_email || "",
        proposal_date:
          editingProposal.proposal_date ||
          new Date().toISOString().split("T")[0],
        status: editingProposal.status || "In Progress",
        bright_status: editingProposal.bright_status || "",
        file_pendukung: null,
      });
      setFileName(editingProposal.file_pendukung || "");
    } else {
      // Mode create: reset form
      setFormData({
        case_id: "",
        proposal_name: "",
        organization: "",
        bentuk_donasi: "",
        tipe_proposal: "",
        product_detail: "",
        jumlah_produk: "",
        budget: "",
        catatan: "",
        pic_name: "",
        pic_email: "",
        proposal_date: new Date().toISOString().split("T")[0],
        status: "In Progress",
        bright_status: "",
        file_pendukung: null,
      });
      setFileName("");
    }
  }, [editingProposal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Simpan objek File; backend akan menangani upload via FormData/multer
      setFormData((prev) => ({
        ...prev,
        file_pendukung: file,
      }));
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        file_pendukung: file,
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi field required
    const requiredFields = {
      case_id: "CASE ID",
      proposal_name: "Nama Proposal",
      organization: "Asal/Organisasi",
      pic_name: "ID NAME",
      proposal_date: "Tanggal Proposal",
      product_detail: "Detail Produk",
      budget: "Total Harga",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        alert(`${label} harus diisi!`);
        return;
      }
    }

    onSubmit(formData);
    setFormData({
      case_id: "",
      proposal_name: "",
      organization: "",
      bentuk_donasi: "",
      tipe_proposal: "",
      product_detail: "",
      jumlah_produk: "",
      budget: "",
      catatan: "",
      pic_name: "",
      pic_email: "",
      proposal_date: new Date().toISOString().split("T")[0],
      status: "In Progress",
      bright_status: "",
      file_pendukung: null,
    });
    setFileName("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingProposal ? "Edit Proposal" : "Tambah Proposal Baru"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Informasi Dasar */}
          <div className="form-section">
            <h3 className="section-title">📋 Informasi Dasar</h3>

            <div className="form-row">
              <div className="form-group">
                <label>ID NAME *</label>
                <input
                  type="text"
                  name="pic_name"
                  value={formData.pic_name}
                  onChange={handleChange}
                  placeholder="Nama Person In Charge"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email PIC</label>
                <input
                  type="email"
                  name="pic_email"
                  value={formData.pic_email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ID CASE *</label>
                <input
                  type="text"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  placeholder="Contoh: CSR-2025-001"
                  required
                />
              </div>
              <div className="form-group">
                {/* Empty space for layout balance */}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nama Proposal *</label>
                <input
                  type="text"
                  name="proposal_name"
                  value={formData.proposal_name}
                  onChange={handleChange}
                  placeholder="Masukkan nama proposal"
                  required
                />
              </div>
              <div className="form-group">
                <label>Asal/Organisasi *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Masukkan asal/organisasi"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tanggal Proposal *</label>
                <input
                  type="date"
                  name="proposal_date"
                  value={formData.proposal_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Siap Diambil">Siap Diambil</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status Pengajuan Bright</label>
                <select
                  name="bright_status"
                  value={formData.bright_status}
                  onChange={handleChange}
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="form-section">
            <h3 className="section-title">📦 Informasi Produk</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Bentuk Donasi</label>
                <select
                  name="bentuk_donasi"
                  value={formData.bentuk_donasi}
                  onChange={handleChange}
                >
                  <option value="">Pilih bentuk donasi</option>
                  <option value="Air Mineral, Sembako, Peralatan">
                    Air Mineral, Sembako, Peralatan
                  </option>
                  <option value="Uang Tunai">Uang Tunai</option>
                  <option value="Barang Kebutuhan">Barang Kebutuhan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipe Proposal</label>
                <select
                  name="tipe_proposal"
                  value={formData.tipe_proposal}
                  onChange={handleChange}
                >
                  <option value="">Pilih tipe</option>
                  <option value="Donasi Produk">Donasi Produk</option>
                  <option value="Donasi Uang">Donasi Uang</option>
                  <option value="Program Sosial">Program Sosial</option>
                  <option value="Pelatihan">Pelatihan</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Detail Produk *</label>
              <textarea
                name="product_detail"
                value={formData.product_detail}
                onChange={handleChange}
                placeholder="Contoh: Air mineral kemasan 600ml merk Aqua, total 100 dus berisi 24 botol per dus"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Jumlah Produk</label>
                <input
                  type="text"
                  name="jumlah_produk"
                  value={formData.jumlah_produk}
                  onChange={handleChange}
                  placeholder="Contoh: 100 dus @ 24 botol = 240"
                />
              </div>
              <div className="form-group">
                <label>Total Harga (IDR) *</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="5000000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="form-section">
            <h3 className="section-title">📝 Informasi Tambahan</h3>

            <div className="form-group">
              <label>Catatan</label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Catatan khusus, kondisi khusus, atau informasi tambahan lainnya"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>File Pendukung</label>
              <div
                className="file-upload-area"
                onDrop={handleDragDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <div className="file-upload-content">
                    <div className="upload-icon">📥</div>
                    <p className="upload-text">
                      <strong>Pilih file atau drag & drop</strong>
                    </p>
                    <p className="upload-subtext">
                      PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                    </p>
                    {fileName && (
                      <p className="file-selected">
                        ✓ File dipilih: {fileName}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={isLoading}
              style={{
                backgroundColor: "#ffffff",
                color: "#374151",
                border: "1px solid #d1d5db",
                fontWeight: "600",
                fontSize: "1rem",
                padding: "14px 32px",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, #0077c8 0%, #1a8917 100%)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "1rem",
                border: "none",
                padding: "14px 32px",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.65 : 1,
              }}
            >
              {isLoading
                ? "Menyimpan..."
                : editingProposal
                ? "Perbarui Proposal"
                : "Tambah Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalModal;
