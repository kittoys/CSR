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
  const [filterPeriod, setFilterPeriod] = useState("all");
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`
  );
  const [selectedYear, setSelectedYear] = useState(
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
      alert(
        "⚠️ Anda harus login sebagai admin terlebih dahulu!\n\nSilakan login di halaman Login dengan:\n- Email: admin@csr.com\n- Password: admin123"
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
        alert("✅ Proposal berhasil diperbarui");
      } else {
        // Mode create: gunakan POST
        await createProposal(payload);
        alert("✅ Proposal berhasil ditambahkan");
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
          "🔒 Sesi Anda berakhir atau token tidak valid.\n\n" +
          "Silakan login ulang sebagai admin:\n" +
          "- Email: admin@csr.com\n" +
          "- Password: admin123";
        // Hapus token yang tidak valid
        localStorage.removeItem("authToken");
      } else if (err.response?.status === 403) {
        message = "❌ Akses ditolak. Hanya admin yang dapat menambah proposal.";
      }

      alert("❌ Gagal menyimpan proposal:\n\n" + message);
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const totalBudget = filteredProposals.reduce(
      (sum, p) => sum + (parseFloat(p.budget) || 0),
      0
    );

    const statusCounts = {
      "In Progress": filteredProposals.filter((p) => p.status === "In Progress")
        .length,
      "Siap Diambil": filteredProposals.filter(
        (p) => p.status === "Siap Diambil"
      ).length,
      Done: filteredProposals.filter((p) => p.status === "Done").length,
    };

    const proposalRows = filteredProposals
      .map(
        (proposal, index) => `
      <tr>
        <td style="text-align: center; font-weight: 600; color: #374151;">${
          index + 1
        }</td>
        <td>
          <div style="background: #fef08a; color: #78350f; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.75rem; font-weight: 600; display: inline-block;">
            ${proposal.case_id}
          </div>
        </td>
        <td style="font-weight: 600; color: #1f2937;">${
          proposal.proposal_name
        }</td>
        <td style="color: #4b5563;">${proposal.organization}</td>
        <td style="font-size: 0.8rem; color: #6b7280;">${
          proposal.product_detail || "-"
        }</td>
        <td style="font-weight: 600; color: #059669; text-align: right;">
          ${formatCurrency(proposal.budget)}
        </td>
        <td style="text-align: center;">
          <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${
            proposal.status === "In Progress"
              ? "background: #fef3c7; color: #92400e;"
              : proposal.status === "Siap Diambil"
              ? "background: #dbeafe; color: #0c4a6e;"
              : "background: #d1fae5; color: #065f46;"
          }">
            ${proposal.status}
          </span>
        </td>
        <td style="font-size: 0.75rem;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">${
            proposal.pic_name
          }</div>
          <div style="color: #6b7280; font-size: 0.7rem;">${
            proposal.pic_email || "-"
          }</div>
        </td>
        <td style="text-align: center; color: #6b7280; font-size: 0.75rem; white-space: nowrap;">
          ${formatDate(proposal.proposal_date)}
        </td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Laporan Daftar Proposal CSR</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #1f2937;
            background: white;
            padding: 0;
            margin: 0;
          }
          
          .print-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 3px solid #0077c8;
          }
          
          .print-header h1 {
            font-size: 18pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .print-header .subtitle {
            font-size: 9pt;
            color: #6b7280;
            font-weight: 500;
          }
          
          .print-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          
          .print-info-item {
            font-size: 8pt;
            color: #374151;
          }
          
          .print-info-item strong {
            font-weight: 700;
            color: #0f172a;
          }
          
          .summary-stats {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            margin-bottom: 12px;
          }
          
          .summary-card {
            background: white;
            border: 1.5px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
          }
          
          .summary-label {
            font-size: 7pt;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 4px;
            letter-spacing: 0.3px;
          }
          
          .summary-value {
            font-size: 14pt;
            font-weight: 800;
            color: #0f172a;
          }
          
          .summary-card.total {
            background: linear-gradient(135deg, #fef3c7 0%, #fde047 100%);
            border-color: #fbbf24;
          }
          
          .summary-card.progress {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: #fbbf24;
          }
          
          .summary-card.waiting {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-color: #60a5fa;
          }
          
          .summary-card.done {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-color: #34d399;
          }
          
          .summary-card.budget {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border-color: #a78bfa;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 8pt;
          }
          
          .data-table thead {
            background: linear-gradient(135deg, #0077c8 0%, #005a9e 100%);
            color: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .data-table th {
            padding: 8px 6px;
            text-align: left;
            font-weight: 700;
            font-size: 7.5pt;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #0077c8;
            color: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .data-table td {
            padding: 6px 6px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
            background: white;
          }
          
          .data-table tbody tr:nth-child(even) {
            background: #f9fafb;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .data-table tbody tr:hover {
            background: #f3f4f6;
          }
          
          .print-footer {
            margin-top: 12px;
            padding-top: 8px;
            border-top: 2px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 7pt;
            color: #6b7280;
          }
          
          .footer-left {
            font-weight: 500;
          }
          
          .footer-right {
            text-align: right;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            .print-container {
              page-break-inside: avoid;
            }
            
            .data-table {
              page-break-inside: auto;
            }
            
            .data-table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            .data-table thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1>📋 Laporan Daftar Proposal CSR</h1>
            <div class="subtitle">Sistem Manajemen Proposal Corporate Social Responsibility</div>
          </div>
          
          <div class="print-info">
            <div class="print-info-item">
              <strong>Tanggal Cetak:</strong> ${currentDate}
            </div>
            <div class="print-info-item">
              <strong>Total Proposal:</strong> ${
                filteredProposals.length
              } proposal
            </div>
            <div class="print-info-item">
              <strong>Filter Status:</strong> ${filterStatus}
            </div>
          </div>
          
          <div class="summary-stats">
            <div class="summary-card total">
              <div class="summary-label">Total Proposal</div>
              <div class="summary-value">${filteredProposals.length}</div>
            </div>
            <div class="summary-card progress">
              <div class="summary-label">In Progress</div>
              <div class="summary-value">${statusCounts["In Progress"]}</div>
            </div>
            <div class="summary-card waiting">
              <div class="summary-label">Siap Diambil</div>
              <div class="summary-value">${statusCounts["Siap Diambil"]}</div>
            </div>
            <div class="summary-card done">
              <div class="summary-label">Done</div>
              <div class="summary-value">${statusCounts.Done}</div>
            </div>
            <div class="summary-card budget">
              <div class="summary-label">Total Budget</div>
              <div class="summary-value" style="font-size: 10pt;">${formatCurrency(
                totalBudget
              )}</div>
            </div>
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">No</th>
                <th style="width: 90px;">Case ID</th>
                <th style="width: 140px;">Nama Proposal</th>
                <th style="width: 100px;">Organisasi</th>
                <th style="width: 150px;">Detail Produk</th>
                <th style="width: 85px; text-align: right;">Budget</th>
                <th style="width: 75px; text-align: center;">Status</th>
                <th style="width: 100px;">PIC</th>
                <th style="width: 70px; text-align: center;">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              ${proposalRows}
            </tbody>
          </table>
          
          <div class="print-footer">
            <div class="footer-left">
              <strong>Sistem Manajemen Proposal CSR</strong><br>
              Dicetak pada: ${currentDate}
            </div>
            <div class="footer-right">
              Total ${
                filteredProposals.length
              } proposal | Budget: ${formatCurrency(totalBudget)}<br>
              <em>Dokumen ini dicetak secara otomatis dari sistem</em>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrintChart = () => {
    const printWindow = window.open("", "_blank");
    const chartCard = document.querySelector(".chart-card");
    const statsGrid = document.querySelector(".stats-grid");

    if (!printWindow) {
      alert("Mohon izinkan popup untuk mencetak");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Tren Proposal CSR</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 0;
              background: white;
              font-size: 11px;
            }
            
            .print-container {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #0077c8;
              padding-bottom: 10px;
            }
            .print-header h1 {
              font-size: 20px;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .print-header p {
              color: #6b7280;
              font-size: 10px;
            }
            .stats-section {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 10px;
              margin-bottom: 15px;
            }
            .stat-box {
              border: 1.5px solid #e5e7eb;
              border-radius: 6px;
              padding: 10px;
              text-align: center;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .stat-label {
              font-size: 9px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 4px;
              letter-spacing: 0.3px;
            }
            .stat-value {
              font-size: 18px;
              font-weight: 800;
              color: #1f2937;
            }
            .chart-section {
              border: 1.5px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
              background: white;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .chart-title {
              font-size: 16px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .chart-subtitle {
              color: #6b7280;
              font-size: 11px;
              margin-bottom: 10px;
            }
            .chart-legend {
              display: flex;
              gap: 15px;
              justify-content: center;
              margin-bottom: 12px;
              padding: 8px;
              background: #f9fafb;
              border-radius: 6px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .legend-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 10px;
              color: #4b5563;
            }
            .legend-dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            .legend-progress { 
              background: #fbbf24;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .legend-waiting { 
              background: #60a5fa;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .legend-done { 
              background: #34d399;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .chart-body {
              display: flex;
              gap: 12px;
              align-items: flex-end;
              justify-content: space-around;
              height: 180px;
              border-top: 2px solid #e5e7eb;
              border-left: 2px solid #e5e7eb;
              padding: 12px;
              margin-bottom: 12px;
              flex: 1;
            }
            .chart-column {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              flex: 1;
            }
            .bar-stack {
              width: 32px;
              background: #f3f4f6;
              border-radius: 6px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              border: 1.5px solid #e5e7eb;
              box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            }
            .bar-segment {
              width: 100%;
              min-height: 2px;
            }
            .segment-progress { 
              background: linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%);
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            .segment-waiting { 
              background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%);
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            .segment-done { 
              background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            .bar-label {
              font-size: 10px;
              font-weight: 600;
              color: #1f2937;
              text-align: center;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            .data-table th {
              background: #f9fafb;
              padding: 6px 8px;
              text-align: center;
              font-size: 9px;
              font-weight: 700;
              color: #1f2937;
              border: 1px solid #e5e7eb;
              text-transform: uppercase;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .data-table td {
              padding: 6px 8px;
              border: 1px solid #e5e7eb;
              text-align: center;
              color: #374151;
            }
            .data-table td:first-child {
              text-align: left;
              font-weight: 600;
            }
            .print-footer {
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1.5px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 9px;
            }
            
            @media print {
              body { padding: 0; }
              .print-container {
                page-break-inside: avoid;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <h1>📊 Laporan Tren Proposal CSR</h1>
              <p>Sistem Monitoring CSR - Dicetak pada ${new Date().toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )} | Periode: ${getFilterLabel()}</p>
            </div>
            
            ${
              statsGrid
                ? `
              <div class="stats-section">
                <div class="stat-box">
                  <div class="stat-label">Total Proposals</div>
                  <div class="stat-value">${stats?.total_proposals || 0}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">In Progress</div>
                  <div class="stat-value">${stats?.in_progress || 0}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Siap Diambil</div>
                  <div class="stat-value">${stats?.waiting || 0}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Done</div>
                  <div class="stat-value">${stats?.completed || 0}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Total Budget</div>
                  <div class="stat-value" style="font-size: 13px;">${formatCurrency(
                    stats?.total_budget || 0
                  )}</div>
                </div>
              </div>
            `
                : ""
            }

            <div class="chart-section">
              <div class="chart-title">Tren Proposal Per Bulan</div>
              <div class="chart-subtitle">Data proposal 6 bulan terakhir dengan breakdown status</div>
              
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-dot legend-progress"></span>
                  <span>In Progress</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot legend-waiting"></span>
                  <span>Siap Diambil</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot legend-done"></span>
                  <span>Done</span>
                </div>
              </div>

              ${
                chartCard
                  ? chartCard.querySelector(".chart-body")?.outerHTML ||
                    '<p style="text-align:center;padding:20px;color:#9ca3af;">Tidak ada data chart</p>'
                  : '<p style="text-align:center;padding:20px;color:#9ca3af;">Chart tidak ditemukan</p>'
              }

              <table class="data-table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Total</th>
                    <th>In Progress</th>
                    <th>Siap Diambil</th>
                    <th>Done</th>
                  </tr>
                </thead>
                <tbody>
                  ${monthlyStats
                    .map(
                      (m) => `
                    <tr>
                      <td><strong>${m.label}</strong></td>
                      <td><strong>${m.total || 0}</strong></td>
                      <td>${m.breakdown?.in_progress || 0}</td>
                      <td>${m.breakdown?.waiting || 0}</td>
                      <td>${m.breakdown?.done || 0}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <div class="print-footer">
              <p><strong>Dashboard CSR</strong> | System Monitoring CSR | Bright PLN Batam</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
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
          className="btn btn--primary btn--lg"
          onClick={() => setIsModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
              <h2>Tren Proposal Per Bulan</h2>
              <p className="chart-subtitle">
                Data proposal per bulan dengan breakdown status
              </p>
            </div>
            <div className="chart-header-right">
              <button
                className="btn btn--print-chart"
                onClick={handlePrintChart}
                title="Print Grafik"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
                className="btn btn--print"
                onClick={handlePrint}
                title="Print Daftar Proposal"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
