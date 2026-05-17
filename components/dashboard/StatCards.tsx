"use client";

import { useApp } from "@/context/AppContext";
import { statsData } from "@/lib/mockData";

const ICONS = {
  users: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  revenue: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  orders: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  growth: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
};

const COLOR_MAP: Record<string, { bg: string; icon: string; text: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-900/20",   icon: "text-blue-600 dark:text-blue-400",   text: "text-blue-600 dark:text-blue-400" },
  green:  { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600 dark:text-green-400", text: "text-green-600 dark:text-green-400" },
  red:    { bg: "bg-red-50 dark:bg-red-900/20",     icon: "text-red-500 dark:text-red-400",     text: "text-red-500 dark:text-red-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", text: "text-purple-600 dark:text-purple-400" },
};

export default function StatCards() {
  const { language } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const c = COLOR_MAP[stat.color];
        const isPositive = stat.change >= 0;
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${c.bg}`}>
              <span className={`w-6 h-6 ${c.icon}`}>
                {ICONS[stat.icon as keyof typeof ICONS]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                {stat.label[language]}
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5 leading-none">
                {stat.value}
              </p>
              <p className={`text-xs font-medium mt-1 ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                {isPositive ? "▲" : "▼"} {Math.abs(stat.change)}%
                <span className="text-zinc-400 dark:text-zinc-500 ml-1 font-normal">
                  {language === "tr" ? "geçen aya göre" : "vs last month"}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
