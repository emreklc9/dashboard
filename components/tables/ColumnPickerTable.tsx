"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { DATA_GRID_ROWS } from "@/lib/tables/mockData";
import { exportToCsv, exportToExcel } from "@/lib/tables/export";
import type { DataGridRow, ExportColumn, TableStatus } from "@/lib/tables/types";
import TableActions from "./TableActions";
import shared from "@/styles/tables/shared.module.scss";
import styles from "@/styles/tables/column-picker.module.scss";

type ColDef = {
  key: keyof DataGridRow;
  label: { tr: string; en: string };
  primary?: boolean;
  mono?: boolean;
};

const ALL_COLUMNS: ColDef[] = [
  { key: "id", label: { tr: "ID", en: "ID" }, mono: true },
  { key: "domain", label: { tr: "Alan adı", en: "Domain" }, primary: true },
  { key: "customer", label: { tr: "Müşteri", en: "Customer" } },
  { key: "plan", label: { tr: "Plan", en: "Plan" } },
  { key: "region", label: { tr: "Bölge", en: "Region" } },
  { key: "storage", label: { tr: "Depolama", en: "Storage" } },
  { key: "bandwidth", label: { tr: "Bant genişliği", en: "Bandwidth" } },
  { key: "visitors", label: { tr: "Ziyaretçi", en: "Visitors" } },
  { key: "ssl", label: { tr: "SSL", en: "SSL" } },
  { key: "renews", label: { tr: "Yenileme", en: "Renews" } },
  { key: "status", label: { tr: "Durum", en: "Status" } },
];

const DEFAULT_VISIBLE: (keyof DataGridRow)[] = [
  "domain",
  "customer",
  "plan",
  "region",
  "storage",
  "bandwidth",
  "status",
];

function StatusBadge({ status, language }: { status: TableStatus; language: "tr" | "en" }) {
  const labels = {
    tr: { active: "Aktif", inactive: "Pasif", pending: "Bekliyor" },
    en: { active: "Active", inactive: "Inactive", pending: "Pending" },
  };
  const cls =
    status === "active"
      ? shared.statusActive
      : status === "pending"
        ? shared.statusPending
        : shared.statusInactive;
  return <span className={`${shared.statusBadge} ${cls}`}>{labels[language][status]}</span>;
}

export default function ColumnPickerTable() {
  const { language, accent } = useApp();
  const tr = language === "tr";
  const [visibleKeys, setVisibleKeys] = useState<Set<keyof DataGridRow>>(
    () => new Set(DEFAULT_VISIBLE)
  );
  const [showColumns, setShowColumns] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const ACCENT_COLORS: Record<string, string> = { red: "#c41e3a", green: "#2e8b57", blue: "#005eb8" };
  const accentColor = ACCENT_COLORS[accent] ?? "#005eb8";

  const visibleColumns = useMemo(
    () => ALL_COLUMNS.filter((c) => visibleKeys.has(c.key)),
    [visibleKeys]
  );

  const exportColumns: ExportColumn<DataGridRow>[] = useMemo(
    () =>
      visibleColumns.map((c) => ({
        key: c.key,
        label: c.label[language],
        format:
          c.key === "status"
            ? (row) =>
                tr
                  ? { active: "Aktif", inactive: "Pasif", pending: "Bekliyor" }[row.status]
                  : { active: "Active", inactive: "Inactive", pending: "Pending" }[row.status]
            : undefined,
      })),
    [visibleColumns, language, tr]
  );

  useEffect(() => {
    if (!showColumns) return;
    const close = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowColumns(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showColumns]);

  const toggleColumn = (key: keyof DataGridRow) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderCell = (row: DataGridRow, col: ColDef) => {
    if (col.key === "status") {
      return <StatusBadge status={row.status} language={language} />;
    }
    const value = row[col.key];
    const className = [col.primary && styles.cellPrimary, col.mono && styles.cellMono]
      .filter(Boolean)
      .join(" ");
    return <span className={className || undefined}>{String(value)}</span>;
  };

  return (
    <div className={shared.card}>
      <div className={shared.cardHeader}>
        <div>
          <h2 className={shared.cardTitle}>{tr ? "Veri Tablosu" : "Data Table"}</h2>
          <p className={shared.cardMeta}>
            {DATA_GRID_ROWS.length} {tr ? "kayıt" : "records"} · {visibleColumns.length}{" "}
            {tr ? "sütun görünüyor" : "columns visible"}
          </p>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.columnPanel} ref={panelRef}>
            <button
              type="button"
              className={styles.toolbarBtn}
              onClick={() => setShowColumns((v) => !v)}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              {tr ? "Sütunlar" : "Columns"}
            </button>
            {showColumns && (
              <div className={styles.columnDropdown}>
                {ALL_COLUMNS.map((col) => (
                  <label key={col.key} className={styles.columnOption}>
                    <input
                      type="checkbox"
                      checked={visibleKeys.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                    />
                    {col.label[language]}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className={styles.toolbarBtn}
            onClick={() => exportToCsv(DATA_GRID_ROWS, exportColumns, "veri-tablosu")}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            CSV
          </button>
          <button
            type="button"
            className={styles.toolbarBtn}
            style={{ borderColor: accentColor, color: accentColor }}
            onClick={() => exportToExcel(DATA_GRID_ROWS, exportColumns, "veri-tablosu")}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col.key}>{col.label[language]}</th>
              ))}
              <th className={styles.actionsCol}>{tr ? "İşlemler" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {DATA_GRID_ROWS.map((row) => (
              <tr key={row.id}>
                {visibleColumns.map((col) => (
                  <td key={col.key}>{renderCell(row, col)}</td>
                ))}
                <td className={styles.actionsCol}>
                  <TableActions language={language} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
