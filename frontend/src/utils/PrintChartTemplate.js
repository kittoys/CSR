export const generatePrintChartHTML = (stats, monthlyStats, getFilterLabel, formatCurrency) => {
  const statsGrid = document.querySelector('.stats-grid');
  const chartCard = document.querySelector('.chart-card');

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
  `;
};