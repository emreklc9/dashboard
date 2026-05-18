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

function ProgressRing({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className={styles.progressRing}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border-color, #e2e8f0)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.progressRingText}>
        {current}/{total}
      </span>
    </div>
  );
}

export default function ExpandableTable() {
  const { language } = useApp();
  const tr = language === "tr";
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
            <div key={u.label} className={styles.usageCell}>
              <div className={styles.usageLabel}>{u.label}</div>
              <div className={styles.usageBar}>
                {u.segments.map((seg, i) => (
                  <div
                    key={i}
                    className={styles.usageBarSegment}
                    style={{ width: `${seg.percent}%`, background: seg.color }}
                  />
                ))}
              </div>
              <div className={styles.usageText}>
                {u.used} / {u.total}
              </div>
            </div>
          ))}

          <ProgressRing current={row.progress.current} total={row.progress.total} />
          <StatusBadge status={row.status} language={language} />
          <div onClick={(e) => e.stopPropagation()}>
            <TableActions language={language} />
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
                <div />
                <StatusBadge status={child.status} language={language} />
                <TableActions language={language} />
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
        <span>{tr ? "Kullanım 1" : "Usage 1"}</span>
        <span>{tr ? "Kullanım 2" : "Usage 2"}</span>
        <span>{tr ? "Kota" : "Quota"}</span>
        <span>{tr ? "Durum" : "Status"}</span>
        <span>{tr ? "İşlemler" : "Actions"}</span>
        <span />
      </div>

      <div className={styles.list}>{EXPANDABLE_ROWS.map(renderRow)}</div>
    </div>
  );
}
