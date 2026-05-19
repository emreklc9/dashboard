"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EXPANDABLE_ROWS } from "@/lib/tables/mockData";
import type { ExpandableRow, TableStatus } from "@/lib/tables/types";
import TableActions from "./TableActions";
import shared from "@/styles/tables/shared.module.scss";
import styles from "@/styles/tables/expandable.module.scss";

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

export default function ExpandableTable() {
  const { language } = useApp();
  const tr = language === "tr";
  const quotaLabel = tr ? "Alan kotası" : "Subdomains";
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1"]));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderRow = (row: ExpandableRow) => {
    const isOpen = expanded.has(row.id);

    return (
      <div key={row.id} className={`${styles.rowCard} ${isOpen ? styles.expanded : ""}`}>
        <div
          className={styles.mainRow}
          onClick={() => toggle(row.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle(row.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className={styles.domainCell}>
            <div className={styles.domainIcon}>{row.domain.charAt(0).toUpperCase()}</div>
            <div className={styles.domainInfo}>
              <div className={styles.domainName}>{row.domain}</div>
              <div className={styles.domainPlan}>
                <span className={styles.planDot} />
                {row.plan}
              </div>
            </div>
          </div>

          {row.usage.map((u) => (
            <div key={u.label} className={styles.statCell}>
              <span className={styles.statLabel}>{u.label}</span>
              <span className={styles.statValue}>
                {u.used} <span className={styles.statMuted}>/ {u.total}</span>
              </span>
            </div>
          ))}

          <div className={styles.statCell}>
            <span className={styles.statLabel}>{quotaLabel}</span>
            <span className={styles.statValue}>
              {row.progress.current} / {row.progress.total}
            </span>
          </div>

          <div className={styles.mobileStats}>
            {row.usage.map((u) => (
              <span key={u.label} className={styles.mobileStatChip}>
                {u.label}: {u.used}
              </span>
            ))}
            <span className={styles.mobileStatChip}>
              {quotaLabel}: {row.progress.current}/{row.progress.total}
            </span>
          </div>

          <div className={styles.rowFooter}>
            <StatusBadge status={row.status} language={language} />
            <div onClick={(e) => e.stopPropagation()}>
              <TableActions language={language} />
            </div>
          </div>

          <button
            type="button"
            className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggle(row.id);
            }}
            aria-expanded={isOpen}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {isOpen && row.children.length > 0 && (
          <div className={styles.detailPanel}>
            {row.children.map((child) => (
              <div key={child.id} className={styles.detailRow}>
                <span className={styles.subName}>{child.name}</span>
                <div className={styles.metricCell}>
                  <span className={styles.metricDot} style={{ background: child.metricColor }} />
                  {child.metric}
                </div>
                <span className={styles.subTag} style={{ background: child.tag.bg, color: child.tag.color }}>
                  {child.tag.label}
                </span>
                <StatusBadge status={child.status} language={language} />
                <div onClick={(e) => e.stopPropagation()}>
                  <TableActions language={language} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && row.children.length === 0 && (
          <p className={styles.emptyChildren}>
            {tr ? "Alt alan adı bulunmuyor." : "No subdomains."}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={shared.card}>
      <div className={shared.cardHeader}>
        <h2 className={shared.cardTitle}>{tr ? "Açılır Alan Adları" : "Domains"}</h2>
      </div>

      <div className={styles.detailHeader}>
        <span>{tr ? "Alan adı" : "Domain"}</span>
        <span>{tr ? "Disk" : "Disk"}</span>
        <span>{tr ? "Bant" : "Bandwidth"}</span>
        <span>{quotaLabel}</span>
        <span>{tr ? "Durum" : "Status"}</span>
        <span />
      </div>

      <div className={styles.list}>{EXPANDABLE_ROWS.map(renderRow)}</div>
    </div>
  );
}
