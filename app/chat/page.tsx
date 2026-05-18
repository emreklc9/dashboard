"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/chat.module.scss";

// ─── Tipler ──────────────────────────────────────────────────────────────────

type Contact = {
  id: number;
  name: string;
  role: string;
  color: string;
  initials: string;
  online: boolean;
  unread: number;
  lastMessage: string;
  lastTime: string;
};

type Message = {
  id: number;
  contactId: number;
  text: string;
  time: string;
  self: boolean;
  date?: string;
};

// ─── Mock veri ───────────────────────────────────────────────────────────────

const CONTACTS: Contact[] = [
  { id: 1, name: "Ayşe Kaya",     role: "Tasarımcı",     color: "#8b5cf6", initials: "AK", online: true,  unread: 3,  lastMessage: "Figma dosyasını güncelledim 🎨", lastTime: "09:41" },
  { id: 2, name: "Mehmet Demir",  role: "Geliştirici",   color: "#0ea5e9", initials: "MD", online: true,  unread: 0,  lastMessage: "PR'ı gönderiyorum birazdan",       lastTime: "09:15" },
  { id: 3, name: "Zeynep Arslan", role: "Ürün Müdürü",   color: "#f59e0b", initials: "ZA", online: false, unread: 1,  lastMessage: "Sprint toplantısı saat 14:00'de",  lastTime: "Dün"   },
  { id: 4, name: "Can Yılmaz",    role: "DevOps",         color: "#10b981", initials: "CY", online: true,  unread: 0,  lastMessage: "Sunucu yeniden başlatıldı ✅",      lastTime: "Dün"   },
  { id: 5, name: "Elif Şahin",    role: "Analitik",       color: "#ef4444", initials: "EŞ", online: false, unread: 0,  lastMessage: "Raporu inceleyebilir misin?",       lastTime: "Çarş"  },
  { id: 6, name: "Burak Çelik",   role: "Pazarlama",      color: "#ec4899", initials: "BÇ", online: false, unread: 0,  lastMessage: "Kampanya planı hazır",              lastTime: "Salı"  },
];

const MESSAGES: Message[] = [
  { id: 1,  contactId: 1, text: "Merhaba! Bugün toplantıda konuştuğumuz arayüz değişikliklerini uyguladım.",                          time: "09:10", self: false, date: "Bugün" },
  { id: 2,  contactId: 1, text: "Harika! Hangi ekranları güncelledin?",                                                               time: "09:12", self: true  },
  { id: 3,  contactId: 1, text: "Dashboard, profil ve ayarlar sayfalarını. Renkler ve tipografi tamamen yenilendi.",                   time: "09:14", self: false },
  { id: 4,  contactId: 1, text: "Çok iyi görünüyor, tebrikler 👏 Dark mod da çalışıyor mu?",                                           time: "09:18", self: true  },
  { id: 5,  contactId: 1, text: "Evet, dark mode için ayrı bir renk paleti oluşturdum. Tailwind ile entegre ettim.",                   time: "09:22", self: false },
  { id: 6,  contactId: 1, text: "Bileşen kütüphanesini de hazırladım, istersen paylaşayım.",                                          time: "09:25", self: false },
  { id: 7,  contactId: 1, text: "Tabii, Figma linkini atabilirsin.",                                                                  time: "09:28", self: true  },
  { id: 8,  contactId: 1, text: "Figma dosyasını güncelledim 🎨",                                                                     time: "09:41", self: false },
  { id: 9,  contactId: 2, text: "Selam, yeni feature branch'i oluşturdum.",                                                           time: "08:50", self: false, date: "Bugün" },
  { id: 10, contactId: 2, text: "Harika. Hangi ticket'ı alıyorsun?",                                                                  time: "08:55", self: true  },
  { id: 11, contactId: 2, text: "AUTH-142, login akışını refactor ediyorum.",                                                         time: "09:00", self: false },
  { id: 12, contactId: 2, text: "PR'ı gönderiyorum birazdan",                                                                         time: "09:15", self: false },
  { id: 13, contactId: 3, text: "Sprint toplantısı saat 14:00'de, katılabiliyor musun?",                                              time: "Dün 15:30", self: false, date: "Dün" },
  { id: 14, contactId: 4, text: "Sunucu yeniden başlatıldı ✅ Artık stabil.",                                                          time: "Dün 11:20", self: false, date: "Dün" },
];

