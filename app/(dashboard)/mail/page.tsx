"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/mail.module.scss";

// ─── Tipler ──────────────────────────────────────────────────────────────────

type Folder = "inbox" | "sent" | "starred" | "drafts" | "trash";

type Mail = {
  id: number;
  folder: Folder;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  unread: boolean;
  starred: boolean;
  color: string;
  initials: string;
  tag?: { label: string; bg: string; text: string };
  attachments?: { name: string; size: string }[];
};

// ─── Mock veri ───────────────────────────────────────────────────────────────

const MAILS: Mail[] = [
  {
    id: 1, folder: "inbox", sender: "Ayşe Kaya", email: "ayse@cordelio.dev",
    subject: "Yeni tasarım dosyaları hazır",
    preview: "Merhaba, dashboard için hazırladığım Figma dosyalarını paylaşıyorum...",
    body: [
      "Merhaba,",
      "Dashboard için hazırladığım Figma dosyalarını paylaşıyorum. İnceleme fırsatı bulabilirsen görüşlerini almak isterim.",
      "Özellikle renk paleti ve tipografi seçimlerinde biraz kararsız kaldım. Mavi vurgu rengiyle devam etmeli miyiz, yoksa daha nötr bir ton mu kullansak?",
      "Ekte ilgili dosyaları bulabilirsin. Herhangi bir sorun olursa benimle iletişime geçebilirsin.",
      "İyi çalışmalar,\nAyşe",
    ],
    time: "09:41", unread: true, starred: true,
    color: "#8b5cf6", initials: "AK",
    tag: { label: "Tasarım", bg: "#ede9fe", text: "#7c3aed" },
    attachments: [{ name: "dashboard-v3.fig", size: "4.2 MB" }, { name: "color-palette.pdf", size: "1.1 MB" }],
  },
  {
    id: 2, folder: "inbox", sender: "Mehmet Demir", email: "mehmet@cordelio.dev",
    subject: "PR #142 — Login Refactor",
    preview: "AUTH-142 numaralı PR'ı açtım, inceleme için atadım...",
    body: [
      "Selam,",
      "AUTH-142 numaralı PR'ı açtım ve sana review için atadım. Genel olarak login akışını yeniden düzenledim; token yönetimi ve session süresi iyileştirildi.",
      "Önemli değişiklikler:",
      "• JWT'nin expiry süresi 24 saatten 8 saate indirildi\n• Refresh token mekanizması eklendi\n• Hatalı giriş limit koruması (5 deneme = 15 dk kilit)",
      "İnceleyip yorumlarını paylaşırsan harika olur.",
      "Teşekkürler,\nMehmet",
    ],
    time: "09:15", unread: true, starred: false,
    color: "#0ea5e9", initials: "MD",
    tag: { label: "Geliştirme", bg: "#e0f2fe", text: "#0284c7" },
    attachments: [],
  },
  {
    id: 3, folder: "inbox", sender: "Zeynep Arslan", email: "zeynep@cordelio.dev",
    subject: "Sprint 14 Toplantısı — Hatırlatma",
    preview: "Yarın saat 14:00'de Sprint 14 planlama toplantımız var...",
    body: [
      "Merhaba ekip,",
      "Yarın saat 14:00'de Sprint 14 planlama toplantımız var. Toplantıya katılımın çok önemli olduğunu hatırlatmak istedim.",
      "Gündem:",
      "1. Sprint 13 retrospektif (15 dk)\n2. Backlog grooming (20 dk)\n3. Sprint 14 görev dağılımı (25 dk)",
      "Toplantı linki takvim davetinde mevcut. Görüşmek üzere!",
      "Zeynep",
    ],
    time: "Dün", unread: false, starred: false,
    color: "#f59e0b", initials: "ZA",
    tag: { label: "Toplantı", bg: "#fef3c7", text: "#d97706" },
  },
  {
    id: 4, folder: "inbox", sender: "Can Yılmaz", email: "can@cordelio.dev",
    subject: "Prodüksiyon sunucusu yeniden başlatıldı",
    preview: "01:45 UTC'de prodüksiyon sunucusu yeniden başlatıldı, tüm servisler aktif...",
    body: [
      "Bilgi amaçlı,",
      "Gece 01:45 UTC'de prodüksiyon sunucusu planlı bakım nedeniyle yeniden başlatıldı.",
      "Tüm servisler normal çalışıyor. Uptime: %99.97 (son 30 gün)",
      "Bellek kullanımı: %68 → %42'ye düştü. CPU: normal seviyelerde.",
      "Herhangi bir sorunla karşılaşırsanız #ops kanalından ulaşabilirsiniz.",
      "Can",
    ],
    time: "Dün", unread: false, starred: false,
    color: "#10b981", initials: "CY",
    tag: { label: "DevOps", bg: "#d1fae5", text: "#059669" },
  },
  {
    id: 5, folder: "inbox", sender: "Elif Şahin", email: "elif@cordelio.dev",
    subject: "Q2 Analitik Raporu",
    preview: "Q2 dönemine ait analitik raporunu hazırladım, incelemeni rica ederim...",
    body: [
      "Merhaba,",
      "Q2 dönemine ait analitik raporunu hazırladım. Genel olarak büyüme trendleri olumlu görünüyor.",
      "Öne çıkan metrikler:",
      "• Aylık aktif kullanıcı: +23%\n• Ortalama oturum süresi: 4.2 dk (+0.8 dk)\n• Dönüşüm oranı: %3.7 (+0.4 puan)",
      "Detaylı analiz için ekteki raporu inceleyebilirsin. Sorular için hazırım.",
      "Elif",
    ],
    time: "Çarş", unread: false, starred: true,
    color: "#ef4444", initials: "EŞ",
    tag: { label: "Analitik", bg: "#fee2e2", text: "#dc2626" },
    attachments: [{ name: "q2-analytics-report.xlsx", size: "2.8 MB" }],
  },
  {
    id: 6, folder: "sent", sender: "Ben", email: "admin@cordelio.dev",
    subject: "Re: Yeni tasarım dosyaları hazır",
    preview: "Merhaba Ayşe, dosyaları inceledim, çok güzel görünüyor...",
    body: [
      "Merhaba Ayşe,",
      "Dosyaları inceledim, çok güzel görünüyor! Mavi vurgu rengiyle devam edelim, mevcut marka kimliğiyle uyumlu.",
      "Tipografi seçimi de yerinde. Devam edebilirsin.",
      "Teşekkürler",
    ],
    time: "09:55", unread: false, starred: false,
    color: "#6366f1", initials: "B",
  },
  {
    id: 7, folder: "drafts", sender: "Ben", email: "admin@cordelio.dev",
    subject: "Yıllık bütçe planlaması",
    preview: "Gelecek yıl için bütçe önerilerimi hazırlıyorum...",
    body: ["[Taslak — tamamlanmadı]", "Gelecek yıl için bütçe önerilerimi hazırlıyorum..."],
    time: "2 gün önce", unread: false, starred: false,
    color: "#6366f1", initials: "B",
  },
];

