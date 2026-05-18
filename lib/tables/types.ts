export type TableStatus = "active" | "inactive" | "pending";

export type ExpandableSubRow = {
  id: string;
  name: string;
  metric: string;
  metricColor: string;
  tag: { label: string; bg: string; color: string };
  status: TableStatus;
};

export type UsageBar = {
  label: string;
  used: string;
  total: string;
  segments: { color: string; percent: number }[];
};

export type ExpandableRow = {
  id: string;
  domain: string;
  plan: string;
  usage: UsageBar[];
  progress: { current: number; total: number };
  status: TableStatus;
  children: ExpandableSubRow[];
};

export type DataGridRow = {
  id: string;
  domain: string;
  customer: string;
  plan: string;
  region: string;
  storage: string;
  bandwidth: string;
  visitors: string;
  ssl: string;
  renews: string;
  status: TableStatus;
};

export type StandardRow = {
  id: string;
  order: string;
  customer: string;
  product: string;
  amount: string;
  status: TableStatus;
  date: string;
};

export type ExportColumn<T> = {
  key: keyof T;
  label: string;
  format?: (row: T) => string;
};