// ─── Bileşen ──────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { language, accent } = useApp();
  const [activeId, setActiveId] = useState<number>(1);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [search, setSearch] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const activeContact = CONTACTS.find((c) => c.id === activeId)!;
  const activeMessages = messages.filter((m) => m.contactId === activeId);
  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = () => new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), contactId: activeId, text, time: now(), self: true },
    ]);
    setInputText("");

    // Karşı taraf 1 saniye sonra aynı mesajı geri atar
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, contactId: activeId, text, time: now(), self: false },
      ]);
    }, 1000);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Renk accent'e göre send butonu rengi için inline stil
  const ACCENT_COLORS: Record<string, string> = {
    red: "#c41e3a", green: "#2e8b57", blue: "#005eb8",
  };
  const accentColor = ACCENT_COLORS[accent] ?? "#005eb8";

  return (
    <div style={{ height: "calc(100vh - 58px - 48px)" }} className={styles.chatWrap}>
      {/* ── Sol panel ── */}
      <div className={styles.contactPanel}>
        <div className={styles.contactPanelHeader}>
          <h2 className={styles.contactPanelTitle}>
            {language === "tr" ? "Mesajlar" : "Messages"}
          </h2>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              className={styles.searchInput}
              placeholder={language === "tr" ? "Kişi ara..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.contactList}>
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`${styles.contactItem} ${activeId === c.id ? styles.contactItemActive : ""}`}
              onClick={() => setActiveId(c.id)}
            >
              <div className={styles.avatarWrap}>
                <div className={styles.avatar} style={{ background: c.color }}>
                  {c.initials}
                </div>
                {c.online && <span className={styles.onlineDot} />}
              </div>
              <div className={styles.contactInfo}>
                <p className={styles.contactName}>{c.name}</p>
                <p className={styles.contactPreview}>{c.lastMessage}</p>
              </div>
              <div className={styles.contactMeta}>
                <span className={styles.contactTime}>{c.lastTime}</span>
                {c.unread > 0 && (
                  <span className={styles.unreadBadge} style={{ background: accentColor }}>
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sağ panel ── */}
      <div className={styles.chatPanel}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.avatar} style={{ background: activeContact.color, width: 36, height: 36, fontSize: 13 }}>
              {activeContact.initials}
            </div>
            <div>
              <p className={styles.chatHeaderName}>{activeContact.name}</p>
              <p className={styles.chatHeaderStatus}>
                {activeContact.online
                  ? (language === "tr" ? "● Çevrimiçi" : "● Online")
                  : (language === "tr" ? "Çevrimdışı" : "Offline")}
              </p>
            </div>
          </div>
          <div className={styles.chatHeaderActions}>
            {/* Telefon */}
            <button className={styles.headerBtn} title="Ara">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            {/* Video */}
            <button className={styles.headerBtn} title="Video">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            {/* Daha fazla */}
            <button className={styles.headerBtn} title="Daha fazla">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mesaj listesi */}
        <div className={styles.messageList}>
          {activeMessages.map((msg, i) => {
            const showDate = msg.date && (i === 0 || activeMessages[i - 1]?.date !== msg.date);
            return (
              <div key={msg.id}>
                {showDate && (
                  <div className={styles.dateDivider}>
                    <span>{msg.date}</span>
                  </div>
                )}
                <div className={`${styles.messageRow} ${msg.self ? styles.messageRowSelf : ""}`}>
                  {!msg.self && (
                    <div className={styles.msgAvatar} style={{ background: activeContact.color }}>
                      {activeContact.initials}
                    </div>
                  )}
                  <div className={`${styles.msgGroup} ${msg.self ? styles.msgGroupSelf : ""}`}>
                    <div
                      className={`${styles.messageBubble} ${msg.self ? styles.messageBubbleSelf : ""}`}
                      style={msg.self ? { background: accentColor } : undefined}
                    >
                      {msg.text}
                    </div>
                    <span className={`${styles.msgTime} ${msg.self ? styles.msgTimeSelf : ""}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Input */}
        <div className={styles.chatInputArea}>
          <div className={styles.chatInputWrap}>
            <button className={styles.inputBtn} title="Emoji">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <textarea
              className={styles.chatInput}
              rows={1}
              placeholder={language === "tr" ? "Mesaj yaz..." : "Type a message..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className={styles.inputBtn} title="Dosya ekle">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          <button
            className={styles.sendBtn}
            style={{ background: accentColor }}
            onClick={sendMessage}
            title={language === "tr" ? "Gönder" : "Send"}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
