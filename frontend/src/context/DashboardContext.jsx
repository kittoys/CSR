import React, { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext(null);

const DASHBOARD_SETTINGS_KEY = "csr:dashboardSettings";

const defaultSettings = {
  widgets: {
    statsCards: true,
    barChart: true,
    donutChart: true,
    dataTable: true,
  },
  chartSettings: {
    showBudgetLabels: true,
    showLegend: true,
    enableAnimations: true,
  },
  tableSettings: {
    itemsPerPage: 10,
    showPagination: true,
    compactMode: false,
  },
};

export const DashboardProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(DASHBOARD_SETTINGS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure all keys exist
          return {
            widgets: { ...defaultSettings.widgets, ...parsed.widgets },
            chartSettings: { ...defaultSettings.chartSettings, ...parsed.chartSettings },
            tableSettings: { ...defaultSettings.tableSettings, ...parsed.tableSettings },
          };
        } catch (e) {
          console.error("Failed to parse dashboard settings:", e);
        }
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleWidget = (widgetName) => {
    setSettings((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetName]: !prev.widgets[widgetName],
      },
    }));
  };

  const showWidget = (widgetName) => {
    setSettings((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetName]: true,
      },
    }));
  };

  const hideWidget = (widgetName) => {
    setSettings((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetName]: false,
      },
    }));
  };

  const updateChartSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      chartSettings: {
        ...prev.chartSettings,
        ...newSettings,
      },
    }));
  };

  const updateTableSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      tableSettings: {
        ...prev.tableSettings,
        ...newSettings,
      },
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const isWidgetVisible = (widgetName) => {
    return settings.widgets[widgetName] ?? true;
  };

  const value = {
    settings,
    widgets: settings.widgets,
    chartSettings: settings.chartSettings,
    tableSettings: settings.tableSettings,
    toggleWidget,
    showWidget,
    hideWidget,
    updateChartSettings,
    updateTableSettings,
    resetToDefaults,
    isWidgetVisible,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default DashboardContext;
