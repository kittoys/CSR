import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  X,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Table,
  RotateCcw,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import "./WidgetSettings.css";

const WidgetSettings = ({ isOpen, onClose }) => {
  const {
    widgets,
    toggleWidget,
    resetToDefaults,
    isWidgetVisible,
  } = useDashboard();

  const widgetOptions = [
    {
      key: "statsCards",
      label: "Statistik Cards",
      description: "Tampilkan ringkasan statistik di dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "barChart",
      label: "Grafik Bar",
      description: "Tampilkan grafik tren budget per bulan",
      icon: BarChart3,
    },
    {
      key: "donutChart",
      label: "Grafik Donat",
      description: "Tampilkan distribusi status proposal",
      icon: PieChart,
    },
    {
      key: "dataTable",
      label: "Tabel Data",
      description: "Tampilkan tabel daftar proposal",
      icon: Table,
    },
  ];

  const visibleCount = Object.values(widgets).filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="widget-settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="widget-settings-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="widget-settings-header">
              <div className="widget-settings-title-group">
                <div className="widget-settings-icon">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="widget-settings-title">Pengaturan Widget</h2>
                  <p className="widget-settings-subtitle">
                    {visibleCount} dari {widgetOptions.length} widget aktif
                  </p>
                </div>
              </div>
              <button className="widget-settings-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="widget-settings-content">
              <div className="widget-settings-list">
                {widgetOptions.map((widget, index) => {
                  const Icon = widget.icon;
                  const isVisible = isWidgetVisible(widget.key);

                  return (
                    <motion.div
                      key={widget.key}
                      className={`widget-settings-item ${
                        isVisible ? "is-visible" : ""
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="widget-settings-item-info">
                        <div
                          className={`widget-settings-item-icon ${
                            isVisible ? "is-visible" : ""
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="widget-settings-item-label">
                            {widget.label}
                          </span>
                          <p className="widget-settings-item-description">
                            {widget.description}
                          </p>
                        </div>
                      </div>
                      <label className="widget-settings-toggle">
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleWidget(widget.key)}
                        />
                        <span className="widget-settings-toggle-slider"></span>
                      </label>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="widget-settings-footer">
              <button
                className="widget-settings-reset"
                onClick={resetToDefaults}
                disabled={visibleCount === widgetOptions.length}
              >
                <RotateCcw size={16} />
                <span>Reset ke Default</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WidgetSettings;
