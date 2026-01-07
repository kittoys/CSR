import { useState, useEffect, useCallback } from "react";
import ProposalModal from "../components/ProposalModal";
import {
  PlusCircle,
  Archive,
  Hourglass,
  Package,
  CheckSquare,
  Wallet,
  Printer,
} from "lucide-react";
import {
  getProposals,
  createProposal,
  updateProposal,
  deleteProposal,
  getProposalStats,
  getProposalMonthlyStats,
} from "../api/proposals";
import { generatePrintTableHTML } from "../utils/PrintTableTemplate";
import { generatePrintChartHTML } from "../utils/PrintChartTemplate";
import { useToast } from "../context/ToastContext";
import "./ProposalDashboard.css";

const ProposalDashboard = () => {
  const toast = useToast();
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
  const [filterPeriod, setFilterPeriod] = useState("all");
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  // Filter untuk tabel proposal
  const [tableFilterPeriod, setTableFilterPeriod] = useState("all");
  const [tableSelectedMonth, setTableSelectedMonth] = useState(
    currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`
  );
  const [tableSelectedYear, setTableSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const fetchStats = useCallback(async () => {
    try {
      let params = {};
      if (filterPeriod === "month" && selectedMonth) {
        params.month = selectedMonth;
        params.year = selectedYear;
        console.log(
          "📊 Fetching stats for month:",
          selectedMonth,
          "year:",
          selectedYear
        );
      } else if (filterPeriod === "year" && selectedYear) {
        params.year = selectedYear;
        console.log("📊 Fetching stats for year:", selectedYear);
      } else {
        console.log("📊 Fetching stats for all data");
      }
      console.log("📤 Sending params:", params);
      const data = await getProposalStats(params);
      console.log("📥 Received stats:", data);
      setStats(data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  }, [filterPeriod, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchProposals();
    fetchStats();
    fetchMonthlyStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

    // Cek authentication terlebih dahulu
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.warning(
        "Silakan login di halaman Login dengan:\n- Email: admin@csr.com\n- Password: admin123",
        "Login Diperlukan"
      );
      setIsLoading(false);
      setIsModalOpen(false);
      return;
    }

    try {
      // Debug: Log data yang akan dikirim
      console.log("📤 Sending proposal data:", formData);
      console.log("🔑 Auth token exists:", !!token);

      // Pastikan tidak mengirim objek File mentah ke backend
      const payload = {
        ...formData,
        file_pendukung: formData.file_pendukung || "",
      };

      if (editingProposal) {
        // Mode edit: gunakan PUT
        await updateProposal(editingProposal.id, payload);
        toast.success("Proposal berhasil diperbarui");
      } else {
        // Mode create: gunakan POST
        await createProposal(payload);
        toast.success("Proposal berhasil ditambahkan");
      }

      setIsModalOpen(false);
      setEditingProposal(null);
      await fetchProposals();
      await fetchStats();
      await fetchMonthlyStats();
    } catch (err) {
      // Debug: Log complete error
      console.error("❌ Error saving proposal:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);

      let message =
        err.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan proposal.";

      if (err.response?.status === 401) {
        message =
          "Sesi Anda berakhir atau token tidak valid.\n\n" +
          "Silakan login ulang sebagai admin:\n" +
          "- Email: admin@csr.com\n" +
          "- Password: admin123";
        // Hapus token yang tidak valid
        localStorage.removeItem("authToken");
      } else if (err.response?.status === 403) {
        message = "Akses ditolak. Hanya admin yang dapat menambah proposal.";
      }

      toast.error(message, "Gagal Menyimpan Proposal");
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
        toast.error("Gagal menghapus proposal: " + err.message);
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
        toast.success(`${count} proposal berhasil dihapus`);
      } catch (err) {
        toast.error("Gagal menghapus proposal: " + err.message);
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
 
  const handlePrint = () => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    toast.warning("Mohon izinkan popup untuk mencetak", "Popup Diblokir");
    return;
  }

  const htmlContent = generatePrintTableHTML(
    filteredProposals,
    filterStatus,
    formatCurrency,
    formatDate
  );

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 500);
  };

  const handlePrintChart = () => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    toast.warning("Mohon izinkan popup untuk mencetak", "Popup Diblokir");
    return;
  }

  const htmlContent = generatePrintChartHTML(
    stats,
    monthlyStats,
    getFilterLabel,
    formatCurrency
  );

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  };

  const filteredProposals = proposals.filter((proposal) => {
    const statusMatch =
      filterStatus === "Semua Status" || proposal.status === filterStatus;
    const searchMatch =
      proposal.proposal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.organization.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter berdasarkan tanggal (bulan/tahun)
    let dateMatch = true;
    if (proposal.proposal_date && tableFilterPeriod !== "all") {
      const proposalDate = new Date(proposal.proposal_date);
      const proposalYear = proposalDate.getFullYear().toString();
      const proposalMonth = String(proposalDate.getMonth() + 1).padStart(
        2,
        "0"
      );

      if (tableFilterPeriod === "month") {
        dateMatch =
          proposalYear === tableSelectedYear &&
          proposalMonth === tableSelectedMonth;
      } else if (tableFilterPeriod === "year") {
        dateMatch = proposalYear === tableSelectedYear;
      }
    }

    return statusMatch && searchMatch && dateMatch;
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

  const getMonthOptions = () => {
    const months = [
      { value: "01", label: "Januari" },
      { value: "02", label: "Februari" },
      { value: "03", label: "Maret" },
      { value: "04", label: "April" },
      { value: "05", label: "Mei" },
      { value: "06", label: "Juni" },
      { value: "07", label: "Juli" },
      { value: "08", label: "Agustus" },
      { value: "09", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" },
    ];
    return months;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const getFilterLabel = () => {
    if (filterPeriod === "month" && selectedMonth) {
      const monthName = getMonthOptions().find(
        (m) => m.value === selectedMonth
      )?.label;
      return `${monthName} ${selectedYear}`;
    } else if (filterPeriod === "year" && selectedYear) {
      return `Tahun ${selectedYear}`;
    }
    return "Keseluruhan";
  };

  return (
    <div className="proposal-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard CSR</h1>
          <p className="subtitle">System Monitoring CSR</p>
        </div>
        <button
          className="btn btn--primary btn--lg btn-with-icon"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} />
          <span>Tambah Proposal</span>
        </button>
      </div>

      <div className="dashboard-container">
        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="stats-filter-section">
          <div className="stats-filter-header">
            <h3>Statistik Proposal</h3>
            <span className="filter-badge">{getFilterLabel()}</span>
          </div>
          <div className="stats-filter-controls">
            <div className="filter-group">
              <label>Periode:</label>
              <select
                value={filterPeriod}
                onChange={(e) => {
                  setFilterPeriod(e.target.value);
                  if (e.target.value === "month" && !selectedMonth) {
                    setSelectedMonth(
                      new Date().getMonth() + 1 < 10
                        ? `0${new Date().getMonth() + 1}`
                        : `${new Date().getMonth() + 1}`
                    );
                  }
                }}
                className="filter-select-small"
              >
                <option value="all">Keseluruhan</option>
                <option value="month">Per Bulan</option>
                <option value="year">Per Tahun</option>
              </select>
            </div>

            {filterPeriod === "month" && (
              <div className="filter-group">
                <label>Bulan:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="filter-select-small"
                >
                  {getMonthOptions().map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(filterPeriod === "month" || filterPeriod === "year") && (
              <div className="filter-group">
                <label>Tahun:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="filter-select-small"
                >
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div
                className="stat-icon stat-icon--proposals"
                aria-hidden="true"
              >
                <Archive size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">TOTAL PROPOSALS</p>
                <h3 className="stat-value">{stats.total_proposals || 0}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--progress" aria-hidden="true">
                <Hourglass size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">IN PROGRESS</p>
                <h3 className="stat-value">{stats.in_progress || 0}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--waiting" aria-hidden="true">
                <Package size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">SIAP DIAMBIL</p>
                <h3 className="stat-value">{stats.waiting || 0}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--done" aria-hidden="true">
                <CheckSquare size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">DONE</p>
                <h3 className="stat-value">{stats.completed || 0}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--budget" aria-hidden="true">
                <Wallet size={22} />
              </div>
              <div className="stat-content">
                <p className="stat-label">TOTAL BUDGET</p>
                <h3 className="stat-value stat-value--budget">
                  {formatCurrency(stats.total_budget || 0)}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Tren Proposal Per Bulan</h2>
              <p className="chart-subtitle">
                Data proposal per bulan dengan breakdown status
              </p>
            </div>
            <div className="chart-header-right">
              <button
                className="btn btn--print-chart btn-with-icon"
                onClick={handlePrintChart}
                title="Print Grafik"
              >
                <Printer size={16} />
                <span>Print Grafik</span>
              </button>
              <div className="chart-legend">
                <span className="legend-dot legend-progress"></span>
                <span>In Progress</span>
                <span className="legend-dot legend-waiting"></span>
                <span>Siap Diambil</span>
                <span className="legend-dot legend-done"></span>
                <span>Done</span>
              </div>
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
                // Minimum height 30px, maksimum 220px untuk bar
                const barHeight = maxMonthlyTotal
                  ? Math.max(30, (total / maxMonthlyTotal) * 220)
                  : 30;
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
                      {m.breakdown.in_progress > 0 && (
                        <div
                          className="bar-segment segment-progress"
                          style={{ height: `${inProgressPct}%` }}
                          title={`In Progress: ${m.breakdown.in_progress}`}
                        ></div>
                      )}
                      {m.breakdown.waiting > 0 && (
                        <div
                          className="bar-segment segment-waiting"
                          style={{ height: `${waitingPct}%` }}
                          title={`Siap Diambil: ${m.breakdown.waiting}`}
                        ></div>
                      )}
                      {m.breakdown.done > 0 && (
                        <div
                          className="bar-segment segment-done"
                          style={{ height: `${donePct}%` }}
                          title={`Done: ${m.breakdown.done}`}
                        ></div>
                      )}
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
            <div className="section-header-actions">
              <button
                className="btn btn--print btn-with-icon"
                onClick={handlePrint}
                title="Print Daftar Proposal"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <span className="proposal-count">
                {filteredProposals.length} proposal
              </span>
            </div>
          </div>

          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Cari proposal, case ID, atau organisasi..."
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

            <select
              value={tableFilterPeriod}
              onChange={(e) => {
                setTableFilterPeriod(e.target.value);
              }}
              className="filter-select"
            >
              <option value="all">Semua Periode</option>
              <option value="month">Bulan Tertentu</option>
              <option value="year">Tahun Tertentu</option>
            </select>

            {tableFilterPeriod === "month" && (
              <select
                value={tableSelectedMonth}
                onChange={(e) => setTableSelectedMonth(e.target.value)}
                className="filter-select"
              >
                {getMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            )}

            {(tableFilterPeriod === "month" ||
              tableFilterPeriod === "year") && (
              <select
                value={tableSelectedYear}
                onChange={(e) => setTableSelectedYear(e.target.value)}
                className="filter-select"
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}

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
