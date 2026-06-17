const KEY = "journal_entries";

export type JournalEntry = {
  id: string;
  createdAt: string;
  prompt: string;
  body: string;
  sourceTruthId?: string;
};

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function isJournalEntry(value: unknown): value is JournalEntry {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.prompt === "string" &&
    typeof item.body === "string" &&
    (item.sourceTruthId === undefined || typeof item.sourceTruthId === "string")
  );
}

export function loadJournalEntries(): JournalEntry[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isJournalEntry) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(entries));
}
