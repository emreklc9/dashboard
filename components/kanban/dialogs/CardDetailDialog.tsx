"use client";

import { useEffect, useRef, useState } from "react";
import type { Attachment, Card, CardDetailContext, Comment, Member, Tag } from "@/lib/kanban/types";
import { KANBAN_MEMBERS, KANBAN_TAG_LIST } from "@/lib/kanban/constants";
import styles from "@/styles/kanban-dialog.module.scss";

type Props = {
  open: boolean;
  context: CardDetailContext | null;
  onClose: () => void;
  onSave: (columnId: string, cardId: number, updates: Partial<Card>) => void;
  onDelete: (columnId: string, cardId: number) => void;
  accentColor: string;
  language: "tr" | "en";
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function nowTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function CardDetailDialog({
  open,
  context,
  onClose,
  onSave,
  onDelete,
  accentColor,
  language,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<Tag[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [attachmentList, setAttachmentList] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const tagPickerRef = useRef<HTMLDivElement>(null);
  const memberPickerRef = useRef<HTMLDivElement>(null);

  const tr = language === "tr";
  const currentUser: Member = {
    initials: tr ? "SN" : "ME",
    bg: accentColor,
    name: tr ? "Sen" : "You",
  };

  useEffect(() => {
    if (open && context) {
      const { card } = context;
      setTitle(card.title);
      setDescription(card.description ?? "");
      setImage(card.image);
      setTags([...card.tags]);
      setMembers([...card.members]);
      setCommentList([...card.commentList]);
      setAttachmentList([...card.attachmentList]);
      setNewComment("");
      setShowTagPicker(false);
      setShowMemberPicker(false);
    }
  }, [open, context]);

  useEffect(() => {
    if (!showTagPicker && !showMemberPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (showTagPicker && tagPickerRef.current && !tagPickerRef.current.contains(e.target as Node)) {
        setShowTagPicker(false);
      }
      if (showMemberPicker && memberPickerRef.current && !memberPickerRef.current.contains(e.target as Node)) {
        setShowMemberPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTagPicker, showMemberPicker]);

  if (!open || !context) return null;

  const { card, columnId, columnTitle, columnColor } = context;

  const availableTags = KANBAN_TAG_LIST.filter((t) => !tags.some((x) => x.label === t.label));
  const availableMembers = KANBAN_MEMBERS.filter((m) => !members.some((x) => x.initials === m.initials));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSave(columnId, card.id, {
      title: trimmedTitle,
      description: description.trim() || undefined,
      image: image || undefined,
      tags,
      members,
      commentList,
      attachmentList,
    });
    onClose();
  };

  const sendComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setCommentList((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        author: currentUser.name ?? currentUser.initials,
        initials: currentUser.initials,
        authorBg: currentUser.bg,
        time: nowTime(),
      },
    ]);
    setNewComment("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const added: Attachment[] = Array.from(files).map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: formatFileSize(f.size),
    }));
    setAttachmentList((prev) => [...prev, ...added]);
    e.target.value = "";
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 4 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${styles.dialog} ${styles.dialogDetail}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-detail-title"
      >
        <div className={styles.headerColored} style={{ background: columnColor }}>
          <div className={styles.headerColoredMeta}>
            <span id="card-detail-title" className={styles.title}>
              {tr ? "Kart Detayı" : "Card Details"}
            </span>
            <span className={styles.headerColoredSub}>{columnTitle}</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className={styles.detailBody}>
            <div className={styles.detailMain}>
              <div className={styles.tagRow}>
                {tags.map((t) => (
                  <span key={t.label} className={styles.tagChipRemovable} style={{ background: t.bg, color: t.color }}>
                    {t.label}
                    <button type="button" className={styles.tagRemoveBtn} onClick={() => setTags((p) => p.filter((x) => x.label !== t.label))} aria-label="remove tag">
                      <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <div className={styles.addTagWrap} ref={tagPickerRef}>
                  <button type="button" className={styles.addChipBtn} onClick={() => { setShowTagPicker((v) => !v); setShowMemberPicker(false); }}>
                    + {tr ? "Etiket" : "Tag"}
                  </button>
                  {showTagPicker && availableTags.length > 0 && (
                    <div className={styles.tagPicker}>
                      {availableTags.map((t) => (
                        <button key={t.label} type="button" className={styles.tagPickerItem} onClick={() => { setTags((p) => [...p, t]); setShowTagPicker(false); }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.coverSection}>
                <span className={styles.label}>{tr ? "Kapak" : "Cover"}</span>
                <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={handleCoverChange} />
                {image ? (
                  <div className={styles.coverPreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title || card.title} className={styles.coverImage} />
                    <div className={styles.coverActions}>
                      <button type="button" className={styles.coverActionBtn} onClick={() => coverInputRef.current?.click()}>
                        {tr ? "Değiştir" : "Change"}
                      </button>
                      <button type="button" className={`${styles.coverActionBtn} ${styles.coverActionBtnDanger}`} onClick={() => setImage(undefined)}>
                        {tr ? "Kaldır" : "Remove"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className={styles.coverEmpty} onClick={() => coverInputRef.current?.click()}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {tr ? "Kapak resmi ekle" : "Add cover image"}
                  </button>
                )}
              </div>

              <div>
                <label className={styles.label} htmlFor="card-title">{tr ? "Başlık" : "Title"}</label>
                <input id="card-title" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className={styles.assigneeSection}>
                <span className={styles.label}>{tr ? "Atananlar" : "Assignees"}</span>
                <div className={styles.assigneeRow}>
                  {members.map((m) => (
                    <span key={m.initials} className={styles.memberChipRemovable}>
                      <span className={styles.memberAvatar} style={{ background: m.bg, width: 24, height: 24, fontSize: 9 }}>{m.initials}</span>
                      {m.name ?? m.initials}
                      <button type="button" className={styles.memberRemoveBtn} onClick={() => setMembers((p) => p.filter((x) => x.initials !== m.initials))}>
                        ×
                      </button>
                    </span>
                  ))}
                  <div ref={memberPickerRef} style={{ position: "relative" }}>
                    <button type="button" className={styles.addChipBtn} onClick={() => { setShowMemberPicker((v) => !v); setShowTagPicker(false); }}>
                      + {tr ? "Kişi" : "Person"}
                    </button>
                    {showMemberPicker && availableMembers.length > 0 && (
                      <div className={styles.memberPicker}>
                        {availableMembers.map((m) => (
                          <button key={m.initials} type="button" className={styles.memberPickerItem} onClick={() => { setMembers((p) => [...p, m]); setShowMemberPicker(false); }}>
                            <span className={styles.memberAvatar} style={{ background: m.bg, width: 26, height: 26, fontSize: 10 }}>{m.initials}</span>
                            {m.name ?? m.initials}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={styles.label} htmlFor="card-desc">{tr ? "Açıklama" : "Description"}</label>
                <textarea id="card-desc" className={styles.textarea} placeholder={tr ? "Kart açıklaması..." : "Description..."} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className={styles.filesSection}>
                <span className={styles.label}>{tr ? "Dosyalar" : "Files"} ({attachmentList.length})</span>
                {attachmentList.length > 0 && (
                  <div className={styles.fileList}>
                    {attachmentList.map((f) => (
                      <div key={f.id} className={styles.fileItem}>
                        <div className={styles.fileIcon}>📄</div>
                        <div className={styles.fileInfo}>
                          <div className={styles.fileName}>{f.name}</div>
                          <div className={styles.fileSize}>{f.size}</div>
                        </div>
                        <button type="button" className={styles.fileRemoveBtn} onClick={() => setAttachmentList((p) => p.filter((a) => a.id !== f.id))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />
                <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                  {tr ? "Dosya ekle" : "Add file"}
                </button>
              </div>
            </div>

            <aside className={styles.detailComments}>
              <div className={styles.commentsHeader}>
                {tr ? "Yorumlar" : "Comments"}
                {commentList.length > 0 && <span style={{ marginLeft: 6, opacity: 0.7 }}>{commentList.length}</span>}
              </div>
              <div className={styles.commentsList}>
                {commentList.length === 0 ? (
                  <p className={styles.emptyHint} style={{ padding: "8px 0", fontSize: 13 }}>
                    {tr ? "Henüz yorum yok" : "No comments yet"}
                  </p>
                ) : (
                  commentList.map((c) => (
                    <div key={c.id} className={styles.commentItem}>
                      <span className={styles.memberAvatar} style={{ background: c.authorBg, width: 24, height: 24, fontSize: 9, flexShrink: 0 }}>{c.initials}</span>
                      <div className={styles.commentBody}>
                        <div className={styles.commentMeta}>
                          <span className={styles.commentAuthor}>{c.author}</span>
                          <span className={styles.commentTime}>{c.time}</span>
                        </div>
                        <div className={styles.commentText}>{c.text}</div>
                      </div>
                      <button type="button" className={styles.commentDelete} onClick={() => setCommentList((p) => p.filter((x) => x.id !== c.id))}>×</button>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.commentsInputWrap}>
                <div className={styles.commentInputRow}>
                  <textarea
                    className={styles.commentInput}
                    placeholder={tr ? "Yorum yazın…" : "Write a comment…"}
                    value={newComment}
                    rows={1}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendComment(); } }}
                  />
                  <button type="button" className={styles.commentSendBtn} style={{ background: accentColor }} onClick={sendComment} disabled={!newComment.trim()} aria-label={tr ? "Gönder" : "Send"}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.footer} style={{ justifyContent: "space-between", flexShrink: 0 }}>
            <button type="button" className={styles.cancelBtn} style={{ color: "#dc2626", borderColor: "#fecaca" }} onClick={() => { onDelete(columnId, card.id); onClose(); }}>
              {tr ? "Sil" : "Delete"}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>{tr ? "Kapat" : "Close"}</button>
              <button type="submit" className={styles.submitBtn} style={{ background: accentColor }} disabled={!title.trim()}>
                {tr ? "Kaydet" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
