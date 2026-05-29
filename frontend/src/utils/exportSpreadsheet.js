import * as XLSX from "xlsx";

const sanitizeFilename = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "export";

const resolveColumnValue = (column, row, rowIndex) => {
  if (typeof column.value === "function") {
    return column.value(row, rowIndex);
  }

  if (!column.value) {
    return "";
  }

  return row[column.value];
};

const normalizeCell = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return String(value);
};

const buildExportRows = (columns, rows) =>
  rows.map((row, rowIndex) => {
    const output = {};

    columns.forEach((column) => {
      const resolvedValue = resolveColumnValue(column, row, rowIndex);
      output[column.label] = normalizeCell(resolvedValue);
    });

    return output;
  });

const setCellStyle = (worksheet, address, style) => {
  if (!worksheet[address]) {
    worksheet[address] = { t: "s", v: "" };
  }

  worksheet[address].s = {
    ...(worksheet[address].s || {}),
    ...style,
  };
};

const mergeAcross = (startRow, endRow, columnCount) => {
  if (columnCount < 2) {
    return [];
  }

  return Array.from({ length: endRow - startRow + 1 }, (_, index) => ({
    s: { r: startRow + index, c: 1 },
    e: { r: startRow + index, c: columnCount - 1 },
  }));
};

export const exportRowsToExcel = ({
  filename,
  sheetName = "Data",
  title,
  subtitle,
  brandLabel = "CSR AQUA",
  summary = [],
  columns,
  rows,
}) => {
  const exportRows = buildExportRows(columns, rows);
  const headerRow = columns.map((column) => column.label);
  const aoa = [];

  aoa.push([brandLabel]);

  if (title) {
    aoa.push([title]);
  }

  if (subtitle) {
    aoa.push([subtitle]);
  }

  aoa.push([]);

  if (summary.length > 0) {
    aoa.push(["Ringkasan"]);
    summary.forEach((item) => {
      aoa.push([item.label, item.value]);
    });
    aoa.push([]);
  }

  aoa.push(headerRow);

  exportRows.forEach((row) => {
    aoa.push(headerRow.map((label) => row[label]));
  });

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();

  const titleRows = title ? 1 : 0;
  const subtitleRows = subtitle ? 1 : 0;
  const summaryRows = summary.length > 0 ? summary.length + 2 : 0;
  const headerRowIndex = 1 + titleRows + subtitleRows + 1 + summaryRows;
  const dataStartRowIndex = headerRowIndex + 1;

  worksheet["!cols"] = columns.map((column) => ({
    wch: Math.max(column.width || 12, column.label.length + 2),
  }));

  worksheet["!rows"] = aoa.map((row, index) => ({
    hpt:
      index === 0 ? 24 : index === 1 ? 22 : index === headerRowIndex ? 20 : 18,
  }));

  const merges = [];

  if (columns.length > 1) {
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } });

    if (title) {
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: columns.length - 1 } });
    }

    if (subtitle) {
      merges.push({ s: { r: 2, c: 0 }, e: { r: 2, c: columns.length - 1 } });
    }

    if (summary.length > 0) {
      merges.push({ s: { r: 4, c: 0 }, e: { r: 4, c: columns.length - 1 } });
      merges.push(...mergeAcross(5, 5 + summary.length - 1, columns.length));
    }
  }

  if (merges.length > 0) {
    worksheet["!merges"] = merges;
  }

  worksheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { r: headerRowIndex, c: 0 },
      e: { r: headerRowIndex + exportRows.length, c: columns.length - 1 },
    }),
  };

  setCellStyle(worksheet, "A1", {
    fill: { patternType: "solid", fgColor: { rgb: "0B6BBD" } },
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
    alignment: { horizontal: "left", vertical: "center" },
  });

  if (title) {
    setCellStyle(worksheet, "A2", {
      fill: { patternType: "solid", fgColor: { rgb: "EAF1F8" } },
      font: { bold: true, color: { rgb: "0F1E33" }, sz: 16 },
      alignment: { horizontal: "left", vertical: "center" },
    });
  }

  if (subtitle) {
    setCellStyle(worksheet, "A3", {
      fill: { patternType: "solid", fgColor: { rgb: "F4F8FC" } },
      font: { italic: true, color: { rgb: "4B5F79" }, sz: 10 },
      alignment: { horizontal: "left", vertical: "center" },
    });
  }

  if (summary.length > 0) {
    setCellStyle(worksheet, "A5", {
      fill: { patternType: "solid", fgColor: { rgb: "D7E2EE" } },
      font: { bold: true, color: { rgb: "0F1E33" }, sz: 11 },
      alignment: { horizontal: "left", vertical: "center" },
    });

    summary.forEach((item, index) => {
      const rowNumber = 6 + index;
      setCellStyle(worksheet, `A${rowNumber}`, {
        fill: {
          patternType: "solid",
          fgColor: { rgb: index % 2 === 0 ? "FFFFFF" : "F4F8FC" },
        },
        font: { bold: true, color: { rgb: "1B2B42" }, sz: 10 },
        alignment: { horizontal: "left", vertical: "center" },
      });
      setCellStyle(worksheet, `B${rowNumber}`, {
        fill: {
          patternType: "solid",
          fgColor: { rgb: index % 2 === 0 ? "FFFFFF" : "F4F8FC" },
        },
        font: { color: { rgb: "1B2B42" }, sz: 10 },
        alignment: { horizontal: "left", vertical: "center" },
      });
    });
  }

  headerRow.forEach((label, index) => {
    const address = XLSX.utils.encode_cell({ r: headerRowIndex, c: index });
    setCellStyle(worksheet, address, {
      fill: { patternType: "solid", fgColor: { rgb: "0B6BBD" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "0B6BBD" } },
        bottom: { style: "thin", color: { rgb: "0B6BBD" } },
      },
    });
  });

  for (
    let rowIndex = dataStartRowIndex;
    rowIndex < dataStartRowIndex + exportRows.length;
    rowIndex++
  ) {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
      const address = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
      setCellStyle(worksheet, address, {
        font: { sz: 10, color: { rgb: "1B2B42" } },
        alignment: { horizontal: "left", vertical: "center", wrapText: true },
      });
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${sanitizeFilename(filename)}.xlsx`);
};
