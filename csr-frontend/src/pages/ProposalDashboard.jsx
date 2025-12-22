import { useState, useEffect } from "react";
import ProposalModal from "../components/ProposalModal";
import {
  getProposals,
  createProposal,
  updateProposal,
  deleteProposal,
  getProposalStats,
  getProposalMonthlyStats,
} from "../api/proposals";
import "./ProposalDashboard.css";

const ProposalDashboard = () => {
  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
  const FILES_BASE = API_BASE.replace(/\/api$/, "");
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);

  useEffect(() => {
    fetchProposals();
    fetchStats();
    fetchMonthlyStats();
  }, []);

  const fetchProposals = async () => {
    try {
      setError(null);
      const data = await getProposals();
      setProposals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Gagal memuat data. Pastikan server backend berjalan.");
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getProposalStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const data = await getProposalMonthlyStats();
      setMonthlyStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProposal = async (formData) => {
    setIsLoading(true);
    try {
      // Pastikan tidak mengirim objek File mentah ke backend
      const payload = {
        ...formData,
        file_pendukung: formData.file_pendukung || "",
      };

      if (editingProposal) {
        // Mode edit: gunakan PUT
        await updateProposal(editingProposal.id, payload);
        alert("Proposal berhasil diperbarui");
      } else {
        // Mode create: gunakan POST
        await createProposal(payload);
        alert("Proposal berhasil ditambahkan");
      }

      setIsModalOpen(false);
      setEditingProposal(null);
      await fetchProposals();
      await fetchStats();
      await fetchMonthlyStats();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Sesi berakhir atau belum login. Silakan login ulang sebagai admin."
          : "Terjadi kesalahan saat menyimpan proposal.");
      alert("Gagal menyimpan proposal: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProposal = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proposal ini?")) {
      try {
        await deleteProposal(id);
        await fetchProposals();
        await fetchStats();
        await fetchMonthlyStats();
      } catch (err) {
        alert("Gagal menghapus proposal: " + err.message);
      }
    }
  };

  const toggleSelectProposal = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProposals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProposals.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${count} proposal terpilih? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      setIsDeleting(true);
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) => deleteProposal(id))
        );
        setSelectedIds(new Set());
        await fetchProposals();
        await fetchStats();
        await fetchMonthlyStats();
        alert(`${count} proposal berhasil dihapus.`);
      } catch (err) {
        alert("Gagal menghapus proposal: " + err.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleOpenEditModal = (proposal) => {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProposal(null);
  };

  const filteredProposals = proposals.filter((proposal) => {
    const statusMatch =
      filterStatus === "Semua Status" || proposal.status === filterStatus;
    const searchMatch =
      proposal.proposal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "status--progress";
      case "Siap Diambil":
        return "status--waiting";
      case "Done":
        return "status--done";
      default:
        return "";
    }
  };

  const getBrightStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status--approved";
      case "Pending":
        return "status--pending";
      case "Rejected":
        return "status--rejected";
      default:
        return "status--neutral";
    }
  };

  const maxMonthlyTotal = monthlyStats.reduce(
    (max, m) => Math.max(max, m.total || 0),
    0
  );

  return (
    <div className="proposal-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard CSR</h1>
          <p className="subtitle">System Monitoring CSR</p>
        </div>
        <button
          className="btn btn--primary btn--lg"
          onClick={() => setIsModalOpen(true)}
        >
          + Tambah Proposal
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon--proposals">📋</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL PROPOSALS</p>
              <h3 className="stat-value">{stats.total_proposals || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--progress">⏳</div>
            <div className="stat-content">
              <p className="stat-label">IN PROGRESS</p>
              <h3 className="stat-value">{stats.in_progress || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--waiting">📦</div>
            <div className="stat-content">
              <p className="stat-label">SIAP DIAMBIL</p>
              <h3 className="stat-value">{stats.waiting || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--done">✓</div>
            <div className="stat-content">
              <p className="stat-label">DONE</p>
              <h3 className="stat-value">{stats.completed || 0}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--budget">💰</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL BUDGET</p>
              <h3 className="stat-value" style={{ fontSize: "1.2rem" }}>
                {formatCurrency(stats.total_budget || 0)}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Tren Proposal 6 Bulan Terakhir</h2>
            <p className="chart-subtitle">
              Data proposal per bulan dengan breakdown status
            </p>
          </div>
          <div className="chart-legend">
            <span className="legend-dot legend-progress"></span>
            <span>In Progress</span>
            <span className="legend-dot legend-waiting"></span>
            <span>Siap Diambil</span>
            <span className="legend-dot legend-done"></span>
            <span>Done</span>
          </div>
        </div>

        {monthlyStats.length === 0 ? (
          <div className="chart-empty">
            Belum ada data untuk 6 bulan terakhir
          </div>
        ) : (
          <div className="chart-body">
            {monthlyStats.map((m) => {
              const total = m.total || 0;
              const barHeight = maxMonthlyTotal
                ? Math.max(8, (total / maxMonthlyTotal) * 180)
                : 8;
              const inProgressPct = total
                ? (m.breakdown.in_progress / total) * 100
                : 0;
              const waitingPct = total
                ? (m.breakdown.waiting / total) * 100
                : 0;
              const donePct = total ? (m.breakdown.done / total) * 100 : 0;

              return (
                <div className="chart-column" key={m.month}>
                  <div
                    className="bar-stack"
                    style={{ height: `${barHeight}px` }}
                    title={`${m.label}\nTotal: ${total}\nIn Progress: ${m.breakdown.in_progress}\nSiap Diambil: ${m.breakdown.waiting}\nDone: ${m.breakdown.done}`}
                  >
                    <div
                      className="bar-segment segment-progress"
                      style={{ height: `${inProgressPct}%` }}
                    ></div>
                    <div
                      className="bar-segment segment-waiting"
                      style={{ height: `${waitingPct}%` }}
                    ></div>
                    <div
                      className="bar-segment segment-done"
                      style={{ height: `${donePct}%` }}
                    ></div>
                  </div>
                  <div className="bar-label">{m.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="proposals-section">
        <div className="section-header">
          <h2>Daftar Proposal</h2>
          <span className="proposal-count">
            {filteredProposals.length} proposal
          </span>
        </div>

        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari proposal, PIC, atau produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option>Semua Status</option>
            <option>In Progress</option>
            <option>Siap Diambil</option>
            <option>Done</option>
          </select>

          {selectedIds.size > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedIds.size} terpilih
              </span>
              <button
                className="btn btn--danger"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "🗑 Hapus Terpilih"}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setSelectedIds(new Set())}
                disabled={isDeleting}
              >
                Batal
              </button>
            </div>
          )}
        </div>

        <div className="table-wrapper">
          <table className="proposals-table">
            <thead>
              <tr>
                <th className="cell-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      filteredProposals.length > 0 &&
                      selectedIds.size === filteredProposals.length
                    }
                    onChange={toggleSelectAll}
                    disabled={filteredProposals.length === 0}
                    title="Pilih semua"
                  />
                </th>
                <th>CASE ID</th>
                <th>Nama Proposal</th>
                <th>Organisasi</th>
                <th>Detail Produk</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Pengajuan Bright</th>
                <th>PIC</th>
                <th>Tanggal</th>
                <th>File</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className={
                      selectedIds.has(proposal.id) ? "row-selected" : ""
                    }
                  >
                    <td className="cell-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(proposal.id)}
                        onChange={() => toggleSelectProposal(proposal.id)}
                        title="Pilih proposal ini"
                      />
                    </td>
                    <td className="cell-case-id">
                      <span className="case-id">{proposal.case_id}</span>
                    </td>
                    <td className="cell-name">{proposal.proposal_name}</td>
                    <td className="cell-organization">
                      {proposal.organization}
                    </td>
                    <td className="cell-product">
                      <span title={proposal.product_detail}>
                        {proposal.product_detail?.substring(0, 30)}...
                      </span>
                    </td>
                    <td className="cell-budget">
                      {formatCurrency(proposal.budget)}
                    </td>
                    <td className="cell-status">
                      <span
                        className={`status-badge ${getStatusClass(
                          proposal.status
                        )}`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                    <td className="cell-bright-status">
                      <span
                        className={`status-badge ${getBrightStatusClass(
                          proposal.bright_status
                        )}`}
                      >
                        {proposal.bright_status || "-"}
                      </span>
                    </td>
                    <td className="cell-pic">
                      <div className="pic-info">
                        <p className="pic-name">{proposal.pic_name}</p>
                        <p className="pic-email">{proposal.pic_email}</p>
                      </div>
                    </td>
                    <td className="cell-date">
                      {formatDate(proposal.proposal_date)}
                    </td>
                    <td className="cell-file">
                      {proposal.file_path ? (
                        <a
                          href={`${FILES_BASE}${proposal.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          📄 {proposal.file_pendukung || "File"}
                        </a>
                      ) : (
                        <span className="no-file">-</span>
                      )}
                    </td>
                    <td className="cell-actions">
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          title="Edit"
                          onClick={() => handleOpenEditModal(proposal)}
                        >
                          ✎
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Delete"
                          onClick={() => handleDeleteProposal(proposal.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="empty-state">
                    Tidak ada proposal yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProposalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddProposal}
        isLoading={isLoading}
        editingProposal={editingProposal}
      />
    </div>
  );
};

export default ProposalDashboard;
