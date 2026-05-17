"use client";

import { useRef, useState, useEffect } from "react";
import { useApp, AccentColor, Language } from "@/context/AppContext";
import styles from "@/styles/topbar.module.scss";

const ACCENT_OPTIONS: { color: AccentColor; hex: string; label: { tr: string; en: string } }[] = [
  { color: "red",   hex: "#c41e3a", label: { tr: "Kırmızı", en: "Red"   } },
  { color: "green", hex: "#2e8b57", label: { tr: "Yeşil",   en: "Green" } },
  { color: "blue",  hex: "#005eb8", label: { tr: "Mavi",    en: "Blue"  } },
];

const SunIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
  </svg>
);
const MoonIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const ChevronDown = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const SignOutIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function Topbar() {
  const { accent, setAccent, darkMode, toggleDarkMode, language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dropdown konumunu hesapla (fixed positioning için)
  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={styles.topbar} data-accent={accent}>
      <p className={styles.greeting}>
        {language === "tr" ? "Hoş geldiniz 👋" : "Welcome 👋"}
      </p>

      <div className={styles.actions}>
        {/* Profil + Dropdown */}
        <div className={styles.profileWrap}>
          <button
            ref={buttonRef}
            className={styles.profile}
            onClick={handleToggle}
          >
            <div className={styles.avatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/cordelio-harf.png" alt="Avatar" />
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Cordelio</span>
              <span className={styles.profileRole}>Admin</span>
            </div>
            <span className={`${styles.profileChevron} ${open ? styles.profileChevronOpen : ""}`}>
              <ChevronDown />
            </span>
          </button>

          {open && (
            <div
              ref={dropdownRef}
              className={styles.dropdown}
              style={{ top: dropdownPos.top, right: dropdownPos.right }}
            >
              {/* ─── Profil başlığı ─── */}
              <div className={styles.dropdownProfile}>
                <div className={styles.dropdownAvatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image/cordelio-harf.png" alt="Avatar" />
                </div>
                <div>
                  <p className={styles.dropdownName}>Cordelio</p>
                  <p className={styles.dropdownEmail}>admin@cordelio.dev</p>
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              {/* ─── Renk teması ─── */}
              <div className={styles.dropdownSection}>
                <span className={styles.dropdownSectionLabel}>
                  {language === "tr" ? "Renk Teması" : "Color Theme"}
                </span>
                <div className={styles.dropdownColors}>
                  {ACCENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.color}
                      onClick={() => setAccent(opt.color)}
                      className={`${styles.dropdownColorBtn} ${accent === opt.color ? styles.dropdownColorBtnActive : ""}`}
                      style={{ "--dot-color": opt.hex } as React.CSSProperties}
                      title={opt.label[language]}
                    >
                      <span className={styles.dropdownColorDot} style={{ backgroundColor: opt.hex }} />
                      {opt.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              {/* ─── Dark mode ─── */}
              <button
                className={styles.dropdownRow}
                onClick={toggleDarkMode}
              >
                <span className={styles.dropdownRowIcon}>
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </span>
                <span className={styles.dropdownRowLabel}>
                  {darkMode
                    ? (language === "tr" ? "Aydınlık Mod" : "Light Mode")
                    : (language === "tr" ? "Karanlık Mod" : "Dark Mode")}
                </span>
                <span className={`${styles.dropdownToggle} ${darkMode ? styles.dropdownToggleOn : ""}`}>
                  <span className={styles.dropdownToggleThumb} />
                </span>
              </button>

              {/* ─── Dil ─── */}
              <div className={styles.dropdownRow} style={{ cursor: "default" }}>
                <span className={styles.dropdownRowIcon}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </span>
                <span className={styles.dropdownRowLabel}>
                  {language === "tr" ? "Dil" : "Language"}
                </span>
                <div className={styles.dropdownLangSwitch}>
                  {(["tr", "en"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`${styles.dropdownLangBtn} ${language === lang ? styles.dropdownLangBtnActive : ""}`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              {/* ─── Çıkış ─── */}
              <button className={styles.dropdownSignOut}>
                <SignOutIcon />
                {language === "tr" ? "Çıkış Yap" : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
