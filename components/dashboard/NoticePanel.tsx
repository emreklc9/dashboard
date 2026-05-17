"use client";

import { useApp } from "@/context/AppContext";
import { noticeData } from "@/lib/mockData";

const TYPE_STYLES = {
  info:    { bar: "bg-blue-500",  bg: "bg-blue-50 dark:bg-blue-900/20",   text: "text-blue-700 dark:text-blue-300",   icon: "ℹ" },
  success: { bar: "bg-green-500", bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", icon: "✓" },
  warning: { bar: "bg-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-300", icon: "⚠" },
};

const TITLE = { tr: "Bildirimler & Duyurular", en: "Notices & Announcements" };

export default function NoticePanel() {
  const { language } = useApp();
  const notices = noticeData[language];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {TITLE[language]}
        </h3>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {notices.map((notice, i) => {
          const s = TYPE_STYLES[notice.type as keyof typeof TYPE_STYLES];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg ${s.bg}`}
            >
              <span className={`text-sm font-bold flex-shrink-0 mt-0.5 ${s.text}`}>
                {s.icon}
              </span>
              <div className={`flex-1 flex items-center`}>
                <span className={`flex-shrink-0 w-0.5 h-full min-h-[16px] rounded-full mr-3 ${s.bar}`} />
                <p className={`text-xs leading-relaxed ${s.text}`}>
                  {notice.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
