export const generatePrintTableHTML = (
  filteredProposals,
  filterStatus,
  formatCurrency,
  formatDate
) => {
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

  return `
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
};