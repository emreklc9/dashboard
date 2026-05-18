import type { Card, Column } from "./types";
import { KANBAN_MEMBERS, KANBAN_TAG_LIST } from "./constants";

export type KanbanFilters = {
  memberInitials: string[];
  tagLabels: string[];
  columnIds: string[];
  search: string;
};

export const EMPTY_KANBAN_FILTERS: KanbanFilters = {
  memberInitials: [],
  tagLabels: [],
  columnIds: [],
  search: "",
};

export function cardMatchesFilters(card: Card, columnId: string, filters: KanbanFilters): boolean {
  if (filters.columnIds.length > 0 && !filters.columnIds.includes(columnId)) return false;

  if (filters.memberInitials.length > 0) {
    const hasMember = card.members.some((m) => filters.memberInitials.includes(m.initials));
    if (!hasMember) return false;
  }

  if (filters.tagLabels.length > 0) {
    const hasTag = card.tags.some((t) => filters.tagLabels.includes(t.label));
    if (!hasTag) return false;
  }

  const q = filters.search.trim().toLowerCase();
  if (q) {
    const inTitle = card.title.toLowerCase().includes(q);
    const inDesc = (card.description ?? "").toLowerCase().includes(q);
    if (!inTitle && !inDesc) return false;
  }

  return true;
}

export function hasActiveFilters(filters: KanbanFilters): boolean {
  return (
    filters.memberInitials.length > 0 ||
    filters.tagLabels.length > 0 ||
    filters.columnIds.length > 0 ||
    filters.search.trim().length > 0
  );
}

export type FilterChip = {
  id: string;
  kind: "member" | "tag" | "column" | "search";
  label: string;
};

export function buildFilterChips(
  filters: KanbanFilters,
  columns: Column[],
  language: "tr" | "en"
): FilterChip[] {
  const tr = language === "tr";
  const chips: FilterChip[] = [];

  for (const initials of filters.memberInitials) {
    const member = KANBAN_MEMBERS.find((m) => m.initials === initials);
    const name = member?.name ?? initials;
    chips.push({
      id: `member-${initials}`,
      kind: "member",
      label: `${tr ? "Atanan kişi" : "Assignee"}: ${name}`,
    });
  }

  for (const tagLabel of filters.tagLabels) {
    chips.push({
      id: `tag-${tagLabel}`,
      kind: "tag",
      label: `${tr ? "Etiket" : "Tag"}: ${tagLabel}`,
    });
  }

  for (const colId of filters.columnIds) {
    const col = columns.find((c) => c.id === colId);
    chips.push({
      id: `column-${colId}`,
      kind: "column",
      label: `${tr ? "Sütun" : "Column"}: ${col?.title ?? colId}`,
    });
  }

  if (filters.search.trim()) {
    chips.push({
      id: "search",
      kind: "search",
      label: `${tr ? "Arama" : "Search"}: ${filters.search.trim()}`,
    });
  }

  return chips;
}

export function removeFilterChip(filters: KanbanFilters, chip: FilterChip): KanbanFilters {
  switch (chip.kind) {
    case "member":
      return {
        ...filters,
        memberInitials: filters.memberInitials.filter(
          (i) => `member-${i}` !== chip.id
        ),
      };
    case "tag":
      return {
        ...filters,
        tagLabels: filters.tagLabels.filter((l) => `tag-${l}` !== chip.id),
      };
    case "column":
      return {
        ...filters,
        columnIds: filters.columnIds.filter((id) => `column-${id}` !== chip.id),
      };
    case "search":
      return { ...filters, search: "" };
    default:
      return filters;
  }
}

export { KANBAN_MEMBERS, KANBAN_TAG_LIST };
