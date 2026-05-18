import type { ExportColumn } from "./types";

function cellValue<T extends object>(row: T, col: ExportColumn<T>): string {
  if (col.format) return col.format(row);
  const value = row[col.key];
  if (value == null) return "";
  return String(value);
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadBlob(content: Blob, filename: string) {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv<T extends object>(
  rows: T[],
  columns: ExportColumn<T>[],
  filename: string
) {
  const header = columns.map((c) => escapeCsv(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsv(cellValue(row, c))).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + header + "\n" + body], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function exportToExcel<T extends object>(
  rows: T[],
  columns: ExportColumn<T>[],
  filename: string
) {
  const th = columns.map((c) => `<th>${c.label}</th>`).join("");
  const trs = rows
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${cellValue(row, c)}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${th}</tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  downloadBlob(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}
