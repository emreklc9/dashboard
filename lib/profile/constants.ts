import type { JobRole } from "./types";

export const JOB_ROLE_OPTIONS: {
  value: JobRole;
  label: { tr: string; en: string };
}[] = [
  { value: "frontend", label: { tr: "Frontend Developer", en: "Frontend Developer" } },
  { value: "backend", label: { tr: "Backend Developer", en: "Backend Developer" } },
  { value: "fullstack", label: { tr: "Full Stack Developer", en: "Full Stack Developer" } },
  { value: "design_ux", label: { tr: "Design / UX", en: "Design / UX" } },
  { value: "product", label: { tr: "Product Manager", en: "Product Manager" } },
  { value: "devops", label: { tr: "DevOps", en: "DevOps" } },
  { value: "mobile", label: { tr: "Mobile Developer", en: "Mobile Developer" } },
  { value: "qa", label: { tr: "QA / Test", en: "QA / Test" } },
  { value: "other", label: { tr: "Diğer", en: "Other" } },
];

export const TIMEZONE_OPTIONS = [
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Tokyo",
];
