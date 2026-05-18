"use client";

import { useEffect, useState } from "react";
import type { NewColumnData } from "@/lib/kanban/types";
import styles from "@/styles/kanban-dialog.module.scss";

export const COLUMN_COLOR_PRESETS = [
  "#94a3b8", "#f472b6", "#a78bfa", "#34d399",
  "#fb923c", "#38bdf8", "#f87171", "#a3e635",
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewColumnData) => void;
  accentColor: string;
  language: "tr" | "en";
};

export default function NewColumnDialog({ open, onClose, onSubmit, accentColor, language }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLUMN_COLOR_PRESETS[0]);

  useEffect(() => {
    if (open) {
      setTitle("");
      setColor(COLUMN_COLOR_PRESETS[Math.floor(Math.random() * COLUMN_COLOR_PRESETS.length)]);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, accentColor: color });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-column-title"
      >
        <div className={styles.header}>
          <h2 id="new-column-title" className={styles.title}>
            {language === "tr" ? "Yeni Sütun" : "New Column"}
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
              <label className={styles.label} htmlFor="col-title">
                {language === "tr" ? "Sütun Adı" : "Column Name"}
              </label>
              <input
                id="col-title"
                autoFocus
                className={styles.input}
                placeholder={language === "tr" ? "Örn: Test, Beklemede..." : "e.g. Testing, Waiting..."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <span className={styles.label}>
                {language === "tr" ? "Renk" : "Color"}
              </span>
              <div className={styles.colorGrid}>
                {COLUMN_COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ""}`}
                    style={{ background: c, color: c }}
                    onClick={() => setColor(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              {language === "tr" ? "İptal" : "Cancel"}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              style={{ background: accentColor }}
              disabled={!title.trim()}
            >
              {language === "tr" ? "Oluştur" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
