"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { lineData } from "@/lib/mockData";

const LABELS = {
  tr: { title: "Aylık Ziyaretçi & Satış", visitors: "Ziyaretçi", sales: "Satış" },
  en: { title: "Monthly Visitors & Sales", visitors: "Visitors", sales: "Sales" },
};

export default function LineChart() {
  const { language, darkMode } = useApp();
  const data = lineData(language);
  const l = LABELS[language];

  const axisColor = darkMode ? "#64748b" : "#94a3b8";
  const gridColor = darkMode ? "#1e293b" : "#f1f5f9";

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
        {l.title}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#005eb8" stopOpacity={darkMode ? 0.25 : 0.15} />
              <stop offset="95%" stopColor="#005eb8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2e8b57" stopOpacity={darkMode ? 0.25 : 0.15} />
              <stop offset="95%" stopColor="#2e8b57" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
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
          />
          <Tooltip
            contentStyle={{
              background: darkMode ? "#1e293b" : "#fff",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="visitors"
            name={l.visitors}
            stroke="#005eb8"
            strokeWidth={2.5}
            fill="url(#gradVisitors)"
            dot={false}
            activeDot={{ r: 5, fill: "#005eb8" }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            name={l.sales}
            stroke="#2e8b57"
            strokeWidth={2.5}
            fill="url(#gradSales)"
            dot={false}
            activeDot={{ r: 5, fill: "#2e8b57" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
