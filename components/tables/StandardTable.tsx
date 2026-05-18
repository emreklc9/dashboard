"use client";

import { useApp } from "@/context/AppContext";
import { STANDARD_ROWS } from "@/lib/tables/mockData";
import type { TableStatus } from "@/lib/tables/types";
import TableActions from "./TableActions";
import shared from "@/styles/tables/shared.module.scss";
import styles from "@/styles/tables/standard.module.scss";

function StatusBadge({ status, language }: { status: TableStatus; language: "tr" | "en" }) {
  const labels = {
    tr: { active: "Tamamlandı", inactive: "İptal", pending: "Bekliyor" },
    en: { active: "Completed", inactive: "Cancelled", pending: "Pending" },
  };
  const cls =
    status === "active"
      ? shared.statusActive
      : status === "pending"
        ? shared.statusPending
        : shared.statusInactive;
  return <span className={`${shared.statusBadge} ${cls}`}>{labels[language][status]}</span>;
}

export default function StandardTable() {
  const { language } = useApp();
  const tr = language === "tr";

  const headers = tr
    ? ["Sipariş", "Müşteri", "Ürün", "Tutar", "Durum", "Tarih", "İşlemler"]
    : ["Order", "Customer", "Product", "Amount", "Status", "Date", "Actions"];

  return (
    <div className={shared.card}>
      <div className={shared.cardHeader}>
        <div>
          <h2 className={shared.cardTitle}>{tr ? "Siparişler" : "Orders"}</h2>
          <p className={shared.cardMeta}>
            {STANDARD_ROWS.length} {tr ? "kayıt" : "records"}
          </p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} className={h.includes("İşlem") || h === "Actions" ? styles.actionsCol : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STANDARD_ROWS.map((row) => (
              <tr key={row.id}>
                <td className={styles.cellOrder}>{row.order}</td>
                <td className={styles.cellCustomer}>{row.customer}</td>
                <td>{row.product}</td>
                <td className={styles.cellAmount}>{row.amount}</td>
                <td>
                  <StatusBadge status={row.status} language={language} />
                </td>
                <td>{row.date}</td>
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
