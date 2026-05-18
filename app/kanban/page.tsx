"use client";

import { Fragment, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import NewColumnDialog from "@/components/kanban/dialogs/NewColumnDialog";
import ColumnMenuDialog from "@/components/kanban/dialogs/ColumnMenuDialog";
import CardDetailDialog from "@/components/kanban/dialogs/CardDetailDialog";
import type { Card, CardDetailContext, Column, NewColumnData } from "@/lib/kanban/types";
import { KANBAN_MEMBERS, KANBAN_TAGS } from "@/lib/kanban/constants";
import { seedAttachments, seedComments } from "@/lib/kanban/seed";
import styles from "@/styles/kanban.module.scss";

type DragInfo   = { cardId: number; fromColId: string };
type DropTarget = { colId: string; index: number };

const TAGS = KANBAN_TAGS;
const MEMBERS = Object.fromEntries(KANBAN_MEMBERS.map((m) => [m.initials, m])) as Record<
  string,
  (typeof KANBAN_MEMBERS)[number]
>;

function mkCard(
  id: number,
  title: string,
  opts: Partial<Card> & { comments?: number; attachments?: number } = {}
): Card {
  const { comments, attachments, commentList, attachmentList, ...rest } = opts;
  return {
    id,
    title,
    tags: [],
    members: [],
    ...rest,
    commentList: commentList ?? (comments ? seedComments(comments, id) : []),
    attachmentList: attachmentList ?? (attachments ? seedAttachments(attachments, id) : []),
  };
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "backlog", title: "Backlog", accentColor: "#94a3b8",
    cards: [
      mkCard(1, "Kullanıcı profil sayfası tasarımı", { comments: 2 }),
      mkCard(2, "API rate limiting implementasyonu", { tags: [TAGS.review, TAGS.bug], comments: 4 }),
      mkCard(3, "E-posta bildirim şablonları", { tags: [TAGS.bug], members: [MEMBERS.ED] }),
      mkCard(4, "Çoklu dil desteği (i18n)", { tags: [TAGS.feature, TAGS.docs], attachments: 3 }),
      mkCard(5, "Performans optimizasyonu"),
      mkCard(6, "Unit test coverage artırımı", { tags: [TAGS.testing], members: [MEMBERS.TA], comments: 1 }),
    ],
  },
  {
    id: "inprogress", title: "In Progress", accentColor: "#f472b6",
    cards: [
      mkCard(7, "Kullanıcı kimlik doğrulama akışı", {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
        tags: [TAGS.bug, TAGS.feature],
        members: [MEMBERS.ED, MEMBERS.JS],
        comments: 5,
        attachments: 2,
      }),
      mkCard(8, "Mobil uyumlu tasarım", { tags: [TAGS.design], members: [MEMBERS.DW], comments: 3 }),
      mkCard(9, "Dashboard grafik bileşenleri", { tags: [TAGS.feature], members: [MEMBERS.AK, MEMBERS.JS], attachments: 1 }),
    ],
  },
  {
    id: "review", title: "In Review", accentColor: "#a78bfa",
    cards: [
      mkCard(10, "Ödeme entegrasyonu", {
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80",
        tags: [TAGS.backend, TAGS.hotfix],
        members: [MEMBERS.TA, MEMBERS.ED],
        comments: 8,
        attachments: 4,
      }),
      mkCard(11, "Güvenlik açığı yamaları", { tags: [TAGS.hotfix], members: [MEMBERS.JS], comments: 2 }),
    ],
  },
  {
    id: "done", title: "Done", accentColor: "#34d399",
    cards: [
      mkCard(12, "Sidebar tasarımı güncellendi", { tags: [TAGS.design], members: [MEMBERS.AK] }),
      mkCard(13, "Dark mode implementasyonu", { tags: [TAGS.feature], members: [MEMBERS.DW, MEMBERS.ED], comments: 6 }),
      mkCard(14, "README dokümantasyonu", { tags: [TAGS.docs], members: [MEMBERS.JS] }),
    ],
  },
];

