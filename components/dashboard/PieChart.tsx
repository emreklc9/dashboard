"use client";

import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { pieData, PIE_COLORS } from "@/lib/mockData";

const LABELS = {
  tr: "Trafik Kaynakları",
  en: "Traffic Sources",
};

export default function PieChart() {
  const { language, darkMode } = useApp();
  const data = pieData[language];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
        {LABELS[language]}
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: darkMode ? "#1e293b" : "#fff",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [`%${value}`, ""]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => (
              <span style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>{value}</span>
            )}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
