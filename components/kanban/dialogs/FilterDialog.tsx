"use client";

import { useEffect, useState } from "react";
import type { Column } from "@/lib/kanban/types";
import type { KanbanFilters } from "@/lib/kanban/filters";
import { EMPTY_KANBAN_FILTERS, KANBAN_MEMBERS, KANBAN_TAG_LIST } from "@/lib/kanban/filters";
import styles from "@/styles/kanban-dialog.module.scss";

type Props = {
  open: boolean;
  columns: Column[];
  filters: KanbanFilters;
  onClose: () => void;
  onApply: (filters: KanbanFilters) => void;
  accentColor: string;
  language: "tr" | "en";
};

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FilterDialog({
  open,
  columns,
  filters,
  onClose,
  onApply,
  accentColor,
  language,
}: Props) {
  const [draft, setDraft] = useState<KanbanFilters>(EMPTY_KANBAN_FILTERS);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  if (!open) return null;

  const tr = language === "tr";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft(EMPTY_KANBAN_FILTERS);
    onApply(EMPTY_KANBAN_FILTERS);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${styles.dialog} ${styles.dialogFilter}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-dialog-title"
      >
        <div className={styles.header}>
          <h2 id="filter-dialog-title" className={styles.title}>
            {tr ? "Filtrele" : "Filter"}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div>
              <label className={styles.label} htmlFor="filter-search">
                {tr ? "Arama" : "Search"}
              </label>
              <input
                id="filter-search"
                className={styles.input}
                placeholder={tr ? "Kart başlığı veya açıklama..." : "Card title or description..."}
                value={draft.search}
                onChange={(e) => setDraft((p) => ({ ...p, search: e.target.value }))}
              />
            </div>

            <div>
              <span className={styles.label}>{tr ? "Atanan kişi" : "Assignee"}</span>
              <div className={styles.filterOptions}>
                {KANBAN_MEMBERS.map((m) => {
                  const active = draft.memberInitials.includes(m.initials);
                  return (
                    <button
                      key={m.initials}
                      type="button"
                      className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""}`}
                      style={active ? { borderColor: accentColor, color: accentColor } : undefined}
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          memberInitials: toggleInList(p.memberInitials, m.initials),
                        }))
                      }
                    >
                      <span className={styles.filterOptionAvatar} style={{ background: m.bg }}>
                        {m.initials}
                      </span>
                      {m.name ?? m.initials}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className={styles.label}>{tr ? "Etiket" : "Tag"}</span>
              <div className={styles.filterOptions}>
                {KANBAN_TAG_LIST.map((t) => {
                  const active = draft.tagLabels.includes(t.label);
                  return (
                    <button
                      key={t.label}
                      type="button"
                      className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""}`}
                      style={
                        active
                          ? { background: t.bg, color: t.color, borderColor: t.color }
                          : undefined
                      }
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          tagLabels: toggleInList(p.tagLabels, t.label),
                        }))
                      }
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className={styles.label}>{tr ? "Sütun" : "Column"}</span>
              <div className={styles.filterOptions}>
                {columns.map((col) => {
                  const active = draft.columnIds.includes(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      className={`${styles.filterOption} ${active ? styles.filterOptionActive : ""}`}
                      style={active ? { borderColor: col.accentColor, color: col.accentColor } : undefined}
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          columnIds: toggleInList(p.columnIds, col.id),
                        }))
                      }
                    >
                      <span
                        className={styles.filterOptionDot}
                        style={{ background: col.accentColor }}
                      />
                      {col.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={handleClear}>
              {tr ? "Temizle" : "Clear"}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                {tr ? "İptal" : "Cancel"}
              </button>
              <button type="submit" className={styles.submitBtn} style={{ background: accentColor }}>
                {tr ? "Uygula" : "Apply"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
