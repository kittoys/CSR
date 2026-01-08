export const generatePrintChartHTML = (
  stats,
  monthlyStats,
  getFilterLabel,
  formatCurrency
) => {
  const statsGrid = document.querySelector(".stats-grid");
  const chartCard = document.querySelector(".chart-card--bar");
  const donutCard = document.querySelector(".chart-card--donut");

  return `
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
          .stat-box:nth-child(1) {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: #fbbf24;
          }
          .stat-box:nth-child(2) {
            background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
            border-color: #f472b6;
          }
          .stat-box:nth-child(3) {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-color: #60a5fa;
          }
          .stat-box:nth-child(4) {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-color: #34d399;
          }
          .stat-box:nth-child(5) {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border-color: #a78bfa;
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
          .bar-stack--budget {
            background: linear-gradient(180deg, #cffafe 0%, #e0f2fe 100%);
            border: 2px solid #22d3ee;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bar-segment {
            width: 100%;
            min-height: 2px;
          }
          .segment-budget {
            background: linear-gradient(180deg, #0c4a6e 0%, #0891b2 30%, #06b6d4 60%, #67e8f9 100%);
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
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
          .bar-budget {
            font-size: 9px;
            font-weight: 700;
            color: #0c4a6e;
            text-align: center;
            padding: 3px 5px;
            background: linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%);
            border: 1px solid #22d3ee;
            border-radius: 4px;
            margin-top: 4px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .chart-budget-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            margin-bottom: 8px;
            padding: 6px 12px;
            background: linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%);
            border: 1.5px solid #22d3ee;
            border-radius: 8px;
            font-size: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .budget-label {
            color: #0891b2;
            font-weight: 700;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .budget-value {
            color: #0c4a6e;
            font-weight: 800;
            font-size: 10px;
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
          
          /* Charts Grid Layout */
          .charts-grid {
            display: grid;
            grid-template-columns: 1.8fr 1fr;
            gap: 12px;
            margin-bottom: 15px;
          }
          
          /* Donut Chart Styles */
          .donut-section {
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            background: white;
            display: flex;
            flex-direction: column;
          }
          
          .donut-chart-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 15px;
          }
          
          .donut-chart {
            width: 180px;
            height: 180px;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
          
          .donut-segment {
            transition: none;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .donut-segment--progress {
            fill: #fbbf24;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .donut-segment--waiting {
            fill: #60a5fa;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .donut-segment--done {
            fill: #34d399;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .donut-total-label {
            font-size: 11px;
            fill: #6b7280;
            font-weight: 700;
          }
          
          .donut-total-value {
            font-size: 24px;
            fill: #1f2937;
            font-weight: 900;
          }
          
          .donut-legend {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          
          .donut-legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .donut-legend-dot {
            width: 14px;
            height: 14px;
            border-radius: 3px;
            flex-shrink: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .donut-legend-dot--progress {
            background: #fbbf24;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .donut-legend-dot--waiting {
            background: #60a5fa;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .donut-legend-dot--done {
            background: #34d399;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .donut-legend-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
          }
          
          .donut-legend-label {
            font-size: 9px;
            color: #4b5563;
            font-weight: 600;
          }
          
          .donut-legend-value {
            display: flex;
            align-items: baseline;
            gap: 6px;
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
          }
          
          .donut-legend-percent {
            font-size: 10px;
            color: #6b7280;
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

          <div class="charts-grid">
            <div class="chart-section">
              <div class="chart-title">Tren Budget Per Bulan</div>
              <div class="chart-subtitle">Total budget proposal per bulan</div>
              ${
                stats && stats.total_budget > 0
                  ? `<div class="chart-budget-badge">
                      <span class="budget-label">Total Budget:</span>
                      <span class="budget-value">${formatCurrency(
                        stats.total_budget
                      )}</span>
                    </div>`
                  : ""
              }

              ${
                chartCard
                  ? chartCard.querySelector(".chart-body")?.outerHTML ||
                    '<p style="text-align:center;padding:20px;color:#9ca3af;">Tidak ada data chart</p>'
                  : '<p style="text-align:center;padding:20px;color:#9ca3af;">Chart tidak ditemukan</p>'
              }
            </div>
            
            <div class="donut-section">
              <div class="chart-title">Distribusi Status</div>
              <div class="chart-subtitle">Persentase berdasarkan status proposal</div>
              
              ${
                donutCard
                  ? donutCard.querySelector(".chart-body")?.innerHTML ||
                    '<p style="text-align:center;padding:20px;color:#9ca3af;">Tidak ada data</p>'
                  : '<p style="text-align:center;padding:20px;color:#9ca3af;">Chart tidak ditemukan</p>'
              }
            </div>
          </div>

          <div class="chart-section" style="margin-top: 0;">
            <div class="chart-title">Detail Data Bulanan</div>
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
  `;
};
