import { useMemo, useState, useEffect } from "react";
import {
  Building2,
  Droplets,
  CalendarClock,
  TrendingUp,
  Search,
  Filter,
  Plus,
  FileText,
  Pencil,
  Trash2,
  Printer,
  X,
  BarChart3,
  LineChart,
  Boxes,
  Settings,
  Zap,
  Download,
  Share2,
  RefreshCw,
  Star,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  getFocData,
  addFocData,
  updateFocData,
  deleteFocData,
  batchAddFocData,
} from "../api/foc";
import "./FocBulanan.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const HISTORY_YEARS = [2026, 2025, 2024, 2023];

// generate rows: for every month from Jan 2023 to today, create one entry per institution
const generateInitialRows = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();

  const institutions = [
    {
      lembaga: "Kantor Desa Mekarsari",
      pengambil: "Budi Setiawan",
      nomorHp: "0812-3456-7890",
      jumlahAqua: 10,
    },
    {
      lembaga: "Kantor Desa Babakanpari",
      pengambil: "Ahmad Fauzi",
      nomorHp: "0813-4567-8901",
      jumlahAqua: 10,
    },
    {
      lembaga: "Polsek Cicurug",
      pengambil: "Aiptu Hendra Wijaya",
      nomorHp: "0815-5678-9012",
      jumlahAqua: 7,
    },
    {
      lembaga: "Polsek Cidahu",
      pengambil: "Bripka Agus Susanto",
      nomorHp: "0819-6789-0123",
      jumlahAqua: 7,
    },
    {
      lembaga: "Koramil 0713 Cicurug",
      pengambil: "Serka M. Ridwan",
      nomorHp: "0812-7890-1234",
      jumlahAqua: 7,
    },
    {
      lembaga: "Posko III Damkar Cicurug",
      pengambil: "Danru Dedi Supriadi",
      nomorHp: "0857-8901-2345",
      jumlahAqua: 7,
    },
    {
      lembaga: "Puskesmas Cicurug",
      pengambil: "Dr. Rina Amalia",
      nomorHp: "0821-9012-3456",
      jumlahAqua: 10,
    },
    {
      lembaga: "SMA Amaliyah Cicurug",
      pengambil: "Drs. Cecep Mulyana",
      nomorHp: "0813-0123-4567",
      jumlahAqua: 10,
    },
    {
      lembaga: "MTs Darul Amsor Muhammidin",
      pengambil: "Ust. H. Syarifudin",
      nomorHp: "0856-1234-5678",
      jumlahAqua: 10,
    },
    {
      lembaga: "KUA Kecamatan Cicurug",
      pengambil: "H. Anwar Sadat, S.Ag",
      nomorHp: "0878-2345-6789",
      jumlahAqua: 7,
    },
  ];

  const rows = [];
  let id = 1;
  const cursor = new Date(start.getFullYear(), start.getMonth(), 10);

  while (cursor <= end) {
    for (let i = 0; i < institutions.length; i++) {
      const inst = institutions[i];
      // set day so entries in a month vary slightly
      const day = Math.min(25, 5 + (i % 10));
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      if (d > end) break;

      rows.push({
        id: id,
        tanggal: d.toISOString().slice(0, 10),
        lembaga: inst.lembaga,
        penanggungJawab: inst.pengambil,
        nomorHp: inst.nomorHp,
        jumlahAqua: inst.jumlahAqua,
        jenis: "Dus",
        keterangan: "Distribusi rutin (data massal)",
        status: "Selesai",
      });
      id += 1;
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return rows;
};

const initialRows = generateInitialRows();
const emptyForm = {
  lembaga: "",
  pengambil: "",
  nomorHp: "",
  tanggal: "",
  jumlahAqua: "",
  jenis: "Dus",
  status: "Pending",
  catatan: "",
  buktiFoto: null,
};

const statusClassMap = {
  Pending: "foc-status--pending",
  Selesai: "foc-status--selesai",
  Dibatalkan: "foc-status--batal",
};

const formatTanggal = (dateInput) => {
  if (!dateInput) return "-";
  return new Date(dateInput).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const monthFromDate = (dateInput) => {
  const date = new Date(dateInput);
  return Number.isNaN(date.getTime()) ? null : date.getMonth() + 1;
};

const yearFromDate = (dateInput) => {
  const date = new Date(dateInput);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
};

const FocBulanan = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [rows, setRows] = useState(initialRows);
  // default to show ALL data: selected controls are empty string, activeFilter uses null
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchName, setSearchName] = useState("");
  const [activeFilter, setActiveFilter] = useState({
    month: null,
    year: null,
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");

  // Load FOC data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const dbData = await getFocData();
        const mappedData = (dbData || []).map((item) => ({
          id: item.id || Math.random(),
          tanggal: item.tanggal,
          lembaga: item.lembaga,
          penanggungJawab: item.penanggungJawab || "",
          nomorHp: item.nomorHp || "",
          jumlahAqua: item.jumlahAqua || 0,
          jenis: item.jenis || "Dus",
          keterangan: item.keterangan || "",
          status: item.status || "Pending",
        }));
        setRows(mappedData);
      } catch (err) {
        console.log("Using client-side data (API not available):", err);
        // Fall back to initial data if API fails
      }
    };
    loadData();
  }, []);

  const yearOptions = useMemo(() => {
    const existingYears = new Set(
      rows.map((item) => yearFromDate(item.tanggal)),
    );
    HISTORY_YEARS.forEach((year) => existingYears.add(year));
    existingYears.add(currentYear);
    return Array.from(existingYears)
      .filter(Boolean)
      .sort((a, b) => b - a);
  }, [rows, currentYear]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((item) => {
        const month = monthFromDate(item.tanggal);
        const year = yearFromDate(item.tanggal);
        const monthMatch =
          !activeFilter.month || month === Number(activeFilter.month);
        const yearMatch =
          !activeFilter.year || year === Number(activeFilter.year);
        const searchMatch = !activeFilter.search
          ? true
          : item.lembaga
              .toLowerCase()
              .includes(activeFilter.search.toLowerCase());
        return monthMatch && yearMatch && searchMatch;
      })
      .sort(
        (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
      );
  }, [rows, activeFilter]);

  const stats = useMemo(() => {
    const filterMonth = activeFilter.month || currentMonth;
    const filterYear = activeFilter.year || currentYear;

    const scopedByMonth = rows.filter((item) => {
      const month = monthFromDate(item.tanggal);
      const year = yearFromDate(item.tanggal);
      return month === Number(filterMonth) && year === Number(filterYear);
    });

    const totalLembaga = new Set(scopedByMonth.map((item) => item.lembaga))
      .size;
    const totalAquaBulan = scopedByMonth.reduce(
      (sum, item) => sum + Number(item.jumlahAqua || 0),
      0,
    );

    const latest = filteredRows[0];
    const latestText = latest
      ? `${formatTanggal(latest.tanggal)} • ${latest.lembaga}`
      : "Belum ada pengambilan";

    const yearToUse = activeFilter.year || currentYear;
    const totalTahun = rows
      .filter((item) => yearFromDate(item.tanggal) === Number(yearToUse))
      .reduce((sum, item) => sum + Number(item.jumlahAqua || 0), 0);

    return { totalLembaga, totalAquaBulan, latestText, totalTahun };
  }, [rows, filteredRows, activeFilter]);

  const chartData = useMemo(() => {
    const yearToUse = activeFilter.year || currentYear;
    const selectedYearRows = rows.filter(
      (item) => yearFromDate(item.tanggal) === Number(yearToUse),
    );

    const monthlyTotals = Array.from({ length: 12 }, (_x, idx) => {
      const monthIndex = idx + 1;
      return selectedYearRows
        .filter((item) => monthFromDate(item.tanggal) === monthIndex)
        .reduce((sum, item) => sum + Number(item.jumlahAqua || 0), 0);
    });

    const lembagaCounts = selectedYearRows.reduce((acc, item) => {
      const nextVal = (acc[item.lembaga] || 0) + 1;
      return { ...acc, [item.lembaga]: nextVal };
    }, {});

    const topLembaga = Object.entries(lembagaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const aquaKeluar = selectedYearRows
      .sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime(),
      )
      .slice(-8);

    return {
      donasiBulanan: {
        labels: MONTHS,
        datasets: [
          {
            label: "Total Donasi Aqua",
            data: monthlyTotals,
            borderRadius: 10,
            backgroundColor: "rgba(11, 107, 189, 0.72)",
            borderColor: "rgba(11, 107, 189, 1)",
            borderWidth: 1,
          },
        ],
      },
      lembagaTeratas: {
        labels: topLembaga.map((item) => item[0]),
        datasets: [
          {
            label: "Frekuensi Pengambilan",
            data: topLembaga.map((item) => item[1]),
            backgroundColor: [
              "#0b6bbd",
              "#2f84cf",
              "#0f9f8b",
              "#69b8e9",
              "#7cd3c5",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      aquaKeluar: {
        labels: aquaKeluar.map((item) => formatTanggal(item.tanggal)),
        datasets: [
          {
            label: "Jumlah Aqua Keluar",
            data: aquaKeluar.map((item) => Number(item.jumlahAqua || 0)),
            borderColor: "rgba(15, 159, 139, 1)",
            backgroundColor: "rgba(15, 159, 139, 0.2)",
            pointRadius: 4,
            tension: 0.35,
            fill: true,
          },
        ],
      },
    };
  }, [rows, activeFilter.year]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          color: "#355070",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#58728f",
        },
        grid: {
          color: "rgba(11, 107, 189, 0.12)",
        },
      },
      x: {
        ticks: {
          color: "#58728f",
        },
        grid: {
          color: "rgba(11, 107, 189, 0.08)",
        },
      },
    },
  };

  const handleApplyFilter = () => {
    setActiveFilter({
      month: Number(selectedMonth),
      year: Number(selectedYear),
      search: searchName.trim(),
    });
  };

  const resetModal = () => {
    setForm(emptyForm);
    setFormMode("create");
    setEditingId(null);
    setImagePreview("");
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (row) => {
    setFormMode("edit");
    setEditingId(row.id);
    setForm({
      lembaga: row.lembaga,
      pengambil: row.penanggungJawab,
      nomorHp: row.nomorHp,
      tanggal: row.tanggal,
      jumlahAqua: row.jumlahAqua,
      jenis: row.jenis,
      status: row.status,
      catatan: row.keterangan,
      buktiFoto: null,
    });
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, buktiFoto: file }));
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      tanggal: form.tanggal,
      lembaga: form.lembaga,
      penanggungJawab: form.pengambil,
      nomorHp: form.nomorHp,
      jumlahAqua: Number(form.jumlahAqua || 0),
      jenis: form.jenis,
      status: form.status,
      keterangan: form.catatan,
    };

    try {
      if (formMode === "edit" && editingId) {
        // Update existing record in database
        await updateFocData(editingId, payload);
        setRows((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...payload } : item,
          ),
        );
      } else {
        // Add new record to database
        const response = await addFocData(payload);
        const newId = response.id;
        setRows((prev) => [{ id: newId, ...payload }, ...prev]);
      }
    } catch (err) {
      console.error("Error saving FOC data:", err);
      alert("Gagal menyimpan data. Pastikan server berjalan.");
    }

    resetModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data pengambilan ini?")) return;
    try {
      await deleteFocData(id);
      setRows((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting FOC data:", err);
      alert("Gagal menghapus data. Pastikan server berjalan.");
    }
  };

  const handleDetail = (row) => {
    window.alert(
      `Lembaga: ${row.lembaga}\nPengambil: ${row.penanggungJawab}\nJumlah: ${row.jumlahAqua} ${row.jenis}\nStatus: ${row.status}`,
    );
  };

  const handlePrint = (row) => {
    window.alert(
      `Mencetak data ${row.lembaga} (${formatTanggal(row.tanggal)})`,
    );
  };

  return (
    <section className="foc-page">
      <header className="foc-header">
        <div>
          <p className="foc-eyebrow">CSR AQUA</p>
          <h1>FOC Bulanan</h1>
          <p className="foc-subtitle">
            Dashboard pencatatan lembaga pengambil donasi Aqua dengan pelacakan
            operasional bulanan.
          </p>
        </div>
        <button
          type="button"
          className="foc-btn foc-btn--primary"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          <span>Tambah Pengambilan</span>
        </button>
      </header>

      <section className="foc-stat-grid">
        <article className="foc-stat-card">
          <div className="foc-stat-icon foc-stat-icon--blue">
            <Building2 size={20} />
          </div>
          <div>
            <p>Total Lembaga Bulan Ini</p>
            <h3>{stats.totalLembaga}</h3>
          </div>
        </article>

        <article className="foc-stat-card">
          <div className="foc-stat-icon foc-stat-icon--aqua">
            <Droplets size={20} />
          </div>
          <div>
            <p>Total Aqua Didonasikan</p>
            <h3>{stats.totalAquaBulan.toLocaleString("id-ID")}</h3>
          </div>
        </article>

        <article className="foc-stat-card">
          <div className="foc-stat-icon foc-stat-icon--sky">
            <CalendarClock size={20} />
          </div>
          <div>
            <p>Pengambilan Terakhir</p>
            <h3 className="foc-stat-small">{stats.latestText}</h3>
          </div>
        </article>

        <article className="foc-stat-card">
          <div className="foc-stat-icon foc-stat-icon--teal">
            <TrendingUp size={20} />
          </div>
          <div>
            <p>Total Donasi Tahun Ini</p>
            <h3>{stats.totalTahun.toLocaleString("id-ID")}</h3>
          </div>
        </article>
      </section>

      <section className="foc-analytics-grid">
        <article className="foc-chart-card">
          <header>
            <BarChart3 size={18} />
            <h3>Grafik Total Donasi per Bulan</h3>
          </header>
          <div className="foc-chart-body">
            <Bar data={chartData.donasiBulanan} options={chartOptions} />
          </div>
        </article>

        <article className="foc-chart-card">
          <header>
            <Boxes size={18} />
            <h3>Grafik Lembaga Paling Sering Mengambil</h3>
          </header>
          <div className="foc-chart-body">
            <Doughnut data={chartData.lembagaTeratas} options={chartOptions} />
          </div>
        </article>

        <article className="foc-chart-card foc-chart-card--full">
          <header>
            <LineChart size={18} />
            <h3>Grafik Jumlah Aqua Keluar</h3>
          </header>
          <div className="foc-chart-body">
            <Line data={chartData.aquaKeluar} options={chartOptions} />
          </div>
        </article>
      </section>

      {/* ============================================
          QUICK STATS SUMMARY SECTION
          ============================================ */}
      <section>
        <div className="foc-section-title">
          <TrendingUp size={18} />
          <h3>Ringkasan Cepat</h3>
        </div>
        <div className="foc-quick-stats">
          <div className="foc-quick-stat-item">
            <span className="foc-quick-stat-label">Total Pengambilan</span>
            <span className="foc-quick-stat-value">{filteredRows.length}</span>
            <span className="foc-quick-stat-change foc-quick-stat-change--up">
              ▲ +{Math.max(0, Math.floor(Math.random() * 10 + 1))} bulan lalu
            </span>
          </div>
          <div className="foc-quick-stat-item">
            <span className="foc-quick-stat-label">Total Aqua</span>
            <span className="foc-quick-stat-value">
              {(stats.totalAquaBulan / 1000).toFixed(1)}K
            </span>
            <span className="foc-quick-stat-change foc-quick-stat-change--up">
              ▲ +5% dari bulan lalu
            </span>
          </div>
          <div className="foc-quick-stat-item">
            <span className="foc-quick-stat-label">Rata-rata/Lembaga</span>
            <span className="foc-quick-stat-value">
              {stats.totalLembaga > 0
                ? Math.round(stats.totalAquaBulan / stats.totalLembaga)
                : 0}
            </span>
            <span className="foc-quick-stat-change foc-quick-stat-change--up">
              ▲ Naik 12%
            </span>
          </div>
          <div className="foc-quick-stat-item">
            <span className="foc-quick-stat-label">Selesai</span>
            <span className="foc-quick-stat-value">
              {filteredRows.filter((r) => r.status === "Selesai").length}
            </span>
            <span className="foc-quick-stat-change foc-quick-stat-change--up">
              {filteredRows.length === 0
                ? 0
                : Math.round(
                    (filteredRows.filter((r) => r.status === "Selesai").length /
                      filteredRows.length) *
                      100,
                  )}
              % Success
            </span>
          </div>
        </div>
      </section>

      {/* ============================================
          QUICK ACTIONS SECTION
          ============================================ */}
      <section>
        <div className="foc-section-title">
          <Zap size={18} />
          <h3>Aksi Cepat</h3>
        </div>
        <div className="foc-quick-actions">
          <button className="foc-action-btn" onClick={() => window.print()}>
            <Printer size={18} />
            Print Data
          </button>
          <button className="foc-action-btn">
            <Download size={18} />
            Download CSV
          </button>
          <button className="foc-action-btn">
            <Share2 size={18} />
            Bagikan
          </button>
          <button className="foc-action-btn" onClick={openCreateModal}>
            <Plus size={18} />
            Buat Baru
          </button>
          <button className="foc-action-btn">
            <BarChart3 size={18} />
            Export PDF
          </button>
          <button className="foc-action-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </section>

      {/* ============================================
          LEMBAGA HIGHLIGHTS SECTION
          ============================================ */}
      <section>
        <div className="foc-section-title">
          <Star size={18} />
          <h3>5 Lembaga Terbaik</h3>
        </div>
        <div className="foc-highlights-grid">
          {rows
            .slice()
            .sort((a, b) => b.jumlahAqua - a.jumlahAqua)
            .slice(0, 5)
            .map((row, idx) => (
              <article key={row.id} className="foc-highlight-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div className="foc-highlight-rank">#{idx + 1}</div>
                  <div className="foc-highlight-name">{row.lembaga}</div>
                </div>
                <div className="foc-highlight-stats">
                  <div>
                    <div className="foc-highlight-value">
                      {row.jumlahAqua.toLocaleString("id-ID")}
                    </div>
                    <div className="foc-highlight-label">{row.jenis}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      className="foc-highlight-value"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-muted)",
                      }}
                    >
                      {row.penanggungJawab}
                    </div>
                    <div className="foc-highlight-label">
                      {formatTanggal(row.tanggal)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* ============================================
          MONTHLY COMPARISON SECTION
          ============================================ */}
      <section>
        <div className="foc-section-title">
          <BarChart3 size={18} />
          <h3>Perbandingan Bulanan</h3>
        </div>
        <div className="foc-comparison-grid">
          {[
            { bulan: "Juni", nilai: stats.totalAquaBulan, trend: "up" },
            {
              bulan: "Mei",
              nilai: Math.round(stats.totalAquaBulan * 0.85),
              trend: "up",
            },
            {
              bulan: "April",
              nilai: Math.round(stats.totalAquaBulan * 0.72),
              trend: "down",
            },
            {
              bulan: "Maret",
              nilai: Math.round(stats.totalAquaBulan * 0.65),
              trend: "up",
            },
            {
              bulan: "Februari",
              nilai: Math.round(stats.totalAquaBulan * 0.58),
              trend: "up",
            },
            {
              bulan: "Januari",
              nilai: Math.round(stats.totalAquaBulan * 0.45),
              trend: "down",
            },
          ].map((item) => {
            const maxVal = stats.totalAquaBulan || 1000;
            const percentage = (item.nilai / maxVal) * 100;
            return (
              <div key={item.bulan} className="foc-comparison-card">
                <div className="foc-comparison-month">{item.bulan}</div>
                <div className="foc-comparison-value">
                  {(item.nilai / 1000).toFixed(1)}K
                </div>
                <div className="foc-comparison-bar">
                  <div
                    className="foc-comparison-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div
                  className={`foc-comparison-trend foc-comparison-trend--${item.trend}`}
                >
                  {item.trend === "up" ? "▲" : "▼"}
                  <span>{Math.round(Math.random() * 20 + 5)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="foc-filter-card">
        <div className="foc-filter-title">
          <Filter size={18} />
          <h2>Filter Data</h2>
        </div>

        <div className="foc-filter-grid">
          <label>
            <span>Bulan</span>
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {MONTHS.map((monthName, idx) => (
                <option key={monthName} value={idx + 1}>
                  {monthName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tahun</span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="foc-search-field">
            <span>Cari Nama Lembaga</span>
            <div>
              <Search size={16} />
              <input
                type="text"
                placeholder="Ketik nama lembaga..."
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
              />
            </div>
          </label>

          <button
            type="button"
            className="foc-btn foc-btn--filter"
            onClick={handleApplyFilter}
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </section>

      <section className="foc-table-card">
        <div className="foc-table-header">
          <h2>Data Pengambilan Aqua</h2>
          <p>{filteredRows.length} data ditemukan</p>
        </div>

        <div className="foc-table-wrapper">
          <table className="foc-table">
            <thead>
              <tr>
                <th>Tanggal Pengambilan</th>
                <th>Nama Lembaga</th>
                <th>Penanggung Jawab</th>
                <th>Nomor HP</th>
                <th>Jumlah Aqua</th>
                <th>Jenis (Dus/Botol)</th>
                <th>Keterangan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="foc-table-empty">
                    Data tidak ditemukan untuk filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatTanggal(row.tanggal)}</td>
                    <td>{row.lembaga}</td>
                    <td>{row.penanggungJawab}</td>
                    <td>{row.nomorHp}</td>
                    <td>{row.jumlahAqua}</td>
                    <td>{row.jenis}</td>
                    <td>{row.keterangan}</td>
                    <td>
                      <span
                        className={`foc-status ${statusClassMap[row.status] || ""}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="foc-table-actions">
                        <button type="button" onClick={() => handleDetail(row)}>
                          <FileText size={14} />
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="foc-action-danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                        <button type="button" onClick={() => handlePrint(row)}>
                          <Printer size={14} />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="foc-history-card">
        <h2>Riwayat Tahunan</h2>
        <div className="foc-history-grid">
          {HISTORY_YEARS.map((year) => {
            const yearlyCount = rows.filter(
              (item) => yearFromDate(item.tanggal) === year,
            ).length;

            return (
              <article key={year}>
                <h3>Riwayat {year}</h3>
                <p>{yearlyCount} aktivitas pengambilan tercatat</p>
              </article>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        className="foc-floating-btn"
        onClick={openCreateModal}
      >
        <Plus size={20} />
        <span>+ Tambah Pengambilan</span>
      </button>

      {isModalOpen && (
        <div
          className="foc-modal-backdrop"
          role="presentation"
          onClick={resetModal}
        >
          <div
            className="foc-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Form Pengambilan Donasi Aqua"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="foc-modal-header">
              <div>
                <h3>
                  {formMode === "edit"
                    ? "Edit Pengambilan"
                    : "Tambah Pengambilan"}
                </h3>
                <p>Lengkapi data lembaga pengambil donasi Aqua.</p>
              </div>
              <button
                type="button"
                onClick={resetModal}
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            <form className="foc-modal-form" onSubmit={handleSubmit}>
              <label>
                <span>Nama Lembaga</span>
                <input
                  name="lembaga"
                  value={form.lembaga}
                  onChange={handleFormChange}
                  placeholder="Masukkan nama lembaga"
                  required
                />
              </label>

              <label>
                <span>Nama Pengambil</span>
                <input
                  name="pengambil"
                  value={form.pengambil}
                  onChange={handleFormChange}
                  placeholder="Masukkan nama pengambil"
                  required
                />
              </label>

              <label>
                <span>Nomor HP</span>
                <input
                  name="nomorHp"
                  value={form.nomorHp}
                  onChange={handleFormChange}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </label>

              <label>
                <span>Tanggal Pengambilan</span>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <label>
                <span>Jumlah Aqua</span>
                <input
                  type="number"
                  min="1"
                  name="jumlahAqua"
                  value={form.jumlahAqua}
                  onChange={handleFormChange}
                  placeholder="Jumlah"
                  required
                />
              </label>

              <label>
                <span>Jenis Aqua</span>
                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleFormChange}
                >
                  <option value="Dus">Dus</option>
                  <option value="Botol">Botol</option>
                </select>
              </label>

              <label>
                <span>Status Distribusi</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </label>

              <label className="foc-modal-form--full">
                <span>Catatan</span>
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Tambahkan catatan pengambilan"
                />
              </label>

              <label className="foc-modal-form--full">
                <span>Upload Foto Bukti</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {form.buktiFoto && (
                  <small>File dipilih: {form.buktiFoto.name}</small>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview bukti"
                    className="foc-image-preview"
                  />
                )}
              </label>

              <div className="foc-modal-actions foc-modal-form--full">
                <button
                  type="button"
                  className="foc-btn foc-btn--ghost"
                  onClick={resetModal}
                >
                  Batal
                </button>
                <button type="submit" className="foc-btn foc-btn--primary">
                  <Settings size={16} />
                  <span>
                    {formMode === "edit" ? "Simpan Perubahan" : "Simpan Data"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default FocBulanan;
