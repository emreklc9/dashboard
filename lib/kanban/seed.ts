import type { Attachment, Comment } from "./types";
import { KANBAN_MEMBERS } from "./constants";

const SAMPLE_TEXTS = [
  "Bu görev için tasarım onayı bekleniyor.",
  "API endpoint'leri hazır, test edebilirsiniz.",
  "Dark mode için renk paletini güncelledim.",
  "Bir sorun var, detayları paylaştım.",
  "Harika iş, merge edebiliriz.",
];

export function seedComments(count: number, cardId: number): Comment[] {
  return Array.from({ length: count }, (_, i) => {
    const m = KANBAN_MEMBERS[i % KANBAN_MEMBERS.length];
    return {
      id: cardId * 1000 + i,
      text: SAMPLE_TEXTS[i % SAMPLE_TEXTS.length],
      author: m.name ?? m.initials,
      initials: m.initials,
      authorBg: m.bg,
      time: `${10 + i}:${(i * 7) % 60}`.padStart(2, "0"),
    };
  });
}

export function seedAttachments(count: number, cardId: number): Attachment[] {
  const names = ["spec.pdf", "mockup.fig", "screenshot.png", "notes.docx", "data.xlsx"];
  const sizes = ["1.2 MB", "840 KB", "2.4 MB", "320 KB", "1.8 MB"];
  return Array.from({ length: count }, (_, i) => ({
    id: cardId * 100 + i,
    name: names[i % names.length],
    size: sizes[i % sizes.length],
  }));
}
