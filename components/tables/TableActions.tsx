"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/tables/shared.module.scss";

type Props = {
  language: "tr" | "en";
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const MENU_MIN_WIDTH = 130;
const MENU_ESTIMATED_HEIGHT = 118;
const MENU_GAP = 4;

export default function TableActions({ language, onView, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, openUp: false });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tr = language === "tr";

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    const menuEl = menuRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const menuHeight = menuEl?.offsetHeight ?? MENU_ESTIMATED_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP;
    const spaceAbove = rect.top - MENU_GAP;
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    let top = openUp ? rect.top - menuHeight - MENU_GAP : rect.bottom + MENU_GAP;
    top = Math.max(MENU_GAP, Math.min(top, window.innerHeight - menuHeight - MENU_GAP));

    let left = rect.right - MENU_MIN_WIDTH;
    left = Math.max(MENU_GAP, Math.min(left, window.innerWidth - MENU_MIN_WIDTH - MENU_GAP));

    setMenuPos({ top, left, openUp });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", close);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, updatePosition]);

  const menu =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            className={`${styles.actionsMenuPortal} ${menuPos.openUp ? styles.actionsMenuPortalUp : ""}`}
            style={{ top: menuPos.top, left: menuPos.left }}
            role="menu"
          >
            <button type="button" role="menuitem" onClick={() => { onView?.(); setOpen(false); }}>
              {tr ? "Görüntüle" : "View"}
            </button>
            <button type="button" role="menuitem" onClick={() => { onEdit?.(); setOpen(false); }}>
              {tr ? "Düzenle" : "Edit"}
            </button>
            <button
              type="button"
              role="menuitem"
              className={styles.actionsDanger}
              onClick={() => { onDelete?.(); setOpen(false); }}
            >
              {tr ? "Sil" : "Delete"}
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className={styles.actionsWrap}>
        <button
          ref={btnRef}
          type="button"
          className={styles.actionsBtn}
          onClick={() => setOpen((v) => !v)}
          aria-label={tr ? "İşlemler" : "Actions"}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>
      {menu}
    </>
  );
}
