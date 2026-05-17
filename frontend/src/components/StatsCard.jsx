import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StatsCard.css";

export default function StatsCard({ stats = {} }) {
  const items = [
    {
      key: "total",
      label: "Total Proposals",
      value: stats.total ?? 0,
      icon: "bi-archive",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: stats.inProgress ?? 0,
      icon: "bi-hourglass-split",
    },
    {
      key: "ready",
      label: "Siap Diambil",
      value: stats.ready ?? 0,
      icon: "bi-box-seam",
    },
    {
      key: "done",
      label: "Done",
      value: stats.done ?? 0,
      icon: "bi-check-circle",
    },
  ];

  const budgetItem = {
    key: "budget",
    label: "Total Budget",
    value: stats.totalBudgetFormatted || "-",
    icon: "bi-wallet2",
  };

  return (
    <div
      className="stats-card-row"
      role="region"
      aria-label="Statistik proposal ringkas"
    >
      <div className="stats-row">
        {items.map((i) => (
          <div
            key={i.key}
            className="stat-mini-card"
            tabIndex={0}
            aria-label={`${i.label}: ${i.value}`}
          >
            <div className={`mini-icon mini-icon--${i.key}`} aria-hidden>
              <i className={`bi ${i.icon} icon-svg`} aria-hidden="true"></i>
            </div>
            <div className="mini-body">
              <div className="mini-label">{i.label.toUpperCase()}</div>
              <div className="mini-value">{i.value}</div>
            </div>
          </div>
        ))}

        <div
          key={budgetItem.key}
          className="stat-mini-card stat-mini-card--budget"
          tabIndex={0}
          aria-label={`${budgetItem.label}: ${budgetItem.value}`}
        >
          <div className="mini-icon mini-icon--budget" aria-hidden>
            <i className="bi bi-wallet2 icon-svg" aria-hidden="true"></i>
          </div>
          <div className="mini-body">
            <div className="mini-label">{budgetItem.label.toUpperCase()}</div>
            <div className="mini-value">{budgetItem.value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
