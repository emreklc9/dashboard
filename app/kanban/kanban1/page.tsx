"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/kanban.module.scss";

type Tag    = { label: string; bg: string; color: string };
type Member = { initials: string; bg: string };
type Card   = { id: number; title: string; image?: string; tags: Tag[]; members: Member[]; comments?: number; attachments?: number };
type Column = { id: string; title: string; accentColor: string; cards: Card[] };
type DragInfo  = { cardId: number; fromColId: string };
type DropTarget = { colId: string; index: number };

const TAGS: Record<string, Tag> = {
  bug:     { label: "Bug",           bg: "#fee2e2", color: "#dc2626" },
  feature: { label: "Feature",       bg: "#ede9fe", color: "#7c3aed" },
  review:  { label: "Review",        bg: "#fef3c7", color: "#d97706" },
  design:  { label: "Design",        bg: "#d1fae5", color: "#059669" },
  testing: { label: "Testing",       bg: "#e0f2fe", color: "#0284c7" },
  docs:    { label: "Documentation", bg: "#dbeafe", color: "#1d4ed8" },
  hotfix:  { label: "Hotfix",        bg: "#fce7f3", color: "#be185d" },
  backend: { label: "Backend",       bg: "#f3f4f6", color: "#374151" },
};

const MEMBERS: Record<string, Member> = {
  ED: { initials: "ED", bg: "#8b5cf6" },
  JS: { initials: "JS", bg: "#0ea5e9" },
  TA: { initials: "TA", bg: "#f59e0b" },
  DW: { initials: "DW", bg: "#10b981" },
  AK: { initials: "AK", bg: "#ef4444" },
};

