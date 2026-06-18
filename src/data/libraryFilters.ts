import type { Truth, TruthCategory } from "./verseUtils";

export type LibraryFilterGroup = "truths" | "lies";

export type LibraryFilter = {
  group: LibraryFilterGroup | null;
  category: TruthCategory | null;
};

export function filterLibraryCards(
  filter: LibraryFilter,
  truthCards: Truth[],
  lieCards: Truth[],
) {
  const pool =
    filter.group === null
      ? [...truthCards, ...lieCards]
      : filter.group === "lies"
        ? lieCards
        : truthCards;

  if (!filter.category) return pool;
  return pool.filter((truth) => truth.category === filter.category);
}
