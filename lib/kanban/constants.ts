import type { Member, Tag } from "./types";

export const KANBAN_TAGS: Record<string, Tag> = {
  bug:     { label: "Bug",           bg: "#fee2e2", color: "#dc2626" },
  feature: { label: "Feature",       bg: "#ede9fe", color: "#7c3aed" },
  review:  { label: "Review",        bg: "#fef3c7", color: "#d97706" },
  design:  { label: "Design",        bg: "#d1fae5", color: "#059669" },
  testing: { label: "Testing",       bg: "#e0f2fe", color: "#0284c7" },
  docs:    { label: "Documentation", bg: "#dbeafe", color: "#1d4ed8" },
  hotfix:  { label: "Hotfix",        bg: "#fce7f3", color: "#be185d" },
  backend: { label: "Backend",       bg: "#f3f4f6", color: "#374151" },
};

export const KANBAN_TAG_LIST: Tag[] = Object.values(KANBAN_TAGS);

export const KANBAN_MEMBERS: Member[] = [
  { initials: "ED", bg: "#8b5cf6", name: "Ayşe Kaya" },
  { initials: "JS", bg: "#0ea5e9", name: "Mehmet Demir" },
  { initials: "TA", bg: "#f59e0b", name: "Zeynep Arslan" },
  { initials: "DW", bg: "#10b981", name: "Can Yılmaz" },
  { initials: "AK", bg: "#ef4444", name: "Elif Şahin" },
];
