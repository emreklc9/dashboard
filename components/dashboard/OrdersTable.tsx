"use client";

import { useApp } from "@/context/AppContext";
import { tableData } from "@/lib/mockData";

const STATUS_STYLES = {
  completed: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  pending:   "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

const STATUS_LABELS = {
  tr: { completed: "Tamamlandı", pending: "Bekliyor", cancelled: "İptal" },
  en: { completed: "Completed",  pending: "Pending",  cancelled: "Cancelled" },
};

const HEADERS = {
  tr: ["Sipariş", "Müşteri", "Ürün", "Tutar", "Durum", "Tarih"],
  en: ["Order",   "Customer", "Product", "Amount", "Status", "Date"],
};

const TITLE = { tr: "Son Siparişler", en: "Recent Orders" };

export default function OrdersTable() {
  const { language } = useApp();
  const headers = HEADERS[language];
  const statusLabels = STATUS_LABELS[language];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {TITLE[language]}
        </h3>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {tableData.length} {language === "tr" ? "kayıt" : "records"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/40">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
            {tableData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {row.id}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                  {row.customer}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                  {row.product[language]}
                </td>
                <td className="px-4 py-3 font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                  {row.amount}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                    {statusLabels[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap text-xs">
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
