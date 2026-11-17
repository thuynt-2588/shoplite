// Product utilities
import type { SortDirection } from "./types.ts";

// Search normalization
function normalize(str: unknown): string {
  return String(str ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Filtering
export function filterByKeyword<T extends { title: string }>(list: readonly T[], q: string): T[] {
  const keyword = normalize(q);
  if (!keyword) return [...list];
  return list.filter((p) => normalize(p.title).includes(keyword));
}

// Sorting
export function sortByPrice<T extends { price: number }>(
  list: readonly T[],
  dir: SortDirection = "asc",
): T[] {
  const sign = dir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => (a.price - b.price) * sign);
}
