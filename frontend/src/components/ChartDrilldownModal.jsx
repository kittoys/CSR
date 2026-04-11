import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Package, DollarSign, Building2, User } from "lucide-react";
import "./ChartDrilldownModal.css";

const ChartDrilldownModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  proposals,
  type, // 'month' or 'status'
  monthLabel,
  status,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const stats = useMemo(() => {
    if (!proposals?.length) return { count: 0, totalBudget: 0 };
    return {
      count: proposals.length,
      totalBudget: proposals.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
    };
  }, [proposals]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drilldown-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="drilldown-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="drilldown-header">
              <div className="drilldown-header-content">
                <div className="drilldown-icon">
                  {type === "month" ? (
                    <Calendar size={24} />
                  ) : (
                    <Package size={24} />
                  )}
                </div>
                <div className="drilldown-title-group">
                  <h2 className="drilldown-title">{title}</h2>
                  {subtitle && <p className="drilldown-subtitle">{subtitle}</p>}
                </div>
              </div>
              <button className="drilldown-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="drilldown-stats">
              <div className="drilldown-stat">
                <div className="drilldown-stat-icon">
                  <Package size={18} />
                </div>
                <div className="drilldown-stat-content">
                  <span className="drilldown-stat-label">Total Proposals</span>
                  <span className="drilldown-stat-value">{stats.count}</span>
                </div>
              </div>
              <div className="drilldown-stat">
                <div className="drilldown-stat-icon">
                  <DollarSign size={18} />
                </div>
                <div className="drilldown-stat-content">
                  <span className="drilldown-stat-label">Total Budget</span>
                  <span className="drilldown-stat-value">
                    {formatCurrency(stats.totalBudget)}
                  </span>
                </div>
              </div>
            </div>

            {/* Proposals List */}
            <div className="drilldown-content">
              {proposals?.length > 0 ? (
                <div className="drilldown-list">
                  {proposals.map((proposal, index) => (
                    <motion.div
                      key={proposal.id}
                      className="drilldown-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="drilldown-item-header">
                        <div className="drilldown-item-info">
                          <span className="drilldown-item-case">
                            {proposal.case_id}
                          </span>
                          <h3 className="drilldown-item-name">
                            {proposal.proposal_name}
                          </h3>
                        </div>
                        <span
                          className={`drilldown-item-status ${getStatusClass(
                            proposal.status
                          )}`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      <div className="drilldown-item-details">
                        <div className="drilldown-item-detail">
                          <Building2 size={14} />
                          <span>{proposal.organization}</span>
                        </div>
                        <div className="drilldown-item-detail">
                          <User size={14} />
                          <span>{proposal.pic_name}</span>
                        </div>
                        <div className="drilldown-item-detail">
                          <Calendar size={14} />
                          <span>{formatDate(proposal.proposal_date)}</span>
                        </div>
                      </div>

                      <div className="drilldown-item-footer">
                        <span className="drilldown-item-budget">
                          {formatCurrency(proposal.budget)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="drilldown-empty">
                  <Package size={48} />
                  <p>Tidak ada proposal untuk {type === "month" ? "bulan ini" : "status ini"}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="drilldown-footer">
              <button className="drilldown-btn-close" onClick={onClose}>
                Tutup
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChartDrilldownModal;
