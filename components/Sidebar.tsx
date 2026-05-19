"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import { useSidebar } from "@/context/SidebarContext";
import styles from "@/styles/sidebar.module.scss";

type NavLabel = { tr: string; en: string };

type NavChild = {
  href: string;
  label: NavLabel;
};

type NavItem = {
  href: string;
  label: NavLabel;
  icon: ReactNode;
  badge?: number;
  hasChevron?: boolean;
  children?: NavChild[];
};

type SettingsItem = {
  href: string;
  label: NavLabel;
  icon: ReactNode;
};

function hasChildren(item: NavItem): item is NavItem & { children: NavChild[] } {
  return Array.isArray(item.children) && item.children.length > 0;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: { tr: "Dashboard", en: "Dashboard" },
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/tables",
    label: { tr: "Tablolar", en: "Tables" },
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
      </svg>
    ),
  },
  {
    href: "/kanban",
    label: { tr: "Kanban", en: "Kanban" },
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: { tr: "Sohbet", en: "Chat" },
    badge: 5,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: "/mail",
    label: { tr: "Posta", en: "Mail" },
    badge: 12,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/components",
    label: { tr: "Bileşenler", en: "Components" },
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    hasChevron: true,
  },
];

const SETTINGS_ITEMS: SettingsItem[] = [
  {
    href: "/settings",
    label: { tr: "Ayarlar", en: "Settings" },
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const ChevronRight = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { accent, language } = useApp();
  const { isOpen, close } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const toggleMenu = (href: string) =>
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      data-accent={accent}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon} data-accent={accent}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cordelio-harf.png" alt="C" className={styles.logoImg} />
        </div>
        <div className={styles.logoText}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cordelio.png" alt="Cordelio" className={styles.logoWordmark} data-accent={accent} />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={close}
          aria-label={language === "tr" ? "Menüyü kapat" : "Close menu"}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Ana Navigasyon */}
      <span className={styles.sectionLabel}>
        {language === "tr" ? "Genel" : "General"}
      </span>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <div key={item.href}>
            {hasChildren(item) ? (
              /* Alt menüsü olan öğe — button olarak render et */
              <>
                <button
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
                  data-accent={accent}
                  onClick={() => toggleMenu(item.href)}
                >
                  <span className={styles.iconWrap}>{item.icon}</span>
                  <span className={styles.label}>{item.label[language]}</span>
                  <span className={`${styles.chevron} ${openMenus[item.href] ? styles.chevronOpen : ""}`}>
                    <ChevronRight />
                  </span>
                </button>
                {openMenus[item.href] && (
                  <div className={styles.subMenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`${styles.subItem} ${isActive(child.href) ? styles.subItemActive : ""}`}
                        onClick={close}
                      >
                        <span className={styles.subItemDot} />
                        {child.label[language]}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Normal link */
              <Link
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
                data-accent={accent}
                onClick={close}
              >
                <span className={styles.iconWrap}>{item.icon}</span>
                <span className={styles.label}>{item.label[language]}</span>
                {item.badge && (
                  <span className={`${styles.badge} ${isActive(item.href) ? styles.badgeActive : ""}`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {item.hasChevron && (
                  <span className={styles.chevron}><ChevronRight /></span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Ayırıcı */}
      <div className={styles.divider} />

      {/* Alt Navigasyon */}
      <span className={styles.sectionLabel}>
        {language === "tr" ? "Sistem" : "System"}
      </span>
      <nav className={styles.nav} style={{ flex: "0 0 auto", paddingBottom: "16px" }}>
        {SETTINGS_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
            data-accent={accent}
            onClick={close}
          >
            <span className={styles.iconWrap}>{item.icon}</span>
            <span className={styles.label}>{item.label[language]}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