export default function KanbanPage() {
  const { language, accent } = useApp();
  const [columns, setColumns]         = useState<Column[]>(INITIAL_COLUMNS);
  const [addingTo, setAddingTo]       = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState("");
  const [dragging, setDragging]       = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget]   = useState<DropTarget | null>(null);
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const [colDropIndex, setColDropIndex] = useState<number | null>(null);
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [menuColId, setMenuColId]     = useState<string | null>(null);
  const [cardDetail, setCardDetail]   = useState<CardDetailContext | null>(null);
  const cardDragRef = useRef(false);

  const ACCENT_COLORS: Record<string, string> = { red: "#c41e3a", green: "#2e8b57", blue: "#005eb8" };
  const accentColor = ACCENT_COLORS[accent] ?? "#005eb8";
  const totalCards  = columns.reduce((s, c) => s + c.cards.length, 0);
  const menuColumn  = columns.find((c) => c.id === menuColId) ?? null;

  // ─── Sütun sürükle ─────────────────────────────────────────────────────────

  const handleColDragStart = (colId: string) => {
    setDraggingCol(colId);
    setDragging(null);
    setDropTarget(null);
  };

  const handleColDragOver = (e: React.DragEvent, index: number) => {
    if (!draggingCol) return;
    e.preventDefault();
    e.stopPropagation();
    setColDropIndex(index);
  };

  const handleColDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggingCol) return;

    setColumns((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === draggingCol);
      if (fromIndex === -1) return prev;
      const next = [...prev];
      const [col] = next.splice(fromIndex, 1);
      let insertAt = toIndex;
      if (insertAt > fromIndex) insertAt -= 1;
      next.splice(Math.max(0, Math.min(insertAt, next.length)), 0, col);
      return next;
    });
    setDraggingCol(null);
    setColDropIndex(null);
  };

  const handleColDragEnd = () => {
    setDraggingCol(null);
    setColDropIndex(null);
  };

  // ─── Kart sürükle ──────────────────────────────────────────────────────────

  const handleDragStart = (cardId: number, fromColId: string) => {
    cardDragRef.current = true;
    setDragging({ cardId, fromColId });
    setDraggingCol(null);
    setColDropIndex(null);
  };

  const openCardDetail = (col: Column, card: Card) => {
    setCardDetail({
      card,
      columnId: col.id,
      columnTitle: col.title,
      columnColor: col.accentColor,
    });
  };

  const handleCardClick = (col: Column, card: Card) => {
    if (cardDragRef.current) return;
    openCardDetail(col, card);
  };

  const handleDragOverCard = (e: React.DragEvent, colId: string, index: number) => {
    if (draggingCol) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget({ colId, index });
  };

  const handleDragOverColumn = (e: React.DragEvent, colId: string) => {
    if (draggingCol) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const col = columns.find((c) => c.id === colId);
    if (col) setDropTarget({ colId, index: col.cards.length });
  };

  const handleDrop = (e: React.DragEvent, toColId: string, toIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging || draggingCol) return;

    const { cardId, fromColId } = dragging;

    setColumns((prev) => {
      const fromCol = prev.find((c) => c.id === fromColId);
      const toCol   = prev.find((c) => c.id === toColId);
      const card    = fromCol?.cards.find((c) => c.id === cardId);
      if (!fromCol || !toCol || !card) return prev;

      const fromIndex = fromCol.cards.findIndex((c) => c.id === cardId);
      let insertAt = toIndex ?? toCol.cards.length;
      if (fromColId === toColId && insertAt > fromIndex) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, toCol.cards.length - (fromColId === toColId ? 1 : 0)));

      if (fromColId === toColId) {
        return prev.map((col) => {
          if (col.id !== toColId) return col;
          const cards = col.cards.filter((c) => c.id !== cardId);
          const next = [...cards];
          next.splice(insertAt, 0, card);
          return { ...col, cards: next };
        });
      }

      return prev.map((col) => {
        if (col.id === fromColId) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
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

  const handleDragEnd = () => {
    setDragging(null);
    setDropTarget(null);
    requestAnimationFrame(() => {
      cardDragRef.current = false;
    });
  };

  const handleSaveCard = (columnId: string, cardId: number, updates: Partial<Card>) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c) =>
                c.id === cardId ? { ...c, ...updates } : c
              ),
            }
          : col
      )
    );
  };

  const handleDeleteCard = (columnId: string, cardId: number) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  // ─── Sütun CRUD ────────────────────────────────────────────────────────────

  const handleNewColumn = (data: NewColumnData) => {
    setColumns((prev) => [
      ...prev,
      {
        id: `col-${Date.now()}`,
        title: data.title,
        accentColor: data.accentColor,
        cards: [],
      },
    ]);
  };

  const handleEditColumn = (data: { title: string; accentColor: string }) => {
    if (!menuColId) return;
    setColumns((prev) =>
      prev.map((col) =>
        col.id === menuColId ? { ...col, title: data.title, accentColor: data.accentColor } : col
      )
    );
  };

  const handleDeleteColumn = () => {
    if (!menuColId) return;
    setColumns((prev) => prev.filter((col) => col.id !== menuColId));
    setMenuColId(null);
  };

  const confirmAddCard = (colId: string) => {
    const title = newCardText.trim();
    if (!title) { setAddingTo(null); return; }
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: [...col.cards, { id: Date.now(), title, tags: [], members: [], commentList: [], attachmentList: [] }] }
          : col
      )
    );
    setNewCardText("");
    setAddingTo(null);
  };

  return (
    <div className={styles.boardWrap}>
      <NewColumnDialog
        open={showNewColumn}
        onClose={() => setShowNewColumn(false)}
        onSubmit={handleNewColumn}
        accentColor={accentColor}
        language={language}
      />

      <ColumnMenuDialog
        open={!!menuColId}
        column={menuColumn}
        onClose={() => setMenuColId(null)}
        onSave={handleEditColumn}
        onDelete={handleDeleteColumn}
        accentColor={accentColor}
        language={language}
      />

      <CardDetailDialog
        open={!!cardDetail}
        context={cardDetail}
        onClose={() => setCardDetail(null)}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
        accentColor={accentColor}
        language={language}
      />

      {/* Başlık */}
      <div className={styles.boardHeader}>
        <div>
          <h1 className={styles.boardTitle}>
            {language === "tr" ? "Proje Panosu" : "Project Board"}
          </h1>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {totalCards} {language === "tr" ? "kart" : "cards"}
          </p>
        </div>
        <div className={styles.boardActions}>
          <button className={styles.boardBtn}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {language === "tr" ? "Filtrele" : "Filter"}
          </button>
          <button
            className={styles.boardBtn}
            style={{ background: accentColor, color: "white", borderColor: "transparent" }}
            onClick={() => setShowNewColumn(true)}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {language === "tr" ? "Yeni Sütun" : "New Column"}
          </button>
        </div>
      </div>

      {/* Sütunlar */}
      <div className={styles.columns}>
        {columns.map((col, colIdx) => {
          const isDropCol = dropTarget?.colId === col.id && !draggingCol;
          return (
            <Fragment key={col.id}>
              {colDropIndex === colIdx && draggingCol && (
                <div className={styles.columnDropIndicatorCol} style={{ background: accentColor }} />
              )}
              <div
                className={styles.columnWrap}
                onDragOver={(e) => handleColDragOver(e, colIdx)}
                onDrop={(e) => handleColDrop(e, colIdx)}
              >
                <div
                  className={`${styles.column} ${isDropCol ? styles.columnDropOver : ""} ${draggingCol === col.id ? styles.columnDraggingCol : ""}`}
                  onDragOver={(e) => handleDragOverColumn(e, col.id)}
                  onDrop={(e) => { if (!draggingCol) handleDrop(e, col.id); }}
                >
                  <div className={styles.columnTop} style={{ background: col.accentColor }} />

                  {/* Sürüklenebilir başlık */}
                  <div
                    className={styles.columnHeader}
                    draggable
                    onDragStart={() => handleColDragStart(col.id)}
                    onDragEnd={handleColDragEnd}
                  >
                    <span className={styles.dragHandle} title={language === "tr" ? "Sürükle" : "Drag"}>
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                      </svg>
                    </span>
                    <div className={styles.columnHeaderTitle}>
                      <span className={styles.columnTitle}>{col.title}</span>
                      <div className={styles.columnMeta}>
                        <span className={styles.columnCount}>{col.cards.length}</span>
                      </div>
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
                            draggable={!draggingCol}
                            onDragStart={() => handleDragStart(card.id, col.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOverCard(e, col.id, cardIdx)}
                            onDrop={(e) => handleDrop(e, col.id, cardIdx)}
                            onClick={() => handleCardClick(col, card)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCardClick(col, card);
                              }
                            }}
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
                                  {card.commentList.length > 0 && (
                                    <span className={styles.cardMetaItem}>
                                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                      </svg>
                                      {card.commentList.length}
                                    </span>
                                  )}
                                  {card.attachmentList.length > 0 && (
                                    <span className={styles.cardMetaItem}>
                                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                      </svg>
                                      {card.attachmentList.length}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

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

                  <div className={styles.columnFooter}>
                    <button className={styles.addCardBtn} onClick={() => { setAddingTo(col.id); setNewCardText(""); }}>
                      <span className={styles.addCardIcon}>+</span>
                      {language === "tr" ? "Kart ekle" : "Add card"}
                    </button>
                    <button
                      className={styles.footerIconBtn}
                      title={language === "tr" ? "Sütun ayarları" : "Column settings"}
                      onClick={() => setMenuColId(col.id)}
                    >
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}

        {/* Sütun sonuna bırakma */}
        {draggingCol && (
          <div
            className={styles.columnWrap}
            style={{ width: 48, minHeight: 200 }}
            onDragOver={(e) => handleColDragOver(e, columns.length)}
            onDrop={(e) => handleColDrop(e, columns.length)}
          >
            {colDropIndex === columns.length && (
              <div className={styles.columnDropIndicatorCol} style={{ background: accentColor, width: "100%" }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