const INITIAL_COLUMNS: Column[] = [
  {
    id: "backlog", title: "Backlog", accentColor: "#94a3b8",
    cards: [
      { id: 1,  title: "Kullanıcı profil sayfası tasarımı",  tags: [],                            members: [],                        comments: 2 },
      { id: 2,  title: "API rate limiting implementasyonu",  tags: [TAGS.review, TAGS.bug],       members: [],                        comments: 4 },
      { id: 3,  title: "E-posta bildirim şablonları",        tags: [TAGS.bug],                    members: [MEMBERS.ED] },
      { id: 4,  title: "Çoklu dil desteği (i18n)",           tags: [TAGS.feature, TAGS.docs],     members: [],                        attachments: 3 },
      { id: 5,  title: "Performans optimizasyonu",           tags: [],                            members: [] },
      { id: 6,  title: "Unit test coverage artırımı",        tags: [TAGS.testing],                members: [MEMBERS.TA],              comments: 1 },
    ],
  },
  {
    id: "inprogress", title: "In Progress", accentColor: "#f472b6",
    cards: [
      { id: 7,  title: "Kullanıcı kimlik doğrulama akışı",  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80", tags: [TAGS.bug, TAGS.feature], members: [MEMBERS.ED, MEMBERS.JS], comments: 5, attachments: 2 },
      { id: 8,  title: "Mobil uyumlu tasarım",              tags: [TAGS.design],                 members: [MEMBERS.DW],              comments: 3 },
      { id: 9,  title: "Dashboard grafik bileşenleri",      tags: [TAGS.feature],                members: [MEMBERS.AK, MEMBERS.JS],  attachments: 1 },
    ],
  },
  {
    id: "review", title: "In Review", accentColor: "#a78bfa",
    cards: [
      { id: 10, title: "Ödeme entegrasyonu",                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80", tags: [TAGS.backend, TAGS.hotfix], members: [MEMBERS.TA, MEMBERS.ED], comments: 8, attachments: 4 },
      { id: 11, title: "Güvenlik açığı yamaları",           tags: [TAGS.hotfix],                 members: [MEMBERS.JS],              comments: 2 },
    ],
  },
  {
    id: "done", title: "Done", accentColor: "#34d399",
    cards: [
      { id: 12, title: "Sidebar tasarımı güncellendi",      tags: [TAGS.design],                 members: [MEMBERS.AK] },
      { id: 13, title: "Dark mode implementasyonu",         tags: [TAGS.feature],                members: [MEMBERS.DW, MEMBERS.ED],  comments: 6 },
      { id: 14, title: "README dokümantasyonu",             tags: [TAGS.docs],                   members: [MEMBERS.JS] },
    ],
  },
];

export default function Kanban1Page() {
  const { language, accent } = useApp();
  const [columns, setColumns]       = useState<Column[]>(INITIAL_COLUMNS);
  const [addingTo, setAddingTo]     = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState("");
  const [dragging, setDragging]     = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const ACCENT_COLORS: Record<string, string> = { red: "#c41e3a", green: "#2e8b57", blue: "#005eb8" };
  const accentColor = ACCENT_COLORS[accent] ?? "#005eb8";
  const totalCards  = columns.reduce((s, c) => s + c.cards.length, 0);

  // ─── Drag & Drop ───────────────────────────────────────────────────────────

  const handleDragStart = (cardId: number, fromColId: string) => {
    setDragging({ cardId, fromColId });
  };

  const handleDragOverCard = (e: React.DragEvent, colId: string, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget({ colId, index });
  };

  const handleDragOverColumn = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const col = columns.find((c) => c.id === colId);
    if (col) setDropTarget({ colId, index: col.cards.length });
  };

  const handleDrop = (e: React.DragEvent, toColId: string, toIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) return;

    const { cardId, fromColId } = dragging;

    setColumns((prev) => {
      const fromCol = prev.find((c) => c.id === fromColId);
      const toCol   = prev.find((c) => c.id === toColId);
      const card    = fromCol?.cards.find((c) => c.id === cardId);

      if (!fromCol || !toCol || !card) return prev;

      const fromIndex = fromCol.cards.findIndex((c) => c.id === cardId);
      let insertAt = toIndex ?? toCol.cards.length;

      // Aynı sütunda: kart silindikten sonra indeks kayar
      if (fromColId === toColId && insertAt > fromIndex) {
        insertAt -= 1;
      }
      insertAt = Math.max(0, Math.min(insertAt, toCol.cards.length - (fromColId === toColId ? 1 : 0)));

      // Aynı sütun — tek geçişte sil + ekle
      if (fromColId === toColId) {
        return prev.map((col) => {
          if (col.id !== toColId) return col;
          const cards = col.cards.filter((c) => c.id !== cardId);
          const next = [...cards];
          next.splice(insertAt, 0, card);
          return { ...col, cards: next };
        });
      }

      // Farklı sütunlar
      return prev.map((col) => {
        if (col.id === fromColId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === toColId) {
          const next = [...col.cards];
          next.splice(insertAt, 0, card);
          return { ...col, cards: next };
        }
        return col;
      });
    });

    setDragging(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => { setDragging(null); setDropTarget(null); };

  // ─── Add card ──────────────────────────────────────────────────────────────

  const confirmAddCard = (colId: string) => {
    const title = newCardText.trim();
    if (!title) { setAddingTo(null); return; }
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: [...col.cards, { id: Date.now(), title, tags: [], members: [] }] }
          : col
      )
    );
    setNewCardText("");
    setAddingTo(null);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.boardWrap}>
      {/* Başlık */}
      <div className={styles.boardHeader}>
        <div>
          <h1 className={styles.boardTitle}>
            {language === "tr" ? "Proje Panosu" : "Project Board"}
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {totalCards} {language === "tr" ? "kart" : "cards"} · Kanban 1
          </p>
        </div>
        <div className={styles.boardActions}>
          <button className={styles.boardBtn}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {language === "tr" ? "Filtrele" : "Filter"}
          </button>
          <button className={styles.boardBtn} style={{ background: accentColor, color: "white", borderColor: "transparent" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {language === "tr" ? "Yeni Sütun" : "New Column"}
          </button>
        </div>
      </div>

      {/* Sütunlar */}
      <div className={styles.columns}>
        {columns.map((col) => {
          const isDropCol = dropTarget?.colId === col.id;
          return (
            <div
              key={col.id}
              className={`${styles.column} ${isDropCol ? styles.columnDropOver : ""}`}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Üst renkli şerit */}
              <div className={styles.columnTop} style={{ background: col.accentColor }} />

              {/* Sütun başlığı */}
              <div className={styles.columnHeader}>
                <span className={styles.columnTitle}>{col.title}</span>
                <div className={styles.columnMeta}>
                  <span className={styles.columnCount}>{col.cards.length}</span>
                  <button className={styles.columnViewBtn} title={language === "tr" ? "Görüntüle" : "View"}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Kart listesi */}
              <div className={styles.cardList}>
                {col.cards.filter((c): c is Card => Boolean(c?.id)).map((card, cardIdx) => {
                  const isDraggingThis = dragging?.cardId === card.id;
                  const showDropLine   = isDropCol && dropTarget?.index === cardIdx && dragging?.cardId !== card.id;
                  return (
                    <div key={card.id}>
                      {showDropLine && (
                        <div className={styles.dropIndicator} style={{ borderColor: accentColor }} />
                      )}
                      <div
                        className={`${styles.card} ${isDraggingThis ? styles.cardDragging : ""}`}
                        draggable
                        onDragStart={() => handleDragStart(card.id, col.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOverCard(e, col.id, cardIdx)}
                        onDrop={(e) => handleDrop(e, col.id, cardIdx)}
                      >
                        {card.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.image} alt={card.title} className={styles.cardImage} />
                        )}
                        <div className={styles.cardBody}>
                          {card.tags.length > 0 && (
                            <div className={styles.cardTags}>
                              {card.tags.map((t) => (
                                <span key={t.label} className={styles.tag} style={{ background: t.bg, color: t.color }}>
                                  {t.label}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className={styles.cardTitle}>{card.title}</p>
                          <div className={styles.cardFooter}>
                            <div className={styles.cardAvatars}>
                              {card.members.map((m) => (
                                <div key={m.initials} className={styles.cardAvatar} style={{ background: m.bg }} title={m.initials}>
                                  {m.initials}
                                </div>
                              ))}
                            </div>
                            <div className={styles.cardMeta}>
                              {card.comments && (
                                <span className={styles.cardMetaItem}>
                                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {card.comments}
                                </span>
                              )}
                              {card.attachments && (
                                <span className={styles.cardMetaItem}>
                                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  {card.attachments}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Yeni kart input */}
                {addingTo === col.id && (
                  <div>
                    <textarea
                      autoFocus
                      className={styles.addCardInput}
                      placeholder={language === "tr" ? "Kart başlığı girin..." : "Enter card title..."}
                      value={newCardText}
                      onChange={(e) => setNewCardText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); confirmAddCard(col.id); }
                        if (e.key === "Escape") { setAddingTo(null); setNewCardText(""); }
                      }}
                    />
                    <div className={styles.addCardActions}>
                      <button className={styles.addCardConfirm} style={{ background: accentColor }} onClick={() => confirmAddCard(col.id)}>
                        {language === "tr" ? "Ekle" : "Add"}
                      </button>
                      <button className={styles.addCardCancel} onClick={() => { setAddingTo(null); setNewCardText(""); }}>
                        {language === "tr" ? "İptal" : "Cancel"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Alt kısım */}
              <div className={styles.columnFooter}>
                <button className={styles.addCardBtn} onClick={() => { setAddingTo(col.id); setNewCardText(""); }}>
                  <span className={styles.addCardIcon}>+</span>
                  {language === "tr" ? "Kart ekle" : "Add card"}
                </button>
                <button className={styles.footerIconBtn} title={language === "tr" ? "Sütun menüsü" : "Column menu"}>
                 
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
