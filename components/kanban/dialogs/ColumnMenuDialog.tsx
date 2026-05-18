"use client";

import { useEffect, useState } from "react";
import type { Column } from "@/lib/kanban/types";
import { COLUMN_COLOR_PRESETS } from "./NewColumnDialog";
import styles from "@/styles/kanban-dialog.module.scss";

type Props = {
  open: boolean;
  column: Column | null;
  onClose: () => void;
  onSave: (data: { title: string; accentColor: string }) => void;
  onDelete: () => void;
  accentColor: string;
  language: "tr" | "en";
};

export default function ColumnMenuDialog({
  open,
  column,
  onClose,
  onSave,
  onDelete,
  accentColor,
  language,
}: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLUMN_COLOR_PRESETS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open && column) {
      setTitle(column.title);
      setColor(column.accentColor);
      setConfirmDelete(false);
    }
  }, [open, column]);

  if (!open || !column) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, accentColor: color });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            {language === "tr" ? "Sütun Ayarları" : "Column Settings"}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!confirmDelete ? (
          <form onSubmit={handleSave}>
            <div className={styles.body}>
              <div>
                <label className={styles.label} htmlFor="edit-col-title">
                  {language === "tr" ? "Sütun Adı" : "Column Name"}
                </label>
                <input
                  id="edit-col-title"
                  className={styles.input}
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

            <div className={styles.footer} style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                className={styles.cancelBtn}
                style={{ color: "#dc2626", borderColor: "#fecaca" }}
                onClick={() => setConfirmDelete(true)}
              >
                {language === "tr" ? "Sil" : "Delete"}
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                  {language === "tr" ? "İptal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  style={{ background: accentColor }}
                  disabled={!title.trim()}
                >
                  {language === "tr" ? "Kaydet" : "Save"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <div className={styles.body}>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {language === "tr"
                  ? `"${column.title}" sütununu ve içindeki tüm kartları silmek istediğinize emin misiniz?`
                  : `Are you sure you want to delete "${column.title}" and all its cards?`}
              </p>
            </div>
            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={() => setConfirmDelete(false)}>
                {language === "tr" ? "Vazgeç" : "Back"}
              </button>
              <button
                type="button"
                className={styles.submitBtn}
                style={{ background: "#dc2626" }}
                onClick={() => { onDelete(); onClose(); }}
              >
                {language === "tr" ? "Evet, Sil" : "Yes, Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
