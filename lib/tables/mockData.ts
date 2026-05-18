import type { DataGridRow, ExpandableRow, StandardRow } from "./types";

export const EXPANDABLE_ROWS: ExpandableRow[] = [
  {
    id: "1",
    domain: "paperpillar.com",
    plan: "Professional Plan",
    usage: [
      {
        label: "Disk",
        used: "35.36 GB",
        total: "120 GB",
        segments: [
          { color: "#22c55e", percent: 28 },
          { color: "#a855f7", percent: 18 },
          { color: "#3b82f6", percent: 22 },
          { color: "#f97316", percent: 12 },
        ],
      },
      {
        label: "Bant",
        used: "1.2 TB",
        total: "2 TB",
        segments: [
          { color: "#22c55e", percent: 35 },
          { color: "#6366f1", percent: 25 },
          { color: "#ec4899", percent: 15 },
        ],
      },
    ],
    progress: { current: 5, total: 10 },
    status: "active",
    children: [
      { id: "1a", name: "supply.paperpillar.com", metric: "1.5M", metricColor: "#3b82f6", tag: { label: "Primary", bg: "#dbeafe", color: "#1d4ed8" }, status: "active" },
      { id: "1b", name: "staging.paperpillar.com", metric: "420K", metricColor: "#ec4899", tag: { label: "Staging", bg: "#fce7f3", color: "#be185d" }, status: "active" },
      { id: "1c", name: "cdn.paperpillar.com", metric: "890K", metricColor: "#f97316", tag: { label: "Add-on", bg: "#ffedd5", color: "#c2410c" }, status: "active" },
    ],
  },
  {
    id: "2",
    domain: "samanthawilliam.com",
    plan: "Professional Plan",
    usage: [
      {
        label: "Disk",
        used: "18.2 GB",
        total: "120 GB",
        segments: [
          { color: "#22c55e", percent: 15 },
          { color: "#3b82f6", percent: 10 },
        ],
      },
      {
        label: "Bant",
        used: "640 GB",
        total: "2 TB",
        segments: [
          { color: "#a855f7", percent: 20 },
          { color: "#22c55e", percent: 12 },
        ],
      },
    ],
    progress: { current: 3, total: 10 },
    status: "active",
    children: [
      { id: "2a", name: "www.samanthawilliam.com", metric: "980K", metricColor: "#3b82f6", tag: { label: "Primary", bg: "#dbeafe", color: "#1d4ed8" }, status: "active" },
      { id: "2b", name: "blog.samanthawilliam.com", metric: "210K", metricColor: "#22c55e", tag: { label: "Add-on", bg: "#ffedd5", color: "#c2410c" }, status: "pending" },
    ],
  },
  {
    id: "3",
    domain: "northwind.io",
    plan: "Business Plan",
    usage: [
      {
        label: "Disk",
        used: "92.4 GB",
        total: "250 GB",
        segments: [
          { color: "#f97316", percent: 30 },
          { color: "#3b82f6", percent: 25 },
          { color: "#22c55e", percent: 12 },
        ],
      },
      {
        label: "Bant",
        used: "1.8 TB",
        total: "5 TB",
        segments: [
          { color: "#6366f1", percent: 22 },
          { color: "#ec4899", percent: 14 },
        ],
      },
    ],
    progress: { current: 8, total: 10 },
    status: "active",
    children: [
      { id: "3a", name: "api.northwind.io", metric: "2.1M", metricColor: "#6366f1", tag: { label: "Primary", bg: "#dbeafe", color: "#1d4ed8" }, status: "active" },
    ],
  },
  {
    id: "4",
    domain: "atelier-studio.co",
    plan: "Starter Plan",
    usage: [
      {
        label: "Disk",
        used: "4.1 GB",
        total: "30 GB",
        segments: [{ color: "#22c55e", percent: 14 }],
      },
      {
        label: "Bant",
        used: "120 GB",
        total: "500 GB",
        segments: [{ color: "#3b82f6", percent: 24 }],
      },
    ],
    progress: { current: 2, total: 5 },
    status: "inactive",
    children: [],
  },
];

export const DATA_GRID_ROWS: DataGridRow[] = [
  { id: "DG-001", domain: "paperpillar.com", customer: "Paper Pillar Ltd.", plan: "Professional", region: "eu-west-1", storage: "35.36 GB", bandwidth: "1.2 TB", visitors: "1.5M", ssl: "Aktif", renews: "12 Mar 2027", status: "active" },
  { id: "DG-002", domain: "samanthawilliam.com", customer: "Samantha William", plan: "Professional", region: "us-east-1", storage: "18.2 GB", bandwidth: "640 GB", visitors: "980K", ssl: "Aktif", renews: "28 Apr 2027", status: "active" },
  { id: "DG-003", domain: "northwind.io", customer: "Northwind Corp", plan: "Business", region: "eu-central-1", storage: "92.4 GB", bandwidth: "1.8 TB", visitors: "2.1M", ssl: "Aktif", renews: "05 Jan 2027", status: "active" },
  { id: "DG-004", domain: "atelier-studio.co", customer: "Atelier Studio", plan: "Starter", region: "ap-south-1", storage: "4.1 GB", bandwidth: "120 GB", visitors: "45K", ssl: "Süresi doldu", renews: "18 Jun 2026", status: "inactive" },
  { id: "DG-005", domain: "cordelio.dev", customer: "Cordelio", plan: "Enterprise", region: "eu-west-1", storage: "210 GB", bandwidth: "4.2 TB", visitors: "5.8M", ssl: "Aktif", renews: "30 Dec 2027", status: "active" },
  { id: "DG-006", domain: "mintleaf.app", customer: "Mintleaf Inc.", plan: "Business", region: "us-west-2", storage: "64 GB", bandwidth: "900 GB", visitors: "720K", ssl: "Aktif", renews: "14 Aug 2027", status: "pending" },
];

export const STANDARD_ROWS: StandardRow[] = [
  { id: "1", order: "#ORD-1042", customer: "Ayşe Kaya", product: "Hosting Pro", amount: "₺1.240", status: "active", date: "18 May 2026" },
  { id: "2", order: "#ORD-1041", customer: "Mehmet Demir", product: "Domain .com", amount: "₺320", status: "pending", date: "17 May 2026" },
  { id: "3", order: "#ORD-1040", customer: "Zeynep Arslan", product: "SSL Sertifikası", amount: "₺180", status: "active", date: "16 May 2026" },
  { id: "4", order: "#ORD-1039", customer: "Can Yılmaz", product: "CDN Paketi", amount: "₺890", status: "inactive", date: "15 May 2026" },
  { id: "5", order: "#ORD-1038", customer: "Elif Şahin", product: "E-posta Plus", amount: "₺450", status: "active", date: "14 May 2026" },
  { id: "6", order: "#ORD-1037", customer: "Burak Öztürk", product: "Backup 50GB", amount: "₺210", status: "active", date: "13 May 2026" },
];
