import bundled from "@/data/content.bundled.json";
import type { ContentPayload, TruthCategory } from "@/data/verseUtils";

const REMOTE_URL = process.env.NEXT_PUBLIC_CONTENT_URL;

const KEYS = {
  data: "verses_data",
  etag: "verses_etag",
  checkedAt: "verses_checked_at",
} as const;

const THROTTLE_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 3000;
const MAX_PAYLOAD_BYTES = 1_000_000;
const MAX_TRUTHS = 1000;
const MAX_STRUGGLES = 100;
const CATEGORIES = new Set<TruthCategory>([
  "Purpose",
  "Identity",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
]);

const BUNDLED: ContentPayload = bundled as ContentPayload;

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isCategory(value: unknown): value is TruthCategory {
  return isNonEmptyString(value) && CATEGORIES.has(value as TruthCategory);
}

function isVerseRef(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return isNonEmptyString(obj.reference) && isNonEmptyString(obj.verse);
}

function isTruth(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  if (!isNonEmptyString(entry.id)) return false;
  if (!isCategory(entry.category)) return false;
  if (!isNonEmptyString(entry.statement)) return false;
  if (!isNonEmptyString(entry.reference)) return false;
  if (!isNonEmptyString(entry.verse)) return false;
  if (!isNonEmptyString(entry.reflectionQuestion)) return false;
  if (!isNonEmptyString(entry.journalPrompt)) return false;

  if (entry.personalized !== undefined) {
    if (typeof entry.personalized !== "object" || entry.personalized === null) {
      return false;
    }
    const personalized = entry.personalized as Record<string, unknown>;
    if (!isNonEmptyString(personalized.masculine)) return false;
    if (!isNonEmptyString(personalized.feminine)) return false;
  }

  return true;
}

function isStruggle(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  if (!isNonEmptyString(entry.id)) return false;
  if (!isNonEmptyString(entry.label)) return false;
  if (!isCategory(entry.category)) return false;
  if (!isNonEmptyString(entry.lie)) return false;
  if (!isNonEmptyString(entry.truth)) return false;
  if (!Array.isArray(entry.verses) || entry.verses.length === 0) return false;
  if (!entry.verses.every(isVerseRef)) return false;
  if (!isNonEmptyString(entry.reflection)) return false;
  if (!isNonEmptyString(entry.prayer)) return false;
  return true;
}

export function isContentPayload(value: unknown): value is ContentPayload {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (!isNonEmptyString(obj.version)) return false;
  if (!Array.isArray(obj.truths)) return false;
  if (!Array.isArray(obj.struggles)) return false;
  if (obj.truths.length === 0 || obj.truths.length > MAX_TRUTHS) return false;
  if (obj.struggles.length === 0 || obj.struggles.length > MAX_STRUGGLES) {
    return false;
  }
  return obj.truths.every(isTruth) && obj.struggles.every(isStruggle);
}

export async function loadInitialContent(): Promise<ContentPayload> {
  if (!hasLocalStorage()) return BUNDLED;

  let cache: ContentPayload | null = null;
  try {
    const raw = localStorage.getItem(KEYS.data);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isContentPayload(parsed)) cache = parsed;
    }
  } catch {
    // ignore — fall through to bundled
  }

  if (!cache) return BUNDLED;
  return cache.version > BUNDLED.version ? cache : BUNDLED;
}

export async function refreshRemoteContent(options?: {
  force?: boolean;
}): Promise<void> {
  if (!hasLocalStorage() || !REMOTE_URL) return;

  try {
    if (!options?.force) {
      const checkedAtRaw = localStorage.getItem(KEYS.checkedAt);
      if (checkedAtRaw) {
        const checkedAt = Date.parse(checkedAtRaw);
        if (Number.isFinite(checkedAt) && Date.now() - checkedAt < THROTTLE_MS) {
          return;
        }
      }
    }

    const etag = localStorage.getItem(KEYS.etag);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(REMOTE_URL, {
        signal: controller.signal,
        headers: etag ? { "If-None-Match": etag } : undefined,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 304) {
      localStorage.setItem(KEYS.checkedAt, new Date().toISOString());
      return;
    }
    if (!response.ok) return;

    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > MAX_PAYLOAD_BYTES) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return;
    }
    if (!isContentPayload(parsed)) return;

    const nextEtag = response.headers.get("ETag");
    localStorage.setItem(KEYS.data, JSON.stringify(parsed));
    if (nextEtag) localStorage.setItem(KEYS.etag, nextEtag);
    localStorage.setItem(KEYS.checkedAt, new Date().toISOString());
  } catch {
    // network/parse error — keep bundled/cached content
  }
}
