// ── İstatistik Kartları ────────────────────────────────────────────────────
export const statsData = [
  {
    id: "users",
    label: { tr: "Toplam Kullanıcı", en: "Total Users" },
    value: "24,512",
    change: +12.4,
    icon: "users",
    color: "blue",
  },
  {
    id: "revenue",
    label: { tr: "Gelir", en: "Revenue" },
    value: "₺184,320",
    change: +8.1,
    icon: "revenue",
    color: "green",
  },
  {
    id: "orders",
    label: { tr: "Siparişler", en: "Orders" },
    value: "3,847",
    change: -3.2,
    icon: "orders",
    color: "red",
  },
  {
    id: "growth",
    label: { tr: "Büyüme", en: "Growth" },
    value: "%18.6",
    change: +5.7,
    icon: "growth",
    color: "purple",
  },
];

// ── Line Chart (aylık ziyaretçi & satış) ─────────────────────────────────
const months = {
  tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const rawLine = [
  { visitors: 4200, sales: 2400 },
  { visitors: 5800, sales: 3100 },
  { visitors: 5100, sales: 2800 },
  { visitors: 7200, sales: 4200 },
  { visitors: 6400, sales: 3800 },
  { visitors: 8900, sales: 5100 },
  { visitors: 9200, sales: 5600 },
  { visitors: 8100, sales: 4900 },
  { visitors: 10400, sales: 6200 },
  { visitors: 11200, sales: 7100 },
  { visitors: 9800, sales: 5900 },
  { visitors: 13100, sales: 8400 },
];

export const lineData = (lang: "tr" | "en") =>
  rawLine.map((d, i) => ({ ...d, month: months[lang][i] }));

// ── Bar Chart (aylık gelir) ────────────────────────────────────────────────
const rawBar = [14200, 18900, 16400, 22100, 19800, 27500, 31200, 28700, 34100, 38600, 33200, 44800];

export const barData = (lang: "tr" | "en") =>
  rawBar.map((revenue, i) => ({ month: months[lang][i], revenue }));

// ── Pie Chart (trafik kaynakları) ─────────────────────────────────────────
export const pieData = {
  tr: [
    { name: "Organik", value: 38 },
    { name: "Sosyal Medya", value: 24 },
    { name: "Doğrudan", value: 18 },
    { name: "E-posta", value: 12 },
    { name: "Diğer", value: 8 },
  ],
  en: [
    { name: "Organic", value: 38 },
    { name: "Social Media", value: 24 },
    { name: "Direct", value: 18 },
    { name: "Email", value: 12 },
    { name: "Other", value: 8 },
  ],
};

export const PIE_COLORS = ["#005eb8", "#2e8b57", "#c41e3a", "#f59e0b", "#8b5cf6"];

// ── Tablo (son siparişler) ────────────────────────────────────────────────
export type Order = {
  id: string;
  customer: string;
  product: { tr: string; en: string };
  amount: string;
  status: "completed" | "pending" | "cancelled";
  date: string;
};

export const tableData: Order[] = [
  { id: "#4821", customer: "Ali Yılmaz",    product: { tr: "Pro Plan",    en: "Pro Plan"    }, amount: "₺1,200", status: "completed", date: "17 May 2026" },
  { id: "#4820", customer: "Ayşe Demir",    product: { tr: "Starter",     en: "Starter"     }, amount: "₺480",   status: "pending",   date: "17 May 2026" },
  { id: "#4819", customer: "Mehmet Kaya",   product: { tr: "Enterprise",  en: "Enterprise"  }, amount: "₺4,800", status: "completed", date: "16 May 2026" },
  { id: "#4818", customer: "Fatma Çelik",   product: { tr: "Pro Plan",    en: "Pro Plan"    }, amount: "₺1,200", status: "cancelled", date: "16 May 2026" },
  { id: "#4817", customer: "Kemal Arslan",  product: { tr: "Starter",     en: "Starter"     }, amount: "₺480",   status: "completed", date: "15 May 2026" },
  { id: "#4816", customer: "Zeynep Kurt",   product: { tr: "Enterprise",  en: "Enterprise"  }, amount: "₺4,800", status: "pending",   date: "15 May 2026" },
  { id: "#4815", customer: "Hasan Şahin",   product: { tr: "Pro Plan",    en: "Pro Plan"    }, amount: "₺1,200", status: "completed", date: "14 May 2026" },
];

// ── Bildirimler / Bilgilendirme alanı ─────────────────────────────────────
export const noticeData = {
  tr: [
    { type: "info",    text: "Sistem bakımı 22 Mayıs 02:00–04:00 arasında gerçekleşecek." },
    { type: "success", text: "Bu ayki hedef %94 oranında tamamlandı." },
    { type: "warning", text: "3 kullanıcının aboneliği bu hafta sona eriyor." },
    { type: "info",    text: "Yeni özellik: Gelişmiş rapor dışa aktarma hazır." },
  ],
  en: [
    { type: "info",    text: "System maintenance scheduled May 22, 02:00–04:00." },
    { type: "success", text: "Monthly target reached 94% completion." },
    { type: "warning", text: "3 user subscriptions expire this week." },
    { type: "info",    text: "New feature: Advanced report export is ready." },
  ],
};
