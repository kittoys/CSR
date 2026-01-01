import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import ProgramCard from "../components/ProgramCard";
import { getPrograms } from "../api/programs";
import "./Programs.css";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPrograms();
        setPrograms(data);
      } catch (err) {
        setError("Gagal memuat data program");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = programs.map((p) => p.category_name).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [programs]);

  const statuses = ["all", "planned", "ongoing", "completed"];

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        !searchQuery ||
        program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        program.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        program.category_name === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || program.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [programs, searchQuery, selectedCategory, selectedStatus]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="programs-page">
      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="programs-header"
      >
        <div className="programs-header__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="programs-header__badge"
          >
            <TrendingUp size={16} />
            <span>Program CSR</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Jelajahi Program Kami
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="programs-header__description"
          >
            Temukan berbagai program CSR yang sedang berjalan dan telah selesai.
            Bergabunglah dalam misi kami untuk menciptakan dampak positif.
          </motion.p>
        </div>
      </motion.header>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="programs-toolbar"
      >
        <div className="programs-toolbar__container">
          {/* Search */}
          <div className="programs-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Cari program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="programs-search__input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="programs-search__clear"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`programs-filter-toggle ${showFilters ? "active" : ""}`}
          >
            <Filter size={20} />
            <span>Filter</span>
            {hasActiveFilters && <span className="filter-badge"></span>}
          </button>

          {/* View Mode Toggle */}
          <div className="programs-view-toggle">
            <button
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "active" : ""}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "active" : ""}
              aria-label="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="programs-filters"
            >
              <div className="programs-filters__content">
                {/* Category Filter */}
                <div className="filter-group">
                  <label className="filter-group__label">Kategori</label>
                  <div className="filter-group__options">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`filter-chip ${
                          selectedCategory === cat ? "active" : ""
                        }`}
                      >
                        {cat === "all" ? "Semua" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                  <label className="filter-group__label">Status</label>
                  <div className="filter-group__options">
                    {statuses.map((stat) => (
                      <button
                        key={stat}
                        onClick={() => setSelectedStatus(stat)}
                        className={`filter-chip ${
                          selectedStatus === stat ? "active" : ""
                        }`}
                      >
                        {stat === "all"
                          ? "Semua"
                          : stat === "planned"
                          ? "Direncanakan"
                          : stat === "ongoing"
                          ? "Berlangsung"
                          : "Selesai"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="filter-clear">
                    <X size={16} />
                    Hapus Semua Filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="programs-results"
      >
        <p>
          Menampilkan <strong>{filteredPrograms.length}</strong> dari{" "}
          <strong>{programs.length}</strong> program
        </p>
      </motion.div>

      {/* Content */}
      <div className="programs-content" ref={ref}>
        {loading ? (
          <div className="programs-loading">
            <Loader2 size={48} className="spin" />
            <p>Memuat program...</p>
          </div>
        ) : error ? (
          <div className="programs-error">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn--primary"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="programs-empty"
          >
            <Search size={64} />
            <h3>Tidak ada program ditemukan</h3>
            <p>Coba ubah kriteria pencarian atau filter Anda</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn btn--primary">
                Hapus Filter
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className={`programs-grid programs-grid--${viewMode}`}
          >
            {filteredPrograms.map((program, index) => (
              <ProgramCard key={program.id} program={program} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Programs;