type Mention = { name: string; email: string; color: string; initials: string };

const PEOPLE: Mention[] = [
  { name: "Ayşe Kaya",     email: "ayse@cordelio.dev",   color: "#8b5cf6", initials: "AK" },
  { name: "Mehmet Demir",  email: "mehmet@cordelio.dev", color: "#0ea5e9", initials: "MD" },
  { name: "Zeynep Arslan", email: "zeynep@cordelio.dev", color: "#f59e0b", initials: "ZA" },
  { name: "Can Yılmaz",    email: "can@cordelio.dev",    color: "#10b981", initials: "CY" },
  { name: "Elif Şahin",    email: "elif@cordelio.dev",   color: "#ef4444", initials: "EŞ" },
  { name: "Burak Çelik",   email: "burak@cordelio.dev",  color: "#ec4899", initials: "BÇ" },
];

const FOLDERS: { id: Folder; labelTR: string; labelEN: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "inbox",   labelTR: "Gelen Kutusu", labelEN: "Inbox",   badge: 2,
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg> },
  { id: "sent",    labelTR: "Gönderilenler", labelEN: "Sent",   icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> },
  { id: "starred", labelTR: "Yıldızlılar",  labelEN: "Starred", icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  { id: "drafts",  labelTR: "Taslaklar",    labelEN: "Drafts",  badge: 1,
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  { id: "trash",   labelTR: "Çöp Kutusu",   labelEN: "Trash",   icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> },
];

// ─── Bileşen ──────────────────────────────────────────────────────────────────

export default function MailPage() {
  const { language, accent } = useApp();
  const [activeFolder, setActiveFolder] = useState<Folder>("inbox");
  const [activeMailId, setActiveMailId] = useState<number | null>(1);
  const [replyText, setReplyText]   = useState("");
  const [mentions, setMentions]     = useState<Mention[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  const [mentionQuery, setMentionQuery]   = useState<string | null>(null); // null = kapalı, string = filtre
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);

  const ACCENT_COLORS: Record<string, string> = { red: "#c41e3a", green: "#2e8b57", blue: "#005eb8" };
  const accentColor = ACCENT_COLORS[accent] ?? "#005eb8";

  // Mention dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-mention-zone]")) setMentionQuery(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReplyText(val);
    // @ yazdığında mention dropdown'ı aç
    const match = val.match(/@(\w*)$/);
    setMentionQuery(match ? match[1] : null);
  };

  const insertMention = (person: Mention) => {
    if (mentions.find((m) => m.email === person.email)) {
      setMentionQuery(null);
      return;
    }
    setMentions((prev) => [...prev, person]);
    // @... kısmını metinden temizle
    setReplyText((t) => t.replace(/@\w*$/, ""));
    setMentionQuery(null);
    textareaRef.current?.focus();
  };

  const removeMention = (email: string) =>
    setMentions((prev) => prev.filter((m) => m.email !== email));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const mapped = files.map((f) => ({
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setAttachedFiles((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeFile = (name: string) =>
    setAttachedFiles((prev) => prev.filter((f) => f.name !== name));

  const filteredPeople = PEOPLE.filter((p) =>
    mentionQuery === null
      ? false
      : p.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const folderMails = activeFolder === "starred"
    ? MAILS.filter((m) => m.starred)
    : MAILS.filter((m) => m.folder === activeFolder);

  const activeMail = activeMailId ? MAILS.find((m) => m.id === activeMailId) ?? null : null;

  return (
    <div style={{ height: "calc(100vh - 58px - 48px)" }} className={styles.mailWrap}>

      {/* ── Klasör paneli ── */}
      <div className={styles.folderPanel}>
        <button
          className={styles.composeBtn}
          style={{ background: accentColor }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {language === "tr" ? "Yeni Mail" : "Compose"}
        </button>

        {FOLDERS.map((f) => (
          <button
            key={f.id}
            className={`${styles.folderItem} ${activeFolder === f.id ? styles.folderItemActive : ""}`}
            style={activeFolder === f.id ? { color: accentColor } : undefined}
            onClick={() => { setActiveFolder(f.id); setActiveMailId(null); }}
          >
            <span className={styles.folderIcon} style={activeFolder === f.id ? { color: accentColor } : undefined}>
              {f.icon}
            </span>
            <span className={styles.folderLabel}>
              {language === "tr" ? f.labelTR : f.labelEN}
            </span>
            {f.badge && (
              <span className={styles.folderBadge} style={{ background: accentColor }}>
                {f.badge}
              </span>
            )}
          </button>
        ))}

        <div className={styles.folderDivider} />

        <button className={styles.folderItem}>
          <span className={styles.folderIcon}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          <span className={styles.folderLabel}>
            {language === "tr" ? "Etiketler" : "Labels"}
          </span>
        </button>
      </div>

      {/* ── Mail listesi ── */}
      <div className={styles.mailListPanel}>
        <div className={styles.mailListHeader}>
          <span className={styles.mailListTitle}>
            {language === "tr"
              ? FOLDERS.find((f) => f.id === activeFolder)?.labelTR
              : FOLDERS.find((f) => f.id === activeFolder)?.labelEN}
          </span>
          <span className={styles.mailListCount}>{folderMails.length}</span>
        </div>
        <div className={styles.mailList}>
          {folderMails.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              {language === "tr" ? "Mail bulunamadı" : "No mail found"}
            </div>
          ) : (
            folderMails.map((mail) => (
              <div
                key={mail.id}
                className={`${styles.mailItem} ${activeMailId === mail.id ? styles.mailItemActive : ""}`}
                onClick={() => setActiveMailId(mail.id)}
              >
                {mail.unread && <span className={styles.mailUnreadDot} style={{ background: accentColor }} />}
                {!mail.unread && <span style={{ width: 7, flexShrink: 0 }} />}

                <div className={styles.mailItemBody}>
                  <div className={styles.mailItemTop}>
                    <span className={`${styles.mailSender} ${!mail.unread ? styles.mailSenderRead : ""}`}>
                      {mail.sender}
                    </span>
                    <span className={styles.mailTime}>{mail.time}</span>
                  </div>
                  <p className={`${styles.mailSubject} ${!mail.unread ? styles.mailSubjectRead : ""}`}>
                    {mail.subject}
                  </p>
                  <p className={styles.mailPreview}>{mail.preview}</p>
                  {mail.tag && (
                    <span
                      className={styles.mailTag}
                      style={{ background: mail.tag.bg, color: mail.tag.text }}
                    >
                      {mail.tag.label}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Detay paneli ── */}
      <div className={styles.detailPanel}>
        {!activeMail ? (
          <div className={styles.emptyDetail}>
            <div className={styles.emptyDetailIcon}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p style={{ fontSize: 13 }}>
              {language === "tr" ? "Okumak için bir mail seçin" : "Select a mail to read"}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.detailHeader}>
              <h2 className={styles.detailSubject}>{activeMail.subject}</h2>
              <div className={styles.detailMeta}>
                <div className={styles.detailSenderRow}>
                  <div className={styles.detailAvatar} style={{ background: activeMail.color }}>
                    {activeMail.initials}
                  </div>
                  <div>
                    <p className={styles.detailSenderName}>{activeMail.sender}</p>
                    <p className={styles.detailSenderEmail}>{activeMail.email}</p>
                  </div>
                </div>
                <div className={styles.detailMetaRight}>
                  <span className={styles.detailDate}>{activeMail.time}</span>
                  <button className={styles.iconBtn} title={language === "tr" ? "Yıldız" : "Star"}>
                    <svg width="14" height="14" fill={activeMail.starred ? "#f59e0b" : "none"} viewBox="0 0 24 24" stroke={activeMail.starred ? "#f59e0b" : "currentColor"} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button className={styles.iconBtn} title={language === "tr" ? "Arşivle" : "Archive"}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                  <button className={styles.iconBtn} title={language === "tr" ? "Sil" : "Delete"}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* İçerik */}
            <div className={styles.detailBody}>
              {activeMail.body.map((para, i) => (
                <p key={i} style={{ whiteSpace: "pre-line" }}>{para}</p>
              ))}
            </div>

            {/* Ekler */}
            {activeMail.attachments && activeMail.attachments.length > 0 && (
              <div className={styles.detailAttachments}>
                <span className={styles.attachmentLabel}>
                  {language === "tr" ? "EKLER" : "ATTACHMENTS"}
                </span>
                {activeMail.attachments.map((a) => (
                  <div key={a.name} className={styles.attachmentChip}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {a.name}
                    <span style={{ opacity: 0.6 }}>{a.size}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Compose / Yanıt */}
            <div className={styles.replyCompose} data-mention-zone="">

              {/* @mention dropdown */}
              {mentionQuery !== null && filteredPeople.length > 0 && (
                <div className={styles.mentionDropdown}>
                  <p className={styles.mentionDropdownLabel}>
                    {language === "tr" ? "Kişi Etiketle" : "Mention Person"}
                  </p>
                  {filteredPeople.map((p) => (
                    <div key={p.email} className={styles.mentionOption} onClick={() => insertMention(p)}>
                      <div className={styles.mentionOptionAvatar} style={{ background: p.color }}>
                        {p.initials}
                      </div>
                      <div>
                        <p className={styles.mentionOptionName}>{p.name}</p>
                        <p className={styles.mentionOptionEmail}>{p.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Alıcılar (etiketlenmiş kişiler) */}
              <div className={styles.replyComposeHeader}>
                <span className={styles.replyToLabel}>
                  {language === "tr" ? "Kime:" : "To:"}
                </span>
                <div className={styles.mentionChip} style={{ background: activeMail.color }}>
                  <span className={styles.mentionChipAvatar}>{activeMail.initials}</span>
                  {activeMail.sender}
                </div>
                {mentions.map((m) => (
                  <div key={m.email} className={styles.mentionChip} style={{ background: m.color }}>
                    <span className={styles.mentionChipAvatar}>{m.initials}</span>
                    {m.name}
                    <span className={styles.mentionChipRemove} onClick={() => removeMention(m.email)}>
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>

              {/* Metin alanı */}
              <textarea
                ref={textareaRef}
                className={styles.replyTextarea}
                placeholder={language === "tr"
                  ? `${activeMail.sender}'a yanıtla... (@isim ile etiketle)`
                  : `Reply to ${activeMail.sender}... (type @ to mention)`}
                value={replyText}
                onChange={handleReplyChange}
                onKeyDown={(e) => { if (e.key === "Escape") setMentionQuery(null); }}
              />

              {/* Eklenen dosyalar */}
              {attachedFiles.length > 0 && (
                <div className={styles.attachedFilesList}>
                  {attachedFiles.map((f) => (
                    <div key={f.name} className={styles.attachedFileChip}>
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>{f.name}</span>
                      <span style={{ opacity: 0.55 }}>{f.size}</span>
                      <span className={styles.attachedFileRemove} onClick={() => removeFile(f.name)}>
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Araç çubuğu */}
              <div className={styles.replyToolbar}>
                <div className={styles.replyToolbarLeft}>
                  {/* Dosya ekle */}
                  <button
                    className={styles.toolbarBtn}
                    title={language === "tr" ? "Dosya Ekle" : "Attach File"}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  {/* @Etiketle */}
                  <button
                    className={styles.toolbarBtn}
                    title={language === "tr" ? "Kişi Etiketle" : "Mention Person"}
                    onClick={() => {
                      setReplyText((t) => t + "@");
                      setMentionQuery("");
                      setTimeout(() => textareaRef.current?.focus(), 0);
                    }}
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </button>
                  {/* Emoji */}
                  <button className={styles.toolbarBtn} title="Emoji">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <button
                  className={styles.replyBtn}
                  style={{ background: accentColor }}
                  onClick={() => { setReplyText(""); setMentions([]); setAttachedFiles([]); }}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {language === "tr" ? "Gönder" : "Send"}
                </button>
              </div>

              {/* Gizli dosya input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
