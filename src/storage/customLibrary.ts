import type { Struggle, Truth, TruthCategory } from "@/data/verseUtils";

const KEY = "custom_library_content";

export type CustomLibraryContent = {
  truths: Truth[];
  struggles: Struggle[];
};

export const defaultCustomLibraryContent: CustomLibraryContent = {
  truths: [],
  struggles: [],
};

const categories: TruthCategory[] = [
  "Purpose",
  "Identity",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
];

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isCategory(value: unknown): value is TruthCategory {
  return isString(value) && categories.includes(value as TruthCategory);
}

function isTruth(value: unknown): value is Truth {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    isCategory(item.category) &&
    isString(item.statement) &&
    isString(item.reference) &&
    isString(item.verse) &&
    isString(item.reflectionQuestion) &&
    isString(item.journalPrompt)
  );
}

function isVerseRef(value: unknown): value is { reference: string; verse: string } {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return isString(item.reference) && isString(item.verse);
}

function isStruggle(value: unknown): value is Struggle {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    isString(item.label) &&
    isCategory(item.category) &&
    isString(item.lie) &&
    isString(item.truth) &&
    Array.isArray(item.verses) &&
    item.verses.length > 0 &&
    item.verses.every(isVerseRef) &&
    isString(item.reflection) &&
    isString(item.prayer)
  );
}

export function loadCustomLibraryContent(): CustomLibraryContent {
  if (!hasStorage()) return defaultCustomLibraryContent;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultCustomLibraryContent;
    const parsed = JSON.parse(raw) as { truths?: unknown; struggles?: unknown };
    const truths = Array.isArray(parsed.truths)
      ? parsed.truths.filter(isTruth)
      : [];
    const struggles = Array.isArray(parsed.struggles)
      ? parsed.struggles.filter(isStruggle)
      : [];
    return { truths, struggles };
  } catch {
    return defaultCustomLibraryContent;
  }
}

export function saveCustomLibraryContent(content: CustomLibraryContent): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(content));
}
