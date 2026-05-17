"use client";

import { useApp, AccentColor, Language } from "@/context/AppContext";
import styles from "@/styles/topbar.module.scss";

const ACCENT_OPTIONS: { color: AccentColor; hex: string }[] = [
  { color: "red", hex: "#c41e3a" },
  { color: "green", hex: "#2e8b57" },
  { color: "blue", hex: "#005eb8" },
];

const SunIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const ChevronDown = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Topbar() {
  const { accent, setAccent, darkMode, toggleDarkMode, language, setLanguage } = useApp();

  return (
    <header className={styles.topbar} data-accent={accent}>
      <p className={styles.greeting}>
        {language === "tr" ? "Hoş geldiniz 👋" : "Welcome 👋"}
      </p>

      <div className={styles.actions}>
        {/* Renk Seçici */}
        <div className={styles.colorPicker}>
          {ACCENT_OPTIONS.map((opt) => (
            <button
              key={opt.color}
              onClick={() => setAccent(opt.color)}
              className={`${styles.colorDot} ${accent === opt.color ? styles.colorDotActive : ""}`}
              style={{ backgroundColor: opt.hex, color: opt.hex }}
              title={opt.color}
            />
          ))}
        </div>

        <div className={styles.divider} />

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className={styles.iconBtn}
          title={darkMode ? "Aydınlık mod" : "Karanlık mod"}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className={styles.divider} />

        {/* Dil Seçici */}
        <div className={styles.langSwitch}>
          {(["tr", "en"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`${styles.langBtn} ${language === lang ? styles.langBtnActive : ""}`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        {/* Profil */}
        <button className={styles.profile}>
          <div className={styles.avatar}><img src="/image/cordelio-harf.png" alt="Avatar" /></div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Cordelio</span>
            <span className={styles.profileRole}>Admin</span>
          </div>
          <span className={styles.profileChevron}><ChevronDown /></span>
        </button>
      </div>
    </header>
  );
}
