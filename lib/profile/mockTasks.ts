import type { ActiveTask } from "./types";

export const MOCK_ACTIVE_TASKS: ActiveTask[] = [
  {
    id: "t1",
    title: "Login sayfası video arka planı",
    project: "Dashboard",
    priority: "high",
    dueDate: "2026-05-22",
    status: "in_progress",
  },
  {
    id: "t2",
    title: "Profil API entegrasyonu",
    project: "Dashboard",
    priority: "medium",
    dueDate: "2026-05-24",
    status: "review",
  },
  {
    id: "t3",
    title: "Kanban filtre bileşeni",
    project: "Dashboard",
    priority: "low",
    dueDate: "2026-05-28",
    status: "todo",
  },
  {
    id: "t4",
    title: "Tablo CSV export testleri",
    project: "Dashboard",
    priority: "medium",
    dueDate: "2026-05-26",
    status: "in_progress",
  },
];
