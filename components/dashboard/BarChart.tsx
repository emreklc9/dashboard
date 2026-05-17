"use client";

import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { barData } from "@/lib/mockData";

const LABELS = {
  tr: { title: "Aylık Gelir", key: "Gelir (₺)" },
  en: { title: "Monthly Revenue", key: "Revenue (₺)" },
};

export default function BarChart() {
  const { language, darkMode, accent } = useApp();
  const data = barData(language);
  const l = LABELS[language];

  const ACCENT_COLOR: Record<string, string> = {
    blue:  "#2d7dd2",
    green: "#369966",
    red:   "#d63c5a",
  };
  const barColor = ACCENT_COLOR[accent] ?? "#2d7dd2";
  const axisColor = darkMode ? "#64748b" : "#94a3b8";
  const gridColor = darkMode ? "#1e293b" : "#f1f5f9";

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
        {l.title}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <ReBarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ fill: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            contentStyle={{
              background: darkMode ? "#1e293b" : "#fff",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`₺${v.toLocaleString("tr-TR")}`, l.key]}
          />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={barColor}
                opacity={i === data.length - 1 ? 1 : 0.65}
              />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
