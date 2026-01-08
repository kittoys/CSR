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

  const fetchMonthlyStats = useCallback(async () => {
    try {
      let params = {};
      if (filterPeriod === "month" && selectedMonth) {
        params.month = selectedMonth;
        params.year = selectedYear;
      } else if (filterPeriod === "year" && selectedYear) {
        params.year = selectedYear;
      }
      const data = await getProposalMonthlyStats(params);
      setMonthlyStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [filterPeriod, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchProposals();
    fetchStats();
    fetchMonthlyStats();
  }, [fetchStats, fetchMonthlyStats]);

  useEffect(() => {
    fetchStats();
    fetchMonthlyStats();
  }, [fetchStats, fetchMonthlyStats]);

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

      // Kirim payload apa adanya; FormData akan menangani file
      const payload = {
        ...formData,
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

  const maxMonthlyBudget = monthlyStats.reduce(
    (max, m) => Math.max(max, m.total_budget || 0),
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

        <div className="charts-container">
          <div className="chart-card chart-card--bar">
            <div className="chart-header">
              <div>
                <h2>Tren Budget Per Bulan</h2>
                <p className="chart-subtitle">
                  Total budget proposal per bulan
                </p>
                {stats && stats.total_budget > 0 && (
                  <div className="chart-budget-badge">
                    <span className="budget-label">Total Budget:</span>
                    <span className="budget-value">
                      {formatCurrency(stats.total_budget)}
                    </span>
                  </div>
                )}
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
              </div>
            </div>

            {monthlyStats.length === 0 ? (
              <div className="chart-empty">
                Belum ada data untuk 6 bulan terakhir
              </div>
            ) : (
              <div className="chart-body">
                {monthlyStats.map((m) => {
                  const budget = m.total_budget || 0;
                  // Minimum height 30px, maksimum 220px untuk bar
                  const barHeight = maxMonthlyBudget
                    ? Math.max(30, (budget / maxMonthlyBudget) * 220)
                    : 30;

                  return (
                    <div className="chart-column" key={m.month}>
                      <div
                        className="bar-stack bar-stack--budget"
                        style={{ height: `${barHeight}px` }}
                        title={`${m.label}\nBudget: ${formatCurrency(budget)}`}
                      >
                        <div
                          className="bar-segment segment-budget"
                          style={{ height: "100%" }}
                        ></div>
                      </div>
                      <div className="bar-budget">{formatCurrency(budget)}</div>
                      <div className="bar-label">{m.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {stats && (
            <div className="chart-card chart-card--donut">
              <div className="chart-header">
                <div>
                  <h2>Distribusi Status</h2>
                  <p className="chart-subtitle">
                    Persentase status proposal saat ini
                  </p>
                  {stats.total_budget > 0 && (
                    <div className="chart-budget-badge">
                      <span className="budget-label">Total Budget:</span>
                      <span className="budget-value">
                        {formatCurrency(stats.total_budget)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="chart-body">
                <div className="donut-chart-container">
                  <svg viewBox="0 0 200 200" className="donut-chart">
                    {(() => {
                      const total = stats.total_proposals || 0;
                      if (total === 0) {
                        return (
                          <text
                            x="100"
                            y="100"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="donut-no-data"
                          >
                            Tidak ada data
                          </text>
                        );
                      }

                      const inProgress = stats.in_progress || 0;
                      const waiting = stats.waiting || 0;
                      const completed = stats.completed || 0;

                      const inProgressPct = (inProgress / total) * 100;
                      const waitingPct = (waiting / total) * 100;
                      const completedPct = (completed / total) * 100;

                      const radius = 70;
                      const innerRadius = 45;

                      let currentAngle = -90;

                      const createArc = (percentage, startAngle) => {
                        const angle = (percentage / 100) * 360;
                        const endAngle = startAngle + angle;

                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;

                        const x1 = 100 + radius * Math.cos(startRad);
                        const y1 = 100 + radius * Math.sin(startRad);
                        const x2 = 100 + radius * Math.cos(endRad);
                        const y2 = 100 + radius * Math.sin(endRad);

                        const x3 = 100 + innerRadius * Math.cos(endRad);
                        const y3 = 100 + innerRadius * Math.sin(endRad);
                        const x4 = 100 + innerRadius * Math.cos(startRad);
                        const y4 = 100 + innerRadius * Math.sin(startRad);

                        const largeArc = angle > 180 ? 1 : 0;

                        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
                      };

                      const segments = [];

                      // Jika hanya ada satu jenis status, tampilkan sebagai lingkaran penuh
                      const hasMultipleStatuses =
                        (inProgress > 0 ? 1 : 0) +
                          (waiting > 0 ? 1 : 0) +
                          (completed > 0 ? 1 : 0) >
                        1;

                      if (!hasMultipleStatuses) {
                        // Hanya satu status, tampilkan sebagai lingkaran penuh
                        let singleClass = "";
                        if (inProgress > 0)
                          singleClass = "donut-segment--progress";
                        else if (waiting > 0)
                          singleClass = "donut-segment--waiting";
                        else if (completed > 0)
                          singleClass = "donut-segment--done";

                        // Gunakan 99.9% untuk menghindari masalah rendering lingkaran penuh
                        segments.push(
                          <path
                            key="single"
                            d={createArc(99.9, currentAngle)}
                            className={`donut-segment ${singleClass}`}
                            title={`Total: ${total}`}
                          />
                        );
                      } else {
                        // Multiple statuses, render each segment
                        if (inProgressPct > 0) {
                          segments.push(
                            <path
                              key="progress"
                              d={createArc(inProgressPct, currentAngle)}
                              className="donut-segment donut-segment--progress"
                              title={`In Progress: ${inProgress} (${inProgressPct.toFixed(
                                1
                              )}%)`}
                            />
                          );
                          currentAngle += (inProgressPct / 100) * 360;
                        }

                        if (waitingPct > 0) {
                          segments.push(
                            <path
                              key="waiting"
                              d={createArc(waitingPct, currentAngle)}
                              className="donut-segment donut-segment--waiting"
                              title={`Siap Diambil: ${waiting} (${waitingPct.toFixed(
                                1
                              )}%)`}
                            />
                          );
                          currentAngle += (waitingPct / 100) * 360;
                        }

                        if (completedPct > 0) {
                          segments.push(
                            <path
                              key="completed"
                              d={createArc(completedPct, currentAngle)}
                              className="donut-segment donut-segment--done"
                              title={`Done: ${completed} (${completedPct.toFixed(
                                1
                              )}%)`}
                            />
                          );
                        }
                      }

                      return (
                        <>
                          {segments}
                          <text
                            x="100"
                            y="92"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="donut-total-label"
                          >
                            Total
                          </text>
                          <text
                            x="100"
                            y="108"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="donut-total-value"
                          >
                            {total}
                          </text>
                        </>
                      );
                    })()}
                  </svg>

                  <div className="donut-legend">
                    <div className="donut-legend-item">
                      <span className="donut-legend-dot donut-legend-dot--progress"></span>
                      <div className="donut-legend-content">
                        <span className="donut-legend-label">In Progress</span>
                        <span className="donut-legend-value">
                          {stats.in_progress || 0}
                          <span className="donut-legend-percent">
                            {stats.total_proposals
                              ? (
                                  ((stats.in_progress || 0) /
                                    stats.total_proposals) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="donut-legend-item">
                      <span className="donut-legend-dot donut-legend-dot--waiting"></span>
                      <div className="donut-legend-content">
                        <span className="donut-legend-label">Siap Diambil</span>
                        <span className="donut-legend-value">
                          {stats.waiting || 0}
                          <span className="donut-legend-percent">
                            {stats.total_proposals
                              ? (
                                  ((stats.waiting || 0) /
                                    stats.total_proposals) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="donut-legend-item">
                      <span className="donut-legend-dot donut-legend-dot--done"></span>
                      <div className="donut-legend-content">
                        <span className="donut-legend-label">Done</span>
                        <span className="donut-legend-value">
                          {stats.completed || 0}
                          <span className="donut-legend-percent">
                            {stats.total_proposals
                              ? (
                                  ((stats.completed || 0) /
                                    stats.total_proposals) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                        {(() => {
                          const proposalLink =
                            proposal.proposal_file_path || proposal.file_path;
                          const proposalName =
                            proposal.proposal_file_name ||
                            proposal.file_pendukung ||
                            "Proposal";

                          const proofLink = proposal.proof_file_path;
                          const proofName = proposal.proof_file_name || "Bukti";

                          const fileItems = [];

                          if (proposalLink) {
                            fileItems.push(
                              <div key="proposal-item" className="file-item">
                                <div className="file-label">File Proposal</div>
                                <a
                                  href={`${FILES_BASE}${proposalLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link"
                                  title="File Proposal"
                                >
                                  📄 {proposalName}
                                </a>
                              </div>
                            );
                          }

                          if (proofLink) {
                            fileItems.push(
                              <div key="proof-item" className="file-item">
                                <div className="file-label">File Donasi</div>
                                <a
                                  href={`${FILES_BASE}${proofLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link"
                                  title="Bukti Donasi Diambil"
                                >
                                  📎 {proofName}
                                </a>
                              </div>
                            );
                          }

                          return fileItems.length > 0 ? (
                            <span>{fileItems}</span>
                          ) : (
                            <span className="no-file">-</span>
                          );
                        })()}
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
