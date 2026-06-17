const KEY = "favorite_truth_ids";

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadFavoriteIds(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value) => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: string[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
}
