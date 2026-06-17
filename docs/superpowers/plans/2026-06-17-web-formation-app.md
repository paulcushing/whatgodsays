# Web Formation App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing Next.js web app into the same calm, mobile-first formation experience as the Expo app — Today / Library / Journal / Favorites, struggle flow, custom content, sharing, and remote-content loading — with no notifications or reminders.

**Architecture:** Port the Expo app's data layer, storage, hooks, and components to a Next.js 14 App Router web app. Pure-logic modules (`content`, `dailyTruth`, `remoteContent`, `storage/*`) are framework-agnostic and unit-tested with Vitest. Content flows through a React context. Persistence uses `localStorage`. Screens and components are client components styled with Tailwind using theme tokens ported from the Expo `theme.ts`.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, `next/font/google` (Newsreader + Mulish), Vitest + jsdom (unit tests for logic only).

## Global Constraints

- Bundled content file is `src/data/content.bundled.json`, conforming to `ContentPayload` (`{ version, truths, struggles }`). It is the fallback content source.
- Remote content URL env var: `NEXT_PUBLIC_CONTENT_URL` (optional). Validate full payload shape before use; fall back to bundled on any failure.
- Categories are exactly: `Purpose`, `Identity`, `Fear`, `Anxiety`, `Rejection`, `Shame`, `Failure`, `Loneliness`.
- Persistence is browser `localStorage`, SSR-safe (guard `typeof window`). Reuse existing keys: `personalize`, `name`, `gender`. New keys: `favorite_truth_ids`, `journal_entries`, `custom_library_content`, `verses_data`, `verses_etag`, `verses_checked_at`.
- Share link format: `https://whatgodsaysabout.me/t/{id}`. Share text: `"{statement}" - {reference}\n{url}`.
- NO push notifications, NO reminder scheduling, NO native/Expo modules. The only settings surface is personalization (name + gender).
- Daily truth is deterministic by date (not random per render).
- TypeScript strict mode is on. All code must pass `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Path alias `@/*` → `./src/*` (already configured in tsconfig).
- Theme tokens (Tailwind) — colors: `page #f6f8fb`, `surface #edf2f8`, `ink #243347`, `scriptureInk #1b2737`, `softInk #5d6f85`, `mutedInk #8492a5`, `mutedInkAlt #9aa6b6`, `accent #607691`, `accentDeep #42576f`, `accentBright #7e94ad`, `tint #dce4ee`, `border #cfd7e2`, `borderSoft #dfe5ee`, `borderCool #c2ccd9`, `danger #8c6154`. Radii: sm 14px, md 20px, lg 24px, xl 28px (pill = `rounded-full`). Shadows: `card` = `0 18px 28px rgba(30,42,60,0.16)`, `soft` = `0 8px 18px rgba(30,42,60,0.08)`. Background gradient: `#f6f8fb → #edf2f8 → #d8e2ee → #aebed1`.

---

## File Structure

**Created:**
- `src/data/content.bundled.json` — bundled fallback content (copied from Expo app)
- `src/data/verseUtils.ts` — shared types
- `src/data/content.ts` — content lookup helpers
- `src/data/dailyTruth.ts` — deterministic daily truth + date/greeting formatting
- `src/data/ContentProvider.tsx` — content context + hooks
- `src/lib/remoteContent.ts` — remote fetch + validation + bundled fallback (localStorage)
- `src/storage/favorites.ts`, `journal.ts`, `customLibrary.ts`, `settings.ts` — localStorage modules
- `src/hooks/useFavorites.ts`, `useJournal.ts`, `useCustomLibrary.ts`, `useSettings.ts`, `useShareTruth.ts`
- `src/components/AppShell.tsx`, `BottomTabs.tsx`, `ActionPill.tsx`, `SaveHeartButton.tsx`, `Toast.tsx`, `TruthCard.tsx`, `ShareTruthCard.tsx`, `StruggleSheet.tsx`, `StruggleResponse.tsx`, `JournalCompose.tsx`, `CustomPromiseCompose.tsx`, `TruthLibraryFilters.tsx`, `PersonalizationPanel.tsx`
- `src/app/library/page.tsx`, `src/app/journal/page.tsx`, `src/app/favorites/page.tsx`, `src/app/t/[id]/page.tsx`
- `vitest.config.ts`, `vitest.setup.ts`
- Test files: `src/data/*.test.ts`, `src/lib/*.test.ts`, `src/storage/*.test.ts`

**Modified:**
- `tailwind.config.ts` — theme tokens, fonts; drop daisyUI
- `src/app/layout.tsx` — fonts (Newsreader/Mulish), drop daisyUI theme attr + AnimatePresence, ContentProvider
- `src/app/page.tsx` — becomes Today screen
- `src/app/[slug]/page.tsx` — becomes legacy numeric redirect
- `src/app/about/page.tsx` + `src/app/contactform.tsx` — restyled to new theme
- `src/app/globals.css` — base styles
- `package.json` — add vitest, jsdom; remove daisyui

**Deleted:**
- `src/app/begin.tsx`, `src/app/loadData.tsx`, `src/app/personalization.tsx` (old landing pieces)

---

## Task 1: Bundled content, types, and Vitest harness

**Files:**
- Create: `src/data/content.bundled.json` (copy from Expo app)
- Create: `src/data/verseUtils.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/data/content.bundled.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: types `TruthCategory`, `Truth`, `Struggle`, `ContentPayload` from `@/data/verseUtils`; a working `npm test` command.

- [ ] **Step 1: Ensure the bundled content file exists**

If the user has not yet copied it, copy from the adjacent Expo repo:

```bash
mkdir -p src/data
cp ../whatgodsaysaboutme-app/src/data/content.bundled.json src/data/content.bundled.json
test -s src/data/content.bundled.json && echo "content present"
```

Expected: `content present`.

- [ ] **Step 2: Add the types module**

Create `src/data/verseUtils.ts`:

```ts
export type TruthCategory =
  | "Purpose"
  | "Identity"
  | "Fear"
  | "Anxiety"
  | "Rejection"
  | "Shame"
  | "Failure"
  | "Loneliness";

export type Truth = {
  id: string;
  category: TruthCategory;
  statement: string;
  personalized?: {
    masculine: string;
    feminine: string;
  };
  reference: string;
  verse: string;
  reflectionQuestion: string;
  journalPrompt: string;
};

export type Struggle = {
  id: string;
  label: string;
  category: TruthCategory;
  lie: string;
  truth: string;
  verses: { reference: string; verse: string }[];
  reflection: string;
  prayer: string;
};

export type ContentPayload = {
  version: string;
  truths: Truth[];
  struggles: Struggle[];
};
```

- [ ] **Step 3: Install Vitest + jsdom**

Run:

```bash
npm install -D vitest@^2 jsdom@^25
```

Expected: installs without error.

- [ ] **Step 4: Add Vitest config and setup**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import { afterEach } from "vitest";

afterEach(() => {
  localStorage.clear();
});
```

- [ ] **Step 5: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 6: Write a smoke test for the bundled content shape**

Create `src/data/content.bundled.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import bundled from "./content.bundled.json";
import type { ContentPayload } from "./verseUtils";

describe("content.bundled.json", () => {
  const content = bundled as ContentPayload;

  it("has a version string", () => {
    expect(typeof content.version).toBe("string");
    expect(content.version.length).toBeGreaterThan(0);
  });

  it("has non-empty truths and struggles", () => {
    expect(content.truths.length).toBeGreaterThan(0);
    expect(content.struggles.length).toBeGreaterThan(0);
  });

  it("every truth has the required fields", () => {
    for (const truth of content.truths) {
      expect(typeof truth.id).toBe("string");
      expect(typeof truth.statement).toBe("string");
      expect(typeof truth.reference).toBe("string");
      expect(typeof truth.verse).toBe("string");
    }
  });
});
```

- [ ] **Step 7: Run the test**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add src/data/content.bundled.json src/data/verseUtils.ts src/data/content.bundled.test.ts vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "feat: add bundled content, types, and vitest harness"
```

---

## Task 2: Content lookup helpers

**Files:**
- Create: `src/data/content.ts`
- Test: `src/data/content.test.ts`

**Interfaces:**
- Consumes: `ContentPayload`, `Struggle`, `Truth` from `@/data/verseUtils`; `bundled` from `./content.bundled.json`.
- Produces: `bundledContent: ContentPayload`; `getTruthById(id, content?)`, `getStruggleById(id, content?)`, `truthFromStruggle(struggle): Truth`, `getShareableTruthById(id, content?): Truth | undefined`.

- [ ] **Step 1: Write the failing test**

Create `src/data/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  bundledContent,
  getShareableTruthById,
  getStruggleById,
  getTruthById,
  truthFromStruggle,
} from "./content";
import type { ContentPayload } from "./verseUtils";

const fixture: ContentPayload = {
  version: "test",
  truths: [
    {
      id: "t1",
      category: "Identity",
      statement: "You are loved.",
      reference: "John 3:16",
      verse: "For God so loved...",
      reflectionQuestion: "Q?",
      journalPrompt: "Write.",
    },
  ],
  struggles: [
    {
      id: "s1",
      label: "I feel afraid",
      category: "Fear",
      lie: "I am alone.",
      truth: "God is with you.",
      verses: [{ reference: "Deut 31:6", verse: "He will never leave you." }],
      reflection: "Reflect.",
      prayer: "Amen.",
    },
  ],
};

describe("content helpers", () => {
  it("finds a truth by id", () => {
    expect(getTruthById("t1", fixture)?.statement).toBe("You are loved.");
    expect(getTruthById("nope", fixture)).toBeUndefined();
  });

  it("finds a struggle by id", () => {
    expect(getStruggleById("s1", fixture)?.label).toBe("I feel afraid");
  });

  it("derives a truth-shaped card from a struggle", () => {
    const t = truthFromStruggle(fixture.struggles[0]);
    expect(t.id).toBe("lie-s1");
    expect(t.statement).toBe("God is with you.");
    expect(t.reference).toBe("Deut 31:6");
    expect(t.category).toBe("Fear");
  });

  it("resolves shareable truth for plain and lie- ids", () => {
    expect(getShareableTruthById("t1", fixture)?.statement).toBe("You are loved.");
    expect(getShareableTruthById("lie-s1", fixture)?.statement).toBe(
      "God is with you.",
    );
    expect(getShareableTruthById("lie-missing", fixture)).toBeUndefined();
  });

  it("defaults to bundled content", () => {
    expect(bundledContent.truths.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content.test`
Expected: FAIL (cannot find `./content`).

- [ ] **Step 3: Write the implementation**

Create `src/data/content.ts`:

```ts
import bundled from "./content.bundled.json";
import type { ContentPayload, Struggle, Truth } from "./verseUtils";

export const bundledContent = bundled as ContentPayload;

export function getTruthById(
  id: string,
  content: ContentPayload = bundledContent,
): Truth | undefined {
  return content.truths.find((truth) => truth.id === id);
}

export function getStruggleById(
  id: string,
  content: ContentPayload = bundledContent,
): Struggle | undefined {
  return content.struggles.find((struggle) => struggle.id === id);
}

export function truthFromStruggle(struggle: Struggle): Truth {
  const firstVerse = struggle.verses[0];
  return {
    id: `lie-${struggle.id}`,
    category: struggle.category,
    statement: struggle.truth,
    reference: firstVerse?.reference ?? "Scripture",
    verse: firstVerse?.verse ?? "",
    reflectionQuestion: struggle.reflection,
    journalPrompt: struggle.reflection,
  };
}

export function getShareableTruthById(
  id: string,
  content: ContentPayload = bundledContent,
): Truth | undefined {
  if (id.startsWith("lie-")) {
    const struggle = getStruggleById(id.slice(4), content);
    return struggle ? truthFromStruggle(struggle) : undefined;
  }
  return getTruthById(id, content);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- content.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts src/data/content.test.ts
git commit -m "feat: add content lookup helpers"
```

---

## Task 3: Deterministic daily truth + date helpers

**Files:**
- Create: `src/data/dailyTruth.ts`
- Test: `src/data/dailyTruth.test.ts`

**Interfaces:**
- Consumes: `Truth` from `@/data/verseUtils`.
- Produces: `getDailyTruth(date: Date, truths: Truth[]): Truth`, `formatToday(date: Date): string`, `greetingForDate(date: Date): string`.

- [ ] **Step 1: Write the failing test**

Create `src/data/dailyTruth.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { formatToday, getDailyTruth, greetingForDate } from "./dailyTruth";
import type { Truth } from "./verseUtils";

function makeTruths(n: number): Truth[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i}`,
    category: "Identity",
    statement: `Statement ${i}`,
    reference: "Ref",
    verse: "Verse",
    reflectionQuestion: "Q",
    journalPrompt: "P",
  }));
}

describe("getDailyTruth", () => {
  const truths = makeTruths(10);

  it("is deterministic for the same date", () => {
    const a = getDailyTruth(new Date("2026-03-04T09:00:00Z"), truths);
    const b = getDailyTruth(new Date("2026-03-04T21:30:00Z"), truths);
    expect(a.id).toBe(b.id);
  });

  it("varies across dates", () => {
    const ids = new Set(
      ["2026-01-01", "2026-02-15", "2026-07-09", "2026-11-23"].map(
        (d) => getDailyTruth(new Date(`${d}T00:00:00Z`), truths).id,
      ),
    );
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe("greetingForDate", () => {
  it("greets by time of day", () => {
    expect(greetingForDate(new Date("2026-03-04T08:00:00"))).toBe("Good morning");
    expect(greetingForDate(new Date("2026-03-04T13:00:00"))).toBe(
      "Good afternoon",
    );
    expect(greetingForDate(new Date("2026-03-04T20:00:00"))).toBe("Good evening");
  });
});

describe("formatToday", () => {
  it("returns a non-empty string", () => {
    expect(formatToday(new Date("2026-03-04T08:00:00")).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- dailyTruth.test`
Expected: FAIL (cannot find `./dailyTruth`).

- [ ] **Step 3: Write the implementation**

Create `src/data/dailyTruth.ts`:

```ts
import type { Truth } from "@/data/verseUtils";

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function getDailyTruth(date: Date, truths: Truth[]): Truth {
  return truths[hash(dateKey(date)) % truths.length] ?? truths[0];
}

export function formatToday(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function greetingForDate(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- dailyTruth.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/dailyTruth.ts src/data/dailyTruth.test.ts
git commit -m "feat: add deterministic daily truth and date helpers"
```

---

## Task 4: Remote content loader with validation and fallback

**Files:**
- Create: `src/lib/remoteContent.ts`
- Test: `src/lib/remoteContent.test.ts`

**Interfaces:**
- Consumes: `ContentPayload`, `TruthCategory` from `@/data/verseUtils`; `bundled` from `@/data/content.bundled.json`.
- Produces: `isContentPayload(value: unknown): value is ContentPayload`; `loadInitialContent(): Promise<ContentPayload>`; `refreshRemoteContent(options?: { force?: boolean }): Promise<void>`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/remoteContent.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { bundledContent } from "@/data/content";
import { isContentPayload, loadInitialContent } from "./remoteContent";

const validRemote = {
  version: "9999-01-01.1",
  truths: [
    {
      id: "r1",
      category: "Identity",
      statement: "You are remote.",
      reference: "Ref 1:1",
      verse: "Remote verse.",
      reflectionQuestion: "Q",
      journalPrompt: "P",
    },
  ],
  struggles: [
    {
      id: "rs1",
      label: "I feel test",
      category: "Fear",
      lie: "Lie.",
      truth: "Truth.",
      verses: [{ reference: "Ref", verse: "Verse" }],
      reflection: "Reflect.",
      prayer: "Amen.",
    },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isContentPayload", () => {
  it("accepts a valid payload", () => {
    expect(isContentPayload(validRemote)).toBe(true);
  });

  it("rejects the legacy { verses } shape", () => {
    expect(isContentPayload({ verses: [] })).toBe(false);
  });

  it("rejects an unknown category", () => {
    const bad = {
      ...validRemote,
      truths: [{ ...validRemote.truths[0], category: "Nonsense" }],
    };
    expect(isContentPayload(bad)).toBe(false);
  });

  it("rejects a truth missing a field", () => {
    const bad = {
      ...validRemote,
      truths: [{ ...validRemote.truths[0], verse: undefined }],
    };
    expect(isContentPayload(bad)).toBe(false);
  });
});

describe("loadInitialContent", () => {
  it("returns bundled content when no cache exists", async () => {
    const result = await loadInitialContent();
    expect(result.version).toBe(bundledContent.version);
  });

  it("returns cached content when its version is greater", async () => {
    localStorage.setItem("verses_data", JSON.stringify(validRemote));
    const result = await loadInitialContent();
    expect(result.version).toBe(validRemote.version);
  });

  it("ignores cached content that fails validation", async () => {
    localStorage.setItem("verses_data", JSON.stringify({ verses: [] }));
    const result = await loadInitialContent();
    expect(result.version).toBe(bundledContent.version);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- remoteContent.test`
Expected: FAIL (cannot find `./remoteContent`).

- [ ] **Step 3: Write the implementation**

Create `src/lib/remoteContent.ts`:

```ts
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
    if (text.length > MAX_PAYLOAD_BYTES) return;

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- remoteContent.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/remoteContent.ts src/lib/remoteContent.test.ts
git commit -m "feat: add remote content loader with validation and fallback"
```

---

## Task 5: localStorage storage modules

**Files:**
- Create: `src/storage/favorites.ts`, `src/storage/journal.ts`, `src/storage/customLibrary.ts`, `src/storage/settings.ts`
- Test: `src/storage/storage.test.ts`

**Interfaces:**
- Produces:
  - `favorites`: `loadFavoriteIds(): string[]`, `saveFavoriteIds(ids: string[]): void`
  - `journal`: type `JournalEntry`; `loadJournalEntries(): JournalEntry[]`, `saveJournalEntries(entries: JournalEntry[]): void`
  - `customLibrary`: type `CustomLibraryContent = { truths: Truth[]; struggles: Struggle[] }`; `defaultCustomLibraryContent`; `loadCustomLibraryContent(): CustomLibraryContent`, `saveCustomLibraryContent(content): void`
  - `settings`: types `Gender = "male" | "female"`, `Settings = { personalize: boolean; name: string; gender: Gender }`; `loadSettings(): Settings`, `setPersonalize(v: boolean): void`, `setName(v: string): void`, `setGender(v: Gender): void`
- Note: these are **synchronous** (localStorage), unlike the async Expo versions.

- [ ] **Step 1: Write the failing test**

Create `src/storage/storage.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  defaultCustomLibraryContent,
  loadCustomLibraryContent,
  saveCustomLibraryContent,
} from "./customLibrary";
import { loadFavoriteIds, saveFavoriteIds } from "./favorites";
import { loadJournalEntries, saveJournalEntries } from "./journal";
import { loadSettings, setGender, setName, setPersonalize } from "./settings";

describe("favorites storage", () => {
  it("round-trips ids and dedupes", () => {
    saveFavoriteIds(["a", "b", "a"]);
    expect(loadFavoriteIds().sort()).toEqual(["a", "b"]);
  });

  it("returns [] when empty", () => {
    expect(loadFavoriteIds()).toEqual([]);
  });
});

describe("journal storage", () => {
  it("round-trips entries and filters malformed ones", () => {
    localStorage.setItem(
      "journal_entries",
      JSON.stringify([
        { id: "1", createdAt: "t", prompt: "p", body: "b" },
        { id: 2, body: "bad" },
      ]),
    );
    const entries = loadJournalEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe("1");
  });

  it("saves entries", () => {
    saveJournalEntries([{ id: "x", createdAt: "t", prompt: "p", body: "b" }]);
    expect(loadJournalEntries()[0].id).toBe("x");
  });
});

describe("custom library storage", () => {
  it("defaults to empty", () => {
    expect(loadCustomLibraryContent()).toEqual(defaultCustomLibraryContent);
  });

  it("round-trips a valid truth and filters bad categories", () => {
    saveCustomLibraryContent({
      truths: [
        {
          id: "c1",
          category: "Identity",
          statement: "s",
          reference: "r",
          verse: "v",
          reflectionQuestion: "q",
          journalPrompt: "p",
        },
      ],
      struggles: [],
    });
    expect(loadCustomLibraryContent().truths).toHaveLength(1);

    localStorage.setItem(
      "custom_library_content",
      JSON.stringify({ truths: [{ id: "x", category: "Bogus" }], struggles: [] }),
    );
    expect(loadCustomLibraryContent().truths).toHaveLength(0);
  });
});

describe("settings storage", () => {
  it("defaults sensibly", () => {
    const s = loadSettings();
    expect(s.personalize).toBe(false);
    expect(s.name).toBe("");
    expect(s.gender).toBe("male");
  });

  it("persists individual fields", () => {
    setPersonalize(true);
    setName("Sam");
    setGender("female");
    const s = loadSettings();
    expect(s).toEqual({ personalize: true, name: "Sam", gender: "female" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- storage.test`
Expected: FAIL (cannot find modules).

- [ ] **Step 3: Implement `favorites.ts`**

Create `src/storage/favorites.ts`:

```ts
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
```

- [ ] **Step 4: Implement `journal.ts`**

Create `src/storage/journal.ts`:

```ts
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
```

- [ ] **Step 5: Implement `customLibrary.ts`**

Create `src/storage/customLibrary.ts`:

```ts
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
```

- [ ] **Step 6: Implement `settings.ts`**

Create `src/storage/settings.ts`:

```ts
export type Gender = "male" | "female";

export type Settings = {
  personalize: boolean;
  name: string;
  gender: Gender;
};

const KEYS = {
  personalize: "personalize",
  name: "name",
  gender: "gender",
} as const;

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadSettings(): Settings {
  if (!hasStorage()) {
    return { personalize: false, name: "", gender: "male" };
  }
  return {
    personalize: localStorage.getItem(KEYS.personalize) === "true",
    name: localStorage.getItem(KEYS.name) ?? "",
    gender: localStorage.getItem(KEYS.gender) === "female" ? "female" : "male",
  };
}

export function setPersonalize(value: boolean): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.personalize, value ? "true" : "false");
}

export function setName(name: string): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.name, name);
}

export function setGender(gender: Gender): void {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.gender, gender);
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- storage.test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/storage src/storage/storage.test.ts
git commit -m "feat: add localStorage storage modules"
```

---

## Task 6: Tailwind theme, fonts, globals, and root layout

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `package.json` (remove daisyui)

**Interfaces:**
- Produces: Tailwind tokens used by all components (`bg-page`, `bg-surface`, `text-ink`, `text-scriptureInk`, `text-softInk`, `text-mutedInk`, `text-mutedInkAlt`, `text-accent`, `text-accentDeep`, `bg-tint`, `border-border`, `border-borderSoft`, `border-borderCool`, `text-danger`, `rounded-sm|md|lg|xl`, `shadow-card`, `shadow-soft`, `font-serif`, `font-sans`, `italic` Newsreader); CSS vars `--font-serif`, `--font-sans`.
- Note: `ContentProvider` (Task 7) will be added to layout in Task 7. This task wires fonts/background only.

- [ ] **Step 1: Replace `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#f6f8fb",
        surface: "#edf2f8",
        ink: "#243347",
        scriptureInk: "#1b2737",
        softInk: "#5d6f85",
        mutedInk: "#8492a5",
        mutedInkAlt: "#9aa6b6",
        accent: "#607691",
        accentDeep: "#42576f",
        accentBright: "#7e94ad",
        tint: "#dce4ee",
        border: "#cfd7e2",
        borderSoft: "#dfe5ee",
        borderCool: "#c2ccd9",
        danger: "#8c6154",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "14px",
        md: "20px",
        lg: "24px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 18px 28px rgba(30, 42, 60, 0.16)",
        soft: "0 8px 18px rgba(30, 42, 60, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Remove daisyui dependency**

Run:

```bash
npm uninstall daisyui
```

Expected: removes daisyui.

- [ ] **Step 3: Replace `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #f6f8fb;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(96, 118, 145, 0.5);
}
```

- [ ] **Step 4: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Mulish, Newsreader } from "next/font/google";
import "./globals.css";

import InstallPrompt from "./installprompt";
import RegisterSW from "./registersw";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "What God Says About You",
  description: "A beautiful sample of what Jesus says about YOU.",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f6f8fb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans bg-page`}>
        <RegisterSW />
        <InstallPrompt />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds. (The existing `[slug]`/`page.tsx` still reference removed daisyUI classes only as plain strings, which is fine; they are replaced in later tasks. If build fails because `page.tsx`/`[slug]` import deleted modules, that is expected only after Task 16 — at this point no modules are deleted yet, so build should pass.)

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat: port theme tokens and fonts, drop daisyui"
```

---

## Task 7: Content provider and React hooks

**Files:**
- Create: `src/data/ContentProvider.tsx`
- Create: `src/hooks/useFavorites.ts`, `useJournal.ts`, `useCustomLibrary.ts`, `useSettings.ts`, `useShareTruth.ts`
- Modify: `src/app/layout.tsx` (wrap children in `ContentProvider`)

**Interfaces:**
- Consumes: storage modules (Task 5), `loadInitialContent`/`refreshRemoteContent` (Task 4), `getShareableTruthById` (Task 2).
- Produces:
  - `ContentProvider` (client) wrapping the tree; hooks `useContent(): ContentPayload`, `useVerses(): Truth[]`, `useStruggles(): Struggle[]`, `useRefreshContent(): { refreshing: boolean; refresh: () => Promise<void> }`.
  - `useFavorites(): { ready; savedIds: string[]; isSaved(id): boolean; toggleSaved(id): void }`
  - `useJournal(): { ready; entries: JournalEntry[]; addEntry({prompt, body, sourceTruthId?}): JournalEntry | null; updateEntry(id, body): JournalEntry | null; deleteEntry(id): void }`
  - `useCustomLibrary(): { ready; truths: Truth[]; struggles: Struggle[]; addTruth(Omit<Truth,"id">): Truth; addStruggle(Omit<Struggle,"id">): Struggle }`
  - `useSettings(): { ready; settings: Settings | null; setPersonalize(v); setName(v); setGender(v) }`
  - `useShareTruth(): { shareTruthId: string | null; openShareTruth(id); closeShareTruth(); copyTruthLink(id): Promise<void>; shareWithFriend(id): Promise<void>; toast: string }` plus exported `truthUrl(id): string`.

- [ ] **Step 1: Create `ContentProvider.tsx`**

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { bundledContent } from "@/data/content";
import type { ContentPayload, Struggle, Truth } from "@/data/verseUtils";
import { loadInitialContent, refreshRemoteContent } from "@/lib/remoteContent";

type RefreshValue = { refreshing: boolean; refresh: () => Promise<void> };

const ContentContext = createContext<ContentPayload>(bundledContent);
const RefreshContext = createContext<RefreshValue>({
  refreshing: false,
  refresh: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentPayload>(bundledContent);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const payload = await loadInitialContent();
      if (!cancelled) setContent(payload);
      await refreshRemoteContent();
      const next = await loadInitialContent();
      if (!cancelled) setContent(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshRemoteContent({ force: true });
      const payload = await loadInitialContent();
      setContent(payload);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ContentContext.Provider value={content}>
      <RefreshContext.Provider value={{ refreshing, refresh }}>
        {children}
      </RefreshContext.Provider>
    </ContentContext.Provider>
  );
}

export function useContent(): ContentPayload {
  return useContext(ContentContext);
}

export function useVerses(): Truth[] {
  return useContent().truths;
}

export function useStruggles(): Struggle[] {
  return useContent().struggles;
}

export function useRefreshContent(): RefreshValue {
  return useContext(RefreshContext);
}
```

- [ ] **Step 2: Create `useFavorites.ts`**

```ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { loadFavoriteIds, saveFavoriteIds } from "@/storage/favorites";

export function useFavorites() {
  const [ready, setReady] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(loadFavoriteIds());
    setReady(true);
  }, []);

  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  const isSaved = useCallback((id: string) => savedSet.has(id), [savedSet]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [id, ...current];
      saveFavoriteIds(next);
      return next;
    });
  }, []);

  return { ready, savedIds, isSaved, toggleSaved };
}
```

- [ ] **Step 3: Create `useJournal.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  loadJournalEntries,
  saveJournalEntries,
  type JournalEntry,
} from "@/storage/journal";

type AddEntryInput = { prompt: string; body: string; sourceTruthId?: string };

export function useJournal() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(loadJournalEntries());
    setReady(true);
  }, []);

  const persist = useCallback((next: JournalEntry[]) => {
    setEntries(next);
    saveJournalEntries(next);
  }, []);

  const addEntry = useCallback(
    ({ prompt, body, sourceTruthId }: AddEntryInput) => {
      const cleanBody = body.trim();
      if (!cleanBody) return null;
      const entry: JournalEntry = {
        id: `journal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt,
        body: cleanBody,
        sourceTruthId,
      };
      setEntries((current) => {
        const next = [entry, ...current];
        saveJournalEntries(next);
        return next;
      });
      return entry;
    },
    [],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((current) => {
        const next = current.filter((entry) => entry.id !== id);
        saveJournalEntries(next);
        return next;
      });
    },
    [],
  );

  const updateEntry = useCallback((id: string, body: string) => {
    const cleanBody = body.trim();
    if (!cleanBody) return null;
    let updated: JournalEntry | null = null;
    setEntries((current) => {
      const next = current.map((entry) => {
        if (entry.id !== id) return entry;
        updated = { ...entry, body: cleanBody };
        return updated;
      });
      saveJournalEntries(next);
      return next;
    });
    return updated;
  }, []);

  return { ready, entries, addEntry, updateEntry, deleteEntry };
}
```

- [ ] **Step 4: Create `useCustomLibrary.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

import type { Struggle, Truth } from "@/data/verseUtils";
import {
  defaultCustomLibraryContent,
  loadCustomLibraryContent,
  saveCustomLibraryContent,
  type CustomLibraryContent,
} from "@/storage/customLibrary";

type AddTruthInput = Omit<Truth, "id">;
type AddStruggleInput = Omit<Struggle, "id">;

export function useCustomLibrary() {
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<CustomLibraryContent>(
    defaultCustomLibraryContent,
  );

  useEffect(() => {
    setContent(loadCustomLibraryContent());
    setReady(true);
  }, []);

  const addTruth = useCallback((truth: AddTruthInput) => {
    const nextTruth: Truth = { ...truth, id: `custom-truth-${Date.now()}` };
    setContent((current) => {
      const next = { ...current, truths: [nextTruth, ...current.truths] };
      saveCustomLibraryContent(next);
      return next;
    });
    return nextTruth;
  }, []);

  const addStruggle = useCallback((struggle: AddStruggleInput) => {
    const nextStruggle: Struggle = {
      ...struggle,
      id: `custom-struggle-${Date.now()}`,
    };
    setContent((current) => {
      const next = {
        ...current,
        struggles: [nextStruggle, ...current.struggles],
      };
      saveCustomLibraryContent(next);
      return next;
    });
    return nextStruggle;
  }, []);

  return {
    ready,
    truths: content.truths,
    struggles: content.struggles,
    addTruth,
    addStruggle,
  };
}
```

- [ ] **Step 5: Create `useSettings.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  loadSettings,
  setGender as persistGender,
  setName as persistName,
  setPersonalize as persistPersonalize,
  type Gender,
  type Settings,
} from "@/storage/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const setPersonalize = useCallback((value: boolean) => {
    persistPersonalize(value);
    setSettings((current) =>
      current ? { ...current, personalize: value } : current,
    );
  }, []);

  const setName = useCallback((value: string) => {
    persistName(value);
    setSettings((current) => (current ? { ...current, name: value } : current));
  }, []);

  const setGender = useCallback((value: Gender) => {
    persistGender(value);
    setSettings((current) =>
      current ? { ...current, gender: value } : current,
    );
  }, []);

  return {
    ready: settings !== null,
    settings,
    setPersonalize,
    setName,
    setGender,
  };
}
```

- [ ] **Step 6: Create `useShareTruth.ts`**

```ts
"use client";

import { useCallback, useState } from "react";

import { getShareableTruthById } from "@/data/content";
import { useContent } from "@/data/ContentProvider";

export function truthUrl(id: string): string {
  return `https://whatgodsaysabout.me/t/${encodeURIComponent(id)}`;
}

export function useShareTruth() {
  const content = useContent();
  const [shareTruthId, setShareTruthId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const flash = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 1800);
  }, []);

  const copyTruthLink = useCallback(
    async (id: string) => {
      try {
        await navigator.clipboard.writeText(truthUrl(id));
        flash("Link copied");
      } catch {
        flash("Could not copy link");
      }
    },
    [flash],
  );

  const shareWithFriend = useCallback(
    async (id: string) => {
      const truth = getShareableTruthById(id, content);
      if (!truth) return;
      const text = `"${truth.statement}" - ${truth.reference}\n${truthUrl(id)}`;
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: "What God Says About Me",
            text,
            url: truthUrl(id),
          });
          return;
        } catch {
          // user cancelled or share failed — fall back to copy
        }
      }
      await copyTruthLink(id);
    },
    [content, copyTruthLink],
  );

  return {
    shareTruthId,
    openShareTruth: setShareTruthId,
    closeShareTruth: () => setShareTruthId(null),
    copyTruthLink,
    shareWithFriend,
    toast,
  };
}
```

- [ ] **Step 7: Wrap the layout tree in `ContentProvider`**

In `src/app/layout.tsx`, add the import and wrap `{children}`:

Add near the other imports:

```tsx
import { ContentProvider } from "@/data/ContentProvider";
```

Replace the body inner block:

```tsx
        <RegisterSW />
        <InstallPrompt />
        <ContentProvider>{children}</ContentProvider>
        <SpeedInsights />
        <Analytics />
```

- [ ] **Step 8: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/data/ContentProvider.tsx src/hooks src/app/layout.tsx
git commit -m "feat: add content provider and persistence hooks"
```

---

## Task 8: Shell, tabs, and primitive components

**Files:**
- Create: `src/components/AppShell.tsx`, `src/components/BottomTabs.tsx`, `src/components/ActionPill.tsx`, `src/components/SaveHeartButton.tsx`, `src/components/Toast.tsx`

**Interfaces:**
- Consumes: theme tokens (Task 6).
- Produces:
  - `AppShell({ activeTab, children })` — gradient background, centered max-w-[480px] column, fixed bottom tabs, bottom padding for tab clearance.
  - `BottomTabs({ activeTab })` where `AppTab = "today" | "library" | "journal" | "favorites"`.
  - `ActionPill({ label, onClick, variant?: "light" | "dark" | "tint", selected?, className? })`.
  - `SaveHeartButton({ saved, onClick })`.
  - `Toast({ message })`.

- [ ] **Step 1: Create `BottomTabs.tsx`**

```tsx
"use client";

import Link from "next/link";

export type AppTab = "today" | "library" | "journal" | "favorites";

const tabs: { key: AppTab; label: string; href: string }[] = [
  { key: "today", label: "Today", href: "/" },
  { key: "library", label: "Library", href: "/library" },
  { key: "journal", label: "Journal", href: "/journal" },
  { key: "favorites", label: "Favorites", href: "/favorites" },
];

export function BottomTabs({ activeTab }: { activeTab: AppTab }) {
  return (
    <nav className="flex items-start justify-around border-t border-borderCool bg-[rgba(223,231,242,0.96)] px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-label={tab.label}
            className="flex min-h-[44px] min-w-[68px] flex-col items-center gap-1.5"
          >
            <span
              className={`h-[5px] w-[5px] rounded-full ${
                active ? "bg-accentBright" : "bg-transparent"
              }`}
            />
            <span
              className={`text-xs ${
                active ? "font-bold text-ink" : "font-medium text-mutedInk"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Create `AppShell.tsx`**

```tsx
import { type ReactNode } from "react";

import { BottomTabs, type AppTab } from "@/components/BottomTabs";

export function AppShell({
  activeTab,
  children,
}: {
  activeTab: AppTab;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-page via-[#d8e2ee] to-[#aebed1]">
      <div className="mx-auto min-h-[100dvh] w-full max-w-[480px]">
        <main className="px-6 pt-7 pb-[132px]">{children}</main>
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[480px] bg-[rgba(223,231,242,0.98)]">
          <BottomTabs activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `ActionPill.tsx`**

```tsx
"use client";

type Variant = "light" | "dark" | "tint";

export function ActionPill({
  label,
  onClick,
  variant = "light",
  selected = false,
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: Variant;
  selected?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-full border px-[18px] text-sm font-bold transition active:opacity-70 focus-ring";
  const styles =
    variant === "dark"
      ? "border-ink bg-ink text-page"
      : variant === "tint" || selected
        ? "border-borderCool bg-tint text-accentDeep"
        : "border-border bg-surface text-softInk";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {label}
    </button>
  );
}
```

- [ ] **Step 4: Create `SaveHeartButton.tsx`**

```tsx
"use client";

export function SaveHeartButton({
  saved,
  onClick,
}: {
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Unsave" : "Save"}
      aria-pressed={saved}
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition active:opacity-70 focus-ring ${
        saved
          ? "border-borderCool bg-tint text-accentDeep"
          : "border-border bg-surface text-softInk"
      }`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
```

- [ ] **Step 5: Create `Toast.tsx`**

```tsx
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-6 bottom-28 z-50 flex justify-center">
      <span className="rounded-full bg-scriptureInk px-[22px] py-[11px] text-[13px] font-bold text-page shadow-soft">
        {message}
      </span>
    </div>
  );
}
```

- [ ] **Step 6: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/AppShell.tsx src/components/BottomTabs.tsx src/components/ActionPill.tsx src/components/SaveHeartButton.tsx src/components/Toast.tsx
git commit -m "feat: add app shell, bottom tabs, and primitives"
```

---

## Task 9: TruthCard and ShareTruthCard

**Files:**
- Create: `src/components/TruthCard.tsx`, `src/components/ShareTruthCard.tsx`

**Interfaces:**
- Consumes: `Truth` (types), `ActionPill`, `SaveHeartButton` (Task 8), `truthUrl` (Task 7).
- Produces:
  - `TruthCard({ eyebrow?, truth, statement?, saved, onToggleSaved, onShare })`.
  - `ShareTruthCard({ truth?, visible, onClose, onCopy, onShare })` — modal overlay; renders nothing when `!truth || !visible`.

- [ ] **Step 1: Create `TruthCard.tsx`**

```tsx
import { ActionPill } from "@/components/ActionPill";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import type { Truth } from "@/data/verseUtils";

export function TruthCard({
  eyebrow = "Today's truth",
  truth,
  statement,
  saved,
  onToggleSaved,
  onShare,
}: {
  eyebrow?: string;
  truth: Truth;
  statement?: string;
  saved: boolean;
  onToggleSaved: () => void;
  onShare: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-borderSoft bg-surface px-[30px] pb-7 pt-14 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[132px] bg-gradient-to-b from-[rgba(126,148,173,0.35)] via-[rgba(230,236,243,0.8)] to-transparent"
      />
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
        {eyebrow}
      </p>
      <p className="font-serif text-[31px] leading-[41px] text-scriptureInk">
        {statement ?? truth.statement}
      </p>
      <div className="mt-6 flex items-center gap-2.5">
        <span className="h-px w-6 bg-[#cdb89e]" />
        <span className="font-serif italic text-base text-accentDeep">
          {truth.reference}
        </span>
      </div>
      <p className="mt-5 text-base leading-[25px] text-softInk">{truth.verse}</p>
      <div className="mt-[26px] flex flex-wrap gap-2.5">
        <SaveHeartButton saved={saved} onClick={onToggleSaved} />
        <ActionPill label="Share" variant="tint" onClick={onShare} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `ShareTruthCard.tsx`**

```tsx
"use client";

import { ActionPill } from "@/components/ActionPill";
import type { Truth } from "@/data/verseUtils";
import { truthUrl } from "@/hooks/useShareTruth";

export function ShareTruthCard({
  truth,
  visible,
  onClose,
  onCopy,
  onShare,
}: {
  truth?: Truth;
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  if (!truth || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,48,46,0.36)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[30px] bg-page px-6 pb-7 pt-3.5"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share card"
          className="ml-auto flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
        >
          Close
        </button>

        <div className="relative overflow-hidden rounded-xl border border-borderSoft bg-surface px-7 pb-7 pt-[92px] shadow-card">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[122px] bg-gradient-to-b from-[#d6eae3] via-[#e6f1ec] to-transparent"
          />
          <p className="text-center text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            {truth.category}
          </p>
          <p className="mt-4 text-center font-serif text-[29px] leading-[39px] text-scriptureInk">
            {truth.statement}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <span className="h-px w-[22px] bg-[#cdb89e]" />
            <span className="font-serif italic text-base text-accentDeep">
              {truth.reference}
            </span>
          </div>
          <p className="mt-4 text-center text-sm leading-[23px] text-softInk">
            {truth.verse}
          </p>
          <p className="mt-[22px] border-t border-borderSoft pt-3.5 text-center font-serif italic text-[13px] text-mutedInkAlt">
            whatgodsaysabout.me
          </p>
        </div>

        <p className="mt-[22px] text-center font-serif text-lg text-ink">
          Encourage a friend with this truth.
        </p>

        <div className="mt-4 flex min-h-[48px] items-center gap-3 rounded-sm border border-borderSoft bg-surface px-4">
          <span className="flex-1 truncate text-xs text-softInk">
            {truthUrl(truth.id)}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="text-[13px] font-bold text-accentDeep focus-ring"
          >
            Copy link
          </button>
        </div>

        <ActionPill
          label="Share with a friend"
          variant="dark"
          onClick={onShare}
          className="mt-3 w-full"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/TruthCard.tsx src/components/ShareTruthCard.tsx
git commit -m "feat: add truth card and share card"
```

---

## Task 10: Struggle picker and response components

**Files:**
- Create: `src/components/StruggleSheet.tsx`, `src/components/StruggleResponse.tsx`

**Interfaces:**
- Consumes: `Struggle` (types), `ActionPill`, `SaveHeartButton`.
- Produces:
  - `StruggleSheet({ visible, struggles, onClose, onSelect })` — bottom-sheet picker; renders nothing when `!visible`.
  - `StruggleResponse({ struggle, saved, onBack, onClose, onToggleSaved, onJournal, onShare })` — full overlay with lie → "but God says" → truth → verses → reflection → prayer → actions.

- [ ] **Step 1: Create `StruggleSheet.tsx`**

```tsx
"use client";

import type { Struggle } from "@/data/verseUtils";

export function StruggleSheet({
  visible,
  struggles,
  onClose,
  onSelect,
}: {
  visible: boolean;
  struggles: Struggle[];
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,48,46,0.26)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[30px] bg-page px-6 pb-6 pt-3 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-[18px] h-1 w-[46px] rounded-full bg-border" />
        <div className="flex items-start justify-between gap-[18px]">
          <h2 className="flex-1 font-serif text-2xl leading-[31px] text-scriptureInk">
            What are you feeling right now?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center text-[13px] font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          {struggles.map((struggle) => (
            <button
              key={struggle.id}
              type="button"
              onClick={() => onSelect(struggle.id)}
              className="flex min-h-[50px] items-center rounded-md border border-borderSoft bg-surface px-[18px] text-left text-base font-semibold text-ink transition active:opacity-70 focus-ring"
            >
              {struggle.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `StruggleResponse.tsx`**

```tsx
"use client";

import { ActionPill } from "@/components/ActionPill";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import type { Struggle } from "@/data/verseUtils";

export function StruggleResponse({
  struggle,
  saved,
  onBack,
  onClose,
  onToggleSaved,
  onJournal,
  onShare,
}: {
  struggle: Struggle;
  saved: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleSaved: () => void;
  onJournal: () => void;
  onShare: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-page">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex justify-between px-6 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>
        <div className="px-6 pb-11 pt-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            The lie
          </p>
          <p className="mt-2.5 font-serif text-[27px] leading-[35px] text-softInk line-through">
            {struggle.lie}
          </p>
          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-serif italic text-[17px] text-accentDeep">
              but God says
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="rounded-xl border border-borderSoft bg-surface p-[26px] shadow-card">
            <p className="font-serif text-[30px] leading-[40px] text-scriptureInk">
              {struggle.truth}
            </p>
          </div>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Scripture
          </p>
          {struggle.verses.map((verse) => (
            <div key={verse.reference} className="mt-3.5">
              <p className="font-serif italic text-base text-accentDeep">
                {verse.reference}
              </p>
              <p className="mt-1.5 text-[15px] leading-6 text-softInk">
                {verse.verse}
              </p>
            </div>
          ))}
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Reflect
          </p>
          <p className="mt-2.5 font-serif text-[22px] leading-[30px] text-ink">
            {struggle.reflection}
          </p>
          <div className="mt-4 rounded-lg bg-tint px-5 pb-[22px]">
            <p className="pt-5 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
              A prayer
            </p>
            <p className="mt-2.5 text-[15px] leading-6 text-softInk">
              {struggle.prayer}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <SaveHeartButton saved={saved} onClick={onToggleSaved} />
            <ActionPill label="Journal this" variant="tint" onClick={onJournal} />
            <ActionPill label="Share" variant="dark" onClick={onShare} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/StruggleSheet.tsx src/components/StruggleResponse.tsx
git commit -m "feat: add struggle picker and response components"
```

---

## Task 11: JournalCompose and PersonalizationPanel modals

**Files:**
- Create: `src/components/JournalCompose.tsx`, `src/components/PersonalizationPanel.tsx`

**Interfaces:**
- Consumes: `useSettings` (Task 7), theme tokens.
- Produces:
  - `JournalCompose({ visible, prompt, initialBody?, onCancel, onSave })` — full-screen modal; Save disabled when body is empty/whitespace; resets to `initialBody` on cancel/save. Renders nothing when `!visible`.
  - `PersonalizationPanel({ visible, onClose })` — bottom-sheet; toggle personalize, name input, gender select; persists via `useSettings`. Renders nothing when `!visible`.

- [ ] **Step 1: Create `JournalCompose.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

export function JournalCompose({
  visible,
  prompt,
  initialBody = "",
  onCancel,
  onSave,
}: {
  visible: boolean;
  prompt: string;
  initialBody?: string;
  onCancel: () => void;
  onSave: (body: string) => void;
}) {
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    if (visible) setBody(initialBody);
  }, [visible, initialBody]);

  if (!visible) return null;

  const canSave = body.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-page">
      <div className="flex w-full max-w-[480px] flex-col">
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-[max(env(safe-area-inset-top),48px)]">
          <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Reflection
          </p>
          <p className="mt-3 font-serif text-[28px] leading-[37px] text-scriptureInk">
            {prompt}
          </p>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            autoFocus
            placeholder="Write what you are noticing..."
            className="mt-6 min-h-[300px] w-full rounded-lg border border-borderSoft bg-surface p-[18px] font-serif text-[21px] leading-[30px] text-ink placeholder:text-mutedInk focus-ring"
          />
        </div>
        <div className="flex justify-end gap-3 bg-page px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-[48px] items-center rounded-full px-[18px] text-[15px] font-bold text-softInk focus-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(body)}
            className={`flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-extrabold focus-ring ${
              canSave ? "bg-ink text-page" : "bg-tint text-mutedInk"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `PersonalizationPanel.tsx`**

```tsx
"use client";

import { useSettings } from "@/hooks/useSettings";

export function PersonalizationPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { settings, setPersonalize, setName, setGender } = useSettings();

  if (!visible) return null;

  const personalize = settings?.personalize ?? false;
  const name = settings?.name ?? "";
  const gender = settings?.gender ?? "male";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(28,38,50,0.34)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-xl bg-page p-6 pb-8 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
              Settings
            </p>
            <h2 className="mt-2 font-serif text-[31px] leading-[38px] text-scriptureInk">
              Personalize
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[42px] items-center rounded-full border border-border px-3.5 text-[13px] font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={personalize}
            onChange={(event) => setPersonalize(event.target.checked)}
            className="h-5 w-5 accent-accentDeep"
          />
          <span className="text-base font-bold text-ink">
            Use my name and pronouns
          </span>
        </label>

        {personalize ? (
          <div className="mt-4 flex flex-col gap-1.5">
            <span className="text-sm font-bold text-ink">First name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoCapitalize="words"
              placeholder="First name"
              className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink focus-ring"
            />

            <span className="mt-2 text-sm font-bold text-ink">Gender</span>
            <select
              value={gender}
              onChange={(event) =>
                setGender(event.target.value === "female" ? "female" : "male")
              }
              className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink focus-ring"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <p className="mt-1.5 text-[13px] text-softInk">
              (Your name will be inserted and pronouns will be adjusted.)
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/JournalCompose.tsx src/components/PersonalizationPanel.tsx
git commit -m "feat: add journal compose and personalization panel"
```

---

## Task 12: Today screen

**Files:**
- Modify: `src/app/page.tsx` (full replace)

**Interfaces:**
- Consumes: `AppShell`, `TruthCard`, `StruggleSheet`, `StruggleResponse`, `JournalCompose`, `ShareTruthCard`, `Toast`, `PersonalizationPanel`; hooks `useVerses`, `useStruggles`, `useContent`, `useFavorites`, `useJournal`, `useSettings`, `useShareTruth`; `getDailyTruth`, `formatToday`, `greetingForDate`; `getShareableTruthById`, `truthFromStruggle`.
- Produces: the Today route at `/`.

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { JournalCompose } from "@/components/JournalCompose";
import { PersonalizationPanel } from "@/components/PersonalizationPanel";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { StruggleResponse } from "@/components/StruggleResponse";
import { StruggleSheet } from "@/components/StruggleSheet";
import { Toast } from "@/components/Toast";
import { TruthCard } from "@/components/TruthCard";
import { useContent, useStruggles, useVerses } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import { formatToday, getDailyTruth, greetingForDate } from "@/data/dailyTruth";
import type { Struggle, Truth } from "@/data/verseUtils";
import { useFavorites } from "@/hooks/useFavorites";
import { useJournal } from "@/hooks/useJournal";
import { useSettings } from "@/hooks/useSettings";
import { useShareTruth } from "@/hooks/useShareTruth";

function personalizeTruth(truth: Truth, name: string, gender: "male" | "female") {
  const key = gender === "female" ? "feminine" : "masculine";
  const template = truth.personalized?.[key] ?? truth.statement;
  return template.replaceAll("{name}", name);
}

export default function TodayScreen() {
  const router = useRouter();
  const content = useContent();
  const truths = useVerses();
  const struggles = useStruggles();
  const favorites = useFavorites();
  const journal = useJournal();
  const { settings } = useSettings();
  const share = useShareTruth();

  const now = new Date();
  const today = getDailyTruth(now, truths);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedStruggle, setSelectedStruggle] = useState<Struggle | null>(null);
  const [compose, setCompose] = useState<{
    prompt: string;
    sourceTruthId?: string;
  } | null>(null);

  const name =
    settings?.personalize && settings.name.trim() ? settings.name.trim() : "";
  const greeting = name
    ? `${greetingForDate(now)}, ${name}.`
    : `${greetingForDate(now)}.`;
  const statement =
    name && settings
      ? personalizeTruth(today, name, settings.gender)
      : today.statement;

  const shareTruth = share.shareTruthId
    ? getShareableTruthById(share.shareTruthId, content)
    : undefined;

  const saveJournal = (body: string) => {
    if (!compose) return;
    journal.addEntry({
      prompt: compose.prompt,
      body,
      sourceTruthId: compose.sourceTruthId,
    });
    setCompose(null);
    router.push("/journal");
  };

  return (
    <>
      <AppShell activeTab="today">
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-accent">
              {formatToday(now)}
            </p>
            <h1 className="mt-1 font-serif text-[30px] leading-9 text-scriptureInk">
              {greeting}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] border border-borderSoft bg-surface text-xl text-softInk focus-ring"
          >
            {"⚙"}
          </button>
        </div>

        <div className="mt-[34px]">
          <TruthCard
            truth={today}
            statement={statement}
            saved={favorites.isSaved(today.id)}
            onToggleSaved={() => favorites.toggleSaved(today.id)}
            onShare={() => share.openShareTruth(today.id)}
          />
        </div>

        <p className="mt-[30px] text-[11px] font-extrabold uppercase tracking-[1.6px] text-accent">
          Reflect
        </p>
        <p className="mt-2.5 font-serif text-[23px] leading-8 text-scriptureInk">
          {today.reflectionQuestion}
        </p>

        <div className="mt-6 rounded-lg bg-tint p-5">
          <p className="text-xs font-extrabold uppercase tracking-[1.4px] text-accentDeep">
            Journal prompt
          </p>
          <p className="mt-2.5 font-serif text-[21px] leading-[29px] text-ink">
            {today.journalPrompt}
          </p>
          <button
            type="button"
            onClick={() =>
              setCompose({ prompt: today.journalPrompt, sourceTruthId: today.id })
            }
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-surface px-[18px] text-sm font-extrabold text-accentDeep focus-ring"
          >
            Write a reflection
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mt-6 block w-full rounded-xl bg-ink p-6 text-left shadow-card transition active:opacity-70 focus-ring"
        >
          <span className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-[#bfe0d6]">
            When your heart is heavy
          </span>
          <span className="mt-3 block font-serif text-[28px] leading-9 text-page">
            What lie are you believing?
          </span>
          <span className="mt-2.5 block text-[15px] leading-[23px] text-[#d6eae3]">
            Name what you are carrying and sit with what God says.
          </span>
        </button>
      </AppShell>

      <PersonalizationPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <StruggleSheet
        visible={pickerOpen}
        struggles={struggles}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => {
          const next = struggles.find((struggle) => struggle.id === id);
          if (!next) return;
          setPickerOpen(false);
          setSelectedStruggle(next);
        }}
      />

      {selectedStruggle ? (
        <StruggleResponse
          struggle={selectedStruggle}
          saved={favorites.isSaved(`lie-${selectedStruggle.id}`)}
          onBack={() => {
            setSelectedStruggle(null);
            setPickerOpen(true);
          }}
          onClose={() => setSelectedStruggle(null)}
          onToggleSaved={() =>
            favorites.toggleSaved(`lie-${selectedStruggle.id}`)
          }
          onJournal={() =>
            setCompose({
              prompt: selectedStruggle.reflection,
              sourceTruthId: `lie-${selectedStruggle.id}`,
            })
          }
          onShare={() =>
            share.openShareTruth(truthFromStruggle(selectedStruggle).id)
          }
        />
      ) : null}

      <JournalCompose
        visible={compose !== null}
        prompt={compose?.prompt ?? ""}
        onCancel={() => setCompose(null)}
        onSave={saveJournal}
      />

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={shareTruth}
        onClose={share.closeShareTruth}
        onCopy={() => {
          if (share.shareTruthId) void share.copyTruthLink(share.shareTruthId);
        }}
        onShare={() => {
          if (share.shareTruthId) void share.shareWithFriend(share.shareTruthId);
        }}
      />
      <Toast message={share.toast} />
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build Today screen"
```

---

## Task 13: Library screen, filters, and custom-promise compose

**Files:**
- Create: `src/components/TruthLibraryFilters.tsx`, `src/components/CustomPromiseCompose.tsx`
- Create: `src/app/library/page.tsx`

**Interfaces:**
- Consumes: `AppShell`, `SaveHeartButton`, `ActionPill`, `ShareTruthCard`, `Toast`; hooks `useVerses`, `useStruggles`, `useContent`, `useCustomLibrary`, `useFavorites`, `useShareTruth`; `getShareableTruthById`, `truthFromStruggle`; types `Truth`, `Struggle`, `TruthCategory`.
- Produces:
  - `TruthLibraryFilters({ filter, openMenu, onToggleMenu, onSelect })` with `type LibraryFilter = { group: "truths" | "lies" | null; category: TruthCategory | null }`.
  - `CustomPromiseCompose({ visible, onCancel, onSaveTruth, onSaveStruggle })` where `onSaveTruth(Omit<Truth,"id">)` and `onSaveStruggle(Omit<Struggle,"id">)`; validates all required fields before enabling Add.
  - Library route at `/library`.

- [ ] **Step 1: Create `TruthLibraryFilters.tsx`**

```tsx
"use client";

import type { TruthCategory } from "@/data/verseUtils";

type FilterGroup = "truths" | "lies";

export type LibraryFilter = {
  group: FilterGroup | null;
  category: TruthCategory | null;
};

const truthOptions: { label: string; category: TruthCategory | null }[] = [
  { label: "All identity truths", category: null },
  { label: "Purpose", category: "Purpose" },
  { label: "Identity", category: "Identity" },
];

const lieOptions: { label: string; category: TruthCategory | null }[] = [
  { label: "All struggles", category: null },
  { label: "Fear", category: "Fear" },
  { label: "Anxiety", category: "Anxiety" },
  { label: "Rejection", category: "Rejection" },
  { label: "Shame", category: "Shame" },
  { label: "Failure", category: "Failure" },
  { label: "Loneliness", category: "Loneliness" },
];

export function TruthLibraryFilters({
  filter,
  openMenu,
  onToggleMenu,
  onSelect,
}: {
  filter: LibraryFilter;
  openMenu: FilterGroup | null;
  onToggleMenu: (group: FilterGroup) => void;
  onSelect: (group: FilterGroup, category: TruthCategory | null) => void;
}) {
  const truthActive = filter.group === "truths";
  const lieActive = filter.group === "lies";

  return (
    <div className="mt-[22px]">
      <div className="flex gap-2.5">
        <FilterButton
          label={truthActive && filter.category ? filter.category : "Truths"}
          active={truthActive}
          onClick={() => onToggleMenu("truths")}
        />
        <FilterButton
          label={lieActive && filter.category ? filter.category : "Lies"}
          active={lieActive}
          onClick={() => onToggleMenu("lies")}
        />
      </div>
      {openMenu === "truths" ? (
        <Menu
          options={truthOptions}
          selected={truthActive ? filter.category : null}
          onSelect={(category) => onSelect("truths", category)}
        />
      ) : null}
      {openMenu === "lies" ? (
        <Menu
          options={lieOptions}
          selected={lieActive ? filter.category : null}
          onSelect={(category) => onSelect("lies", category)}
        />
      ) : null}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[46px] items-center rounded-full border px-[18px] text-sm font-bold focus-ring ${
        active
          ? "border-ink bg-ink text-page"
          : "border-border bg-surface text-softInk"
      }`}
    >
      {label}
    </button>
  );
}

function Menu({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; category: TruthCategory | null }[];
  selected: TruthCategory | null;
  onSelect: (category: TruthCategory | null) => void;
}) {
  return (
    <div className="mt-2.5 flex flex-col gap-0.5 rounded-lg border border-borderSoft bg-surface p-2 shadow-soft">
      {options.map((option) => {
        const active = selected === option.category;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.category)}
            className={`flex min-h-[44px] items-center rounded-sm px-3.5 text-left text-sm focus-ring ${
              active
                ? "bg-tint font-extrabold text-accentDeep"
                : "font-semibold text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create `CustomPromiseCompose.tsx`**

```tsx
"use client";

import { useState } from "react";

import type { Struggle, Truth, TruthCategory } from "@/data/verseUtils";

type ComposeType = "truth" | "struggle";
type AddTruthInput = Omit<Truth, "id">;
type AddStruggleInput = Omit<Struggle, "id">;

const truthCategories: TruthCategory[] = [
  "Purpose",
  "Identity",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
];

const struggleCategories: TruthCategory[] = [
  "Purpose",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
];

const defaultTruth: AddTruthInput = {
  category: "Identity",
  statement: "",
  reference: "",
  verse: "",
  reflectionQuestion: "",
  journalPrompt: "",
};

const defaultStruggle: AddStruggleInput = {
  label: "",
  category: "Anxiety",
  lie: "",
  truth: "",
  verses: [{ reference: "", verse: "" }],
  reflection: "",
  prayer: "",
};

export function CustomPromiseCompose({
  visible,
  onCancel,
  onSaveTruth,
  onSaveStruggle,
}: {
  visible: boolean;
  onCancel: () => void;
  onSaveTruth: (truth: AddTruthInput) => void;
  onSaveStruggle: (struggle: AddStruggleInput) => void;
}) {
  const [type, setType] = useState<ComposeType>("truth");
  const [truth, setTruth] = useState<AddTruthInput>(defaultTruth);
  const [struggle, setStruggle] = useState<AddStruggleInput>(defaultStruggle);

  if (!visible) return null;

  const reset = () => {
    setType("truth");
    setTruth(defaultTruth);
    setStruggle(defaultStruggle);
  };

  const canSave =
    type === "truth"
      ? Boolean(
          truth.statement.trim() &&
            truth.reference.trim() &&
            truth.verse.trim() &&
            truth.reflectionQuestion.trim() &&
            truth.journalPrompt.trim(),
        )
      : Boolean(
          struggle.label.trim() &&
            struggle.lie.trim() &&
            struggle.truth.trim() &&
            struggle.verses[0].reference.trim() &&
            struggle.verses[0].verse.trim() &&
            struggle.reflection.trim() &&
            struggle.prayer.trim(),
        );

  const save = () => {
    if (!canSave) return;
    if (type === "truth") {
      onSaveTruth({
        ...truth,
        statement: truth.statement.trim(),
        reference: truth.reference.trim(),
        verse: truth.verse.trim(),
        reflectionQuestion: truth.reflectionQuestion.trim(),
        journalPrompt: truth.journalPrompt.trim(),
      });
    } else {
      onSaveStruggle({
        ...struggle,
        label: struggle.label.trim(),
        lie: struggle.lie.trim(),
        truth: struggle.truth.trim(),
        verses: [
          {
            reference: struggle.verses[0].reference.trim(),
            verse: struggle.verses[0].verse.trim(),
          },
        ],
        reflection: struggle.reflection.trim(),
        prayer: struggle.prayer.trim(),
      });
    }
    reset();
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-page">
      <div className="w-full max-w-[480px] overflow-y-auto px-6 pb-11 pt-[max(env(safe-area-inset-top),48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
          Add your own promise
        </p>
        <h1 className="mt-2.5 font-serif text-[30px] leading-[38px] text-scriptureInk">
          Create a custom truth or struggle
        </h1>
        <p className="mt-2.5 text-sm leading-[21px] text-softInk">
          Include Scripture, a clear statement, and a reflection prompt so this
          entry is complete and useful later.
        </p>

        <div className="mt-[18px] flex gap-2.5">
          <TypeButton
            label="Truth"
            active={type === "truth"}
            onClick={() => setType("truth")}
          />
          <TypeButton
            label="Struggle"
            active={type === "struggle"}
            onClick={() => setType("struggle")}
          />
        </div>

        {type === "truth" ? (
          <div className="mt-[18px] flex flex-col gap-2">
            <FieldLabel label="Category" help="Pick the category this truth fits best." />
            <Options
              options={truthCategories}
              selected={truth.category}
              onSelect={(category) => setTruth((p) => ({ ...p, category }))}
            />
            <FieldLabel
              label="Truth statement"
              help="One clear sentence, like: You are loved and never alone."
            />
            <Field
              value={truth.statement}
              onChange={(v) => setTruth((p) => ({ ...p, statement: v }))}
              placeholder="You are ..."
            />
            <FieldLabel label="Scripture reference" help="For example: Romans 8:1" />
            <Field
              value={truth.reference}
              onChange={(v) => setTruth((p) => ({ ...p, reference: v }))}
              placeholder="Book Chapter:Verse"
            />
            <FieldLabel
              label="Verse text"
              help="Paste the verse text the statement is based on."
            />
            <Field
              multiline
              value={truth.verse}
              onChange={(v) => setTruth((p) => ({ ...p, verse: v }))}
              placeholder="Verse text..."
            />
            <FieldLabel
              label="Reflection question"
              help="Ask a heart-level question that invites response."
            />
            <Field
              value={truth.reflectionQuestion}
              onChange={(v) => setTruth((p) => ({ ...p, reflectionQuestion: v }))}
              placeholder="What is God inviting you to ...?"
            />
            <FieldLabel
              label="Journal prompt"
              help="Give a concrete writing prompt the user can respond to."
            />
            <Field
              value={truth.journalPrompt}
              onChange={(v) => setTruth((p) => ({ ...p, journalPrompt: v }))}
              placeholder="Write about ..."
            />
          </div>
        ) : (
          <div className="mt-[18px] flex flex-col gap-2">
            <FieldLabel
              label="Struggle label"
              help="This is the option users will tap, e.g. I feel rejected."
            />
            <Field
              value={struggle.label}
              onChange={(v) => setStruggle((p) => ({ ...p, label: v }))}
              placeholder="I feel ..."
            />
            <FieldLabel
              label="Category"
              help="Choose the emotional category this struggle belongs to."
            />
            <Options
              options={struggleCategories}
              selected={struggle.category}
              onSelect={(category) => setStruggle((p) => ({ ...p, category }))}
            />
            <FieldLabel label="Lie" help="Name the core lie in one sentence." />
            <Field
              value={struggle.lie}
              onChange={(v) => setStruggle((p) => ({ ...p, lie: v }))}
              placeholder="I am ..."
            />
            <FieldLabel
              label="Truth"
              help="State the gospel-centered truth that answers the lie."
            />
            <Field
              value={struggle.truth}
              onChange={(v) => setStruggle((p) => ({ ...p, truth: v }))}
              placeholder="In Christ ..."
            />
            <FieldLabel
              label="Main verse reference"
              help="Use one anchor reference for this struggle."
            />
            <Field
              value={struggle.verses[0].reference}
              onChange={(v) =>
                setStruggle((p) => ({
                  ...p,
                  verses: [{ ...p.verses[0], reference: v }],
                }))
              }
              placeholder="Book Chapter:Verse"
            />
            <FieldLabel
              label="Main verse text"
              help="Paste the verse text so it is available in the app."
            />
            <Field
              multiline
              value={struggle.verses[0].verse}
              onChange={(v) =>
                setStruggle((p) => ({
                  ...p,
                  verses: [{ ...p.verses[0], verse: v }],
                }))
              }
              placeholder="Verse text..."
            />
            <FieldLabel
              label="Reflection"
              help="Add a question that helps users process honestly."
            />
            <Field
              value={struggle.reflection}
              onChange={(v) => setStruggle((p) => ({ ...p, reflection: v }))}
              placeholder="What would it look like to ...?"
            />
            <FieldLabel
              label="Prayer"
              help="Write a short prayer users can pray in this struggle."
            />
            <Field
              multiline
              value={struggle.prayer}
              onChange={(v) => setStruggle((p) => ({ ...p, prayer: v }))}
              placeholder="Father, ... Amen."
            />
          </div>
        )}

        <div className="mt-[22px] flex justify-end gap-3">
          <button
            type="button"
            onClick={cancel}
            className="flex min-h-[48px] items-center rounded-full px-[18px] text-[15px] font-bold text-softInk focus-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={save}
            className={`flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-extrabold focus-ring ${
              canSave ? "bg-ink text-page" : "bg-tint text-mutedInk"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] items-center rounded-full border px-4 text-sm font-bold focus-ring ${
        active ? "border-ink bg-ink text-page" : "border-border bg-surface text-softInk"
      }`}
    >
      {label}
    </button>
  );
}

function FieldLabel({ label, help }: { label: string; help: string }) {
  return (
    <div>
      <p className="mt-2 text-[13px] font-extrabold text-ink">{label}</p>
      <p className="mt-0.5 text-xs leading-[18px] text-mutedInkAlt">{help}</p>
    </div>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const className =
    "mt-0.5 w-full rounded-md border border-borderSoft bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mutedInk focus-ring";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${className} min-h-[120px]`}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`${className} min-h-[44px]`}
    />
  );
}

function Options({
  options,
  selected,
  onSelect,
}: {
  options: TruthCategory[];
  selected: TruthCategory;
  onSelect: (value: TruthCategory) => void;
}) {
  return (
    <div className="mt-0.5 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`flex min-h-[36px] items-center rounded-full border px-3 text-xs font-bold focus-ring ${
              active
                ? "border-accentDeep bg-tint text-accentDeep"
                : "border-border bg-surface text-softInk"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/library/page.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";

import { ActionPill } from "@/components/ActionPill";
import { AppShell } from "@/components/AppShell";
import { CustomPromiseCompose } from "@/components/CustomPromiseCompose";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import {
  TruthLibraryFilters,
  type LibraryFilter,
} from "@/components/TruthLibraryFilters";
import { useContent, useStruggles, useVerses } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import type { Truth } from "@/data/verseUtils";
import { useCustomLibrary } from "@/hooks/useCustomLibrary";
import { useFavorites } from "@/hooks/useFavorites";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function LibraryScreen() {
  const truths = useVerses();
  const struggles = useStruggles();
  const content = useContent();
  const custom = useCustomLibrary();
  const favorites = useFavorites();
  const share = useShareTruth();

  const [filter, setFilter] = useState<LibraryFilter>({
    group: "truths",
    category: null,
  });
  const [openMenu, setOpenMenu] = useState<"truths" | "lies" | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const truthCards = useMemo(
    () => [...custom.truths, ...truths],
    [custom.truths, truths],
  );
  const lieCards = useMemo(
    () =>
      [...custom.struggles, ...struggles].map((struggle) =>
        truthFromStruggle(struggle),
      ),
    [custom.struggles, struggles],
  );

  const filtered = useMemo(() => {
    const pool = filter.group === "lies" ? lieCards : truthCards;
    if (!filter.category) return pool;
    return pool.filter((truth) => truth.category === filter.category);
  }, [filter, lieCards, truthCards]);

  const shareTruth = share.shareTruthId
    ? getShareableTruthById(share.shareTruthId, content)
    : undefined;

  const isCustom = (id: string) =>
    id.startsWith("custom-truth-") || id.startsWith("lie-custom-struggle-");

  const shareCustom = async (truth: Truth) => {
    const text = `"${truth.statement}" - ${truth.reference}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "What God Says About Me", text });
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  return (
    <>
      <AppShell activeTab="library">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
              Truth library
            </p>
            <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
              Find the truth you need
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            aria-label="Add a custom promise"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-tint text-[26px] leading-none text-accentDeep focus-ring"
          >
            +
          </button>
        </div>

        <TruthLibraryFilters
          filter={filter}
          openMenu={openMenu}
          onToggleMenu={(group) =>
            setOpenMenu((current) => (current === group ? null : group))
          }
          onSelect={(group, category) => {
            setFilter({ group, category });
            setOpenMenu(null);
          }}
        />

        <div className="mt-[22px] flex flex-col gap-3.5">
          {filtered.length > 0 ? (
            filtered.map((truth) => (
              <div
                key={truth.id}
                className="rounded-lg border border-borderSoft bg-surface p-5 shadow-soft"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-accent">
                  {truth.category}
                </p>
                <p className="mt-2.5 font-serif text-[23px] leading-[31px] text-scriptureInk">
                  {truth.statement}
                </p>
                <p className="mt-3 font-serif italic text-[15px] text-accentDeep">
                  {truth.reference}
                </p>
                <div className="mt-3.5 flex gap-3">
                  <SaveHeartButton
                    saved={favorites.isSaved(truth.id)}
                    onClick={() => favorites.toggleSaved(truth.id)}
                  />
                  <ActionPill
                    label="Share"
                    onClick={() => {
                      if (isCustom(truth.id)) {
                        void shareCustom(truth);
                        return;
                      }
                      share.openShareTruth(truth.id);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center rounded-lg bg-surface p-[26px]">
              <p className="text-[15px] text-softInk">
                No truths found for this filter.
              </p>
              <button
                type="button"
                onClick={() => setFilter({ group: "truths", category: null })}
                className="mt-2 flex min-h-[44px] items-center font-extrabold text-accentDeep focus-ring"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </AppShell>

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={shareTruth}
        onClose={share.closeShareTruth}
        onCopy={() => {
          if (share.shareTruthId) void share.copyTruthLink(share.shareTruthId);
        }}
        onShare={() => {
          if (share.shareTruthId) void share.shareWithFriend(share.shareTruthId);
        }}
      />
      <Toast message={share.toast} />

      <CustomPromiseCompose
        visible={composeOpen}
        onCancel={() => setComposeOpen(false)}
        onSaveTruth={(truth) => {
          custom.addTruth(truth);
          setComposeOpen(false);
          setFilter({ group: "truths", category: truth.category });
        }}
        onSaveStruggle={(struggle) => {
          custom.addStruggle(struggle);
          setComposeOpen(false);
          setFilter({ group: "lies", category: struggle.category });
        }}
      />
    </>
  );
}
```

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TruthLibraryFilters.tsx src/components/CustomPromiseCompose.tsx src/app/library/page.tsx
git commit -m "feat: build library screen with filters and custom compose"
```

---

## Task 14: Journal screen

**Files:**
- Create: `src/app/journal/page.tsx`

**Interfaces:**
- Consumes: `AppShell`, `JournalCompose`; `useJournal`.
- Produces: Journal route at `/journal` — list newest-first, add/edit (prefilled)/delete (confirm).

- [ ] **Step 1: Create `src/app/journal/page.tsx`**

```tsx
"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { JournalCompose } from "@/components/JournalCompose";
import { useJournal } from "@/hooks/useJournal";

const NEW_PROMPT = "What is God reminding you of today?";

export default function JournalScreen() {
  const journal = useJournal();
  const [composePrompt, setComposePrompt] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");

  const startNew = () => {
    setEditingEntryId(null);
    setEditingBody("");
    setComposePrompt(NEW_PROMPT);
  };

  const confirmDelete = (id: string) => {
    const ok =
      typeof window === "undefined" || typeof window.confirm !== "function"
        ? true
        : window.confirm(
            "Delete entry?\n\nThis reflection will be permanently removed.",
          );
    if (ok) journal.deleteEntry(id);
  };

  return (
    <>
      <AppShell activeTab="journal">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
              Journal
            </p>
            <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
              Make room for reflection
            </h1>
          </div>
          <button
            type="button"
            onClick={startNew}
            aria-label="New journal entry"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-tint text-[26px] leading-none text-accentDeep focus-ring"
          >
            +
          </button>
        </div>

        <div className="mt-[26px] flex flex-col gap-3.5">
          {journal.entries.length > 0 ? (
            journal.entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-borderSoft bg-surface p-5 shadow-soft"
              >
                <p className="text-xs font-extrabold uppercase tracking-[1.3px] text-accent">
                  {new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(entry.createdAt))}
                </p>
                <p className="mt-2.5 font-serif text-[20px] leading-7 text-scriptureInk">
                  {entry.prompt}
                </p>
                <p className="mt-2.5 whitespace-pre-wrap text-[15px] leading-[23px] text-softInk">
                  {entry.body}
                </p>
                <div className="mt-3.5 flex gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntryId(entry.id);
                      setEditingBody(entry.body);
                      setComposePrompt(entry.prompt);
                    }}
                    aria-label="Edit journal entry"
                    className="flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-extrabold text-softInk focus-ring"
                  >
                    Edit <span aria-hidden>{"✎"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(entry.id)}
                    aria-label="Delete journal entry"
                    className="flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-extrabold text-accentDeep focus-ring"
                  >
                    Delete <span aria-hidden>{"\u{1F5D1}"}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-borderSoft bg-surface p-7 text-center">
              <p className="text-[15px] text-softInk">
                Your reflections will appear here.
              </p>
              <button
                type="button"
                onClick={startNew}
                className="mt-4 flex min-h-[44px] items-center rounded-full bg-ink px-[18px] text-sm font-extrabold text-page focus-ring"
              >
                Write a reflection
              </button>
            </div>
          )}
        </div>
      </AppShell>

      <JournalCompose
        key={editingEntryId ? `edit-${editingEntryId}` : `new-${composePrompt ?? "closed"}`}
        visible={composePrompt !== null}
        prompt={composePrompt ?? ""}
        initialBody={editingEntryId ? editingBody : ""}
        onCancel={() => {
          setComposePrompt(null);
          setEditingEntryId(null);
          setEditingBody("");
        }}
        onSave={(body) => {
          if (!composePrompt) return;
          if (editingEntryId) {
            journal.updateEntry(editingEntryId, body);
          } else {
            journal.addEntry({ prompt: composePrompt, body });
          }
          setComposePrompt(null);
          setEditingEntryId(null);
          setEditingBody("");
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/journal/page.tsx
git commit -m "feat: build journal screen"
```

---

## Task 15: Favorites screen

**Files:**
- Create: `src/app/favorites/page.tsx`

**Interfaces:**
- Consumes: `AppShell`, `SaveHeartButton`, `ActionPill`, `ShareTruthCard`, `Toast`; `useContent`, `useCustomLibrary`, `useFavorites`, `useShareTruth`; `getShareableTruthById`, `truthFromStruggle`.
- Produces: Favorites route at `/favorites` — saved truths + struggle-truths, guiding empty state.

- [ ] **Step 1: Create `src/app/favorites/page.tsx`**

```tsx
"use client";

import { ActionPill } from "@/components/ActionPill";
import { AppShell } from "@/components/AppShell";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import { useContent } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import type { Truth } from "@/data/verseUtils";
import { useCustomLibrary } from "@/hooks/useCustomLibrary";
import { useFavorites } from "@/hooks/useFavorites";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function FavoritesScreen() {
  const favorites = useFavorites();
  const content = useContent();
  const custom = useCustomLibrary();
  const share = useShareTruth();

  const resolveSavedTruth = (id: string): Truth | undefined => {
    if (id.startsWith("lie-")) {
      const struggleId = id.slice(4);
      const customStruggle = custom.struggles.find((s) => s.id === struggleId);
      if (customStruggle) return truthFromStruggle(customStruggle);
      return getShareableTruthById(id, content);
    }
    const customTruth = custom.truths.find((t) => t.id === id);
    if (customTruth) return customTruth;
    return getShareableTruthById(id, content);
  };

  const isCustom = (id: string) =>
    id.startsWith("custom-truth-") || id.startsWith("lie-custom-struggle-");

  const shareCustom = async (truth: Truth) => {
    const text = `"${truth.statement}" - ${truth.reference}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "What God Says About Me", text });
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  const savedTruths = favorites.savedIds
    .map(resolveSavedTruth)
    .filter((truth): truth is Truth => truth !== undefined);

  const shareTruth = share.shareTruthId
    ? resolveSavedTruth(share.shareTruthId)
    : undefined;

  return (
    <>
      <AppShell activeTab="favorites">
        <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
          Favorites
        </p>
        <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
          Saved truths
        </h1>

        <div className="mt-[26px] flex flex-col gap-3.5">
          {savedTruths.length > 0 ? (
            savedTruths.map((truth) => (
              <div
                key={truth.id}
                className="rounded-lg border border-borderSoft bg-surface p-5 shadow-soft"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-accent">
                  {truth.category}
                </p>
                <p className="mt-2.5 font-serif text-[23px] leading-[31px] text-scriptureInk">
                  {truth.statement}
                </p>
                <p className="mt-3 font-serif italic text-[15px] text-accentDeep">
                  {truth.reference}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <SaveHeartButton
                    saved
                    onClick={() => favorites.toggleSaved(truth.id)}
                  />
                  <ActionPill
                    label="Share"
                    variant="tint"
                    onClick={() => {
                      if (isCustom(truth.id)) {
                        void shareCustom(truth);
                        return;
                      }
                      share.openShareTruth(truth.id);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-borderSoft bg-surface p-7 text-center">
              <p className="font-serif text-2xl leading-[31px] text-scriptureInk">
                Saved truths will appear here.
              </p>
              <p className="mt-2.5 text-[15px] leading-[23px] text-softInk">
                Tap Save on any truth you want to return to.
              </p>
            </div>
          )}
        </div>
      </AppShell>

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={shareTruth}
        onClose={share.closeShareTruth}
        onCopy={() => {
          if (share.shareTruthId) void share.copyTruthLink(share.shareTruthId);
        }}
        onShare={() => {
          if (share.shareTruthId) void share.shareWithFriend(share.shareTruthId);
        }}
      />
      <Toast message={share.toast} />
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/favorites/page.tsx
git commit -m "feat: build favorites screen"
```

---

## Task 16: Shareable truth route `/t/[id]`

**Files:**
- Create: `src/app/t/[id]/page.tsx`

**Interfaces:**
- Consumes: `ActionPill`, `ShareTruthCard`, `Toast`; `useContent`, `useShareTruth`; `getShareableTruthById`.
- Produces: route `/t/[id]` resolving plain and `lie-` ids, with not-found fallback.

- [ ] **Step 1: Create `src/app/t/[id]/page.tsx`**

```tsx
"use client";

import Link from "next/link";
import { use } from "react";

import { ActionPill } from "@/components/ActionPill";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import { useContent } from "@/data/ContentProvider";
import { getShareableTruthById } from "@/data/content";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function TruthLinkScreen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const content = useContent();
  const truth = getShareableTruthById(id, content);
  const share = useShareTruth();

  if (!truth) {
    return (
      <div className="min-h-[100dvh] bg-page">
        <div className="mx-auto w-full max-w-[480px] px-6 pt-10">
          <div className="rounded-xl bg-surface p-7">
            <h1 className="font-serif text-[30px] leading-[38px] text-scriptureInk">
              Truth not found
            </h1>
            <p className="mt-2.5 text-[15px] leading-[23px] text-softInk">
              This link may have changed. You can return to Today and find a
              truth to sit with.
            </p>
            <Link
              href="/"
              className="mt-[18px] inline-block text-[15px] font-extrabold text-accentDeep focus-ring"
            >
              Return to Today
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-page">
      <div className="mx-auto w-full max-w-[480px] px-6 pt-10">
        <div className="rounded-xl border border-borderSoft bg-surface p-[30px] shadow-card">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[1.6px] text-accent">
            {truth.category}
          </p>
          <p className="mt-[18px] text-center font-serif text-[31px] leading-[41px] text-scriptureInk">
            {truth.statement}
          </p>
          <p className="mt-[18px] text-center font-serif italic text-base text-accentDeep">
            {truth.reference}
          </p>
          <p className="mt-4 text-center text-[15px] leading-6 text-softInk">
            {truth.verse}
          </p>
          <p className="mt-[22px] border-t border-borderSoft pt-3.5 text-center font-serif italic text-[13px] text-mutedInkAlt">
            whatgodsaysabout.me
          </p>
        </div>

        <p className="mt-6 text-center font-serif text-[19px] text-ink">
          Encourage a friend with this truth.
        </p>

        <div className="mt-[18px] flex flex-col gap-2.5">
          <ActionPill
            label="Copy link"
            variant="tint"
            onClick={() => void share.copyTruthLink(truth.id)}
          />
          <ActionPill
            label="Share with a friend"
            variant="dark"
            onClick={() => share.openShareTruth(truth.id)}
          />
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-bold text-softInk focus-ring"
        >
          Return to Today
        </Link>
      </div>

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={truth}
        onClose={share.closeShareTruth}
        onCopy={() => void share.copyTruthLink(truth.id)}
        onShare={() => void share.shareWithFriend(truth.id)}
      />
      <Toast message={share.toast} />
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/t/[id]/page.tsx
git commit -m "feat: add shareable truth route"
```

---

## Task 17: Legacy redirect, About/contact restyle, cleanup, full verification

**Files:**
- Replace: `src/app/[slug]/page.tsx`
- Delete: `src/app/begin.tsx`, `src/app/loadData.tsx`, `src/app/personalization.tsx`
- Modify: `src/app/about/page.tsx`, `src/app/contactform.tsx` (restyle to theme; keep behavior)
- Verify: typecheck, lint, build, manual

**Interfaces:**
- Produces: numeric `/[slug]` → `/t/identity-{n}` redirect; no remaining imports of deleted modules.

- [ ] **Step 1: Replace `src/app/[slug]/page.tsx` with a redirect**

```tsx
import { redirect } from "next/navigation";

export default function LegacySlugRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const raw = Number.parseInt(params.slug, 10);
  const n = Number.isFinite(raw) && raw > 0 ? raw : 1;
  redirect(`/t/identity-${n}`);
}
```

- [ ] **Step 2: Delete the old landing-page modules**

Run:

```bash
git rm src/app/begin.tsx src/app/loadData.tsx src/app/personalization.tsx
```

Expected: files removed. (The new `src/app/page.tsx` from Task 12 no longer imports them.)

- [ ] **Step 3: Confirm no lingering imports of deleted modules**

Run:

```bash
grep -rn "loadData\|begin\|app/personalization" src/app || echo "clean"
```

Expected: `clean` (or only matches inside comments/unrelated words — there must be no `import` lines referencing the deleted files).

- [ ] **Step 4: Restyle the About page to the new theme**

Replace `src/app/about/page.tsx`:

```tsx
import Link from "next/link";
import type { Metadata } from "next";

import ContactForm from "@/app/contactform";
import Footer from "@/app/footer";

export const metadata: Metadata = {
  title: "About — What God Says About Me",
  description: "Why this app exists and how to get in touch.",
};

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-page">
      <div className="mx-auto w-full max-w-[480px] px-6 pb-16 pt-10">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-[13px] font-extrabold uppercase tracking-[1.2px] text-accentDeep focus-ring"
        >
          ← Back
        </Link>

        <h1 className="mt-2 font-serif text-[44px] leading-[52px] text-scriptureInk">
          About
        </h1>

        <div className="mt-4 flex flex-col gap-4 text-[17px] leading-[25px] text-softInk">
          <p>
            We&apos;re so glad you found your way here. This simple app exists for
            one reason: to remind you of who you really are.
          </p>
          <p>
            Following Jesus was never a promise that life would be easy — but it
            is an invitation into something far better. He welcomes you as a
            beloved son or daughter of the God who made the universe, and made
            you.
          </p>
          <p>
            You are seen. You are cared for. You are deeply loved. And the One who
            created you longs to know you.
          </p>
        </div>

        <h2 className="mt-6 font-serif text-2xl text-ink">Contact Us</h2>
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Restyle the contact form to the new theme**

Open `src/app/contactform.tsx`, and update the Tailwind class names on its inputs/buttons to the new tokens (replace any `daisyUI`/old utility classes). Use these classes consistently:

- Field wrapper: `className="mt-4 flex flex-col gap-1.5"`
- Label: `className="text-sm font-bold text-ink"`
- Input / textarea: `className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink placeholder:text-mutedInk focus-ring"`
- Error text: `className="text-[13px] text-danger"`
- Submit button: `className="mt-4 flex min-h-[48px] items-center justify-center rounded-full bg-ink px-8 text-base font-extrabold text-page disabled:opacity-50 focus-ring"`
- Success pill: `className="mt-4 rounded-full bg-tint px-8 py-4 text-center text-lg font-bold text-ink"`
- Error pill: `className="mt-4 rounded-full bg-danger px-8 py-4 text-center text-lg font-bold text-page"`

Keep all existing logic (react-hook-form, POST to `/api/contact`, success/error timers) unchanged — only the `className` strings change. Do not alter the form field names (`name`, `email`, `message`) or the submit handler.

- [ ] **Step 6: Run the unit tests**

Run: `npm test`
Expected: all suites PASS.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable). Fix any errors surfaced (commonly unused imports or unescaped entities).

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: build succeeds; routes `/`, `/library`, `/journal`, `/favorites`, `/t/[id]`, `/[slug]`, `/about`, `/privacy` all compile.

- [ ] **Step 10: Manual mobile-viewport verification**

Run `npm run dev`, open `http://localhost:3000` in a mobile viewport (DevTools device toolbar, ~390px), and confirm:
- Today opens directly (no landing page); date + greeting + truth card + reflection + journal prompt + dark lie card render.
- Tapping the lie card opens the struggle sheet; selecting a struggle shows lie → "but God says" → truth → verses → reflection → prayer with Save / Journal this / Share.
- "Write a reflection" opens the compose modal; saving navigates to Journal and the entry appears newest-first; edit prefills; delete confirms and removes.
- Library: Truths/Lies filter, category filter, "+" opens the custom compose (Add disabled until all fields filled); saved/share work.
- Favorites: saved items appear; empty state guides back.
- `/t/eph2-10` renders a shareable card; copy link shows a toast; `/t/lie-rejected` resolves; `/t/bogus` shows not-found.
- Visit `/5` and confirm it redirects to `/t/identity-5`.
- Personalization: open gear, enable, set a name → greeting and today's statement update.
- Reload the page and confirm journal entries, favorites, custom items, and personalization persist.
- Confirm bundled content renders with no `NEXT_PUBLIC_CONTENT_URL` set (remote fallback path).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: legacy redirect, restyle about/contact, remove old landing modules"
```

---

## Self-Review

**Spec coverage:**
- Today screen + daily truth → Task 12 (deterministic via Task 3). ✓
- Personalized greeting/truth → Task 12 + `PersonalizationPanel` (Task 11) + `useSettings` (Task 7). ✓
- Truth card save/favorite + share → `TruthCard` (Task 9), `useFavorites` (Task 7), `useShareTruth` (Task 7). ✓
- Reflection prompt + journal flow → Task 12 (compose) + Task 14 (journal). ✓
- "What lie are you believing?" struggle flow → Tasks 10 + 12. ✓
- Library of truths and struggles → Task 13. ✓
- Favorites → Task 15. ✓
- Journal entries (shape, add/edit/delete, newest-first, persist) → Tasks 5, 7, 14. ✓
- Add custom truths/struggles → Task 13 (`CustomPromiseCompose`) + Task 7 (`useCustomLibrary`). ✓
- Remote content loading compatible with `content.bundled.json` → Task 4. ✓
- No notifications/reminders → none ported; SettingsDialog/notifications omitted. ✓
- Routing `/`, `/library`, `/journal`, `/favorites`, `/t/:id` → Tasks 12–16; legacy redirect → Task 17. ✓
- Sharing (navigator.share + clipboard fallback, statement+reference+link) → Task 7. ✓
- Design direction (mobile-first, serif/sans, soft blue surfaces, rounded cards, bottom nav, opens into Today) → Tasks 6, 8, 12. ✓
- Verification (typecheck/lint/build/manual/persistence/remote fallback) → Task 17. ✓

**Placeholder scan:** No TBD/TODO; every code step includes complete code. Step 5 of Task 17 specifies exact class strings rather than rewriting the whole form, because the form's logic is pre-existing and unchanged — the change is purely class names, fully enumerated.

**Type consistency:** `ContentPayload`/`Truth`/`Struggle`/`TruthCategory` are defined once (Task 1) and imported everywhere. `JournalEntry` defined in Task 5, reused via `useJournal`. `LibraryFilter` defined in Task 13 and consumed by `/library`. Hook signatures in the Interfaces blocks match their implementations (`isSaved`/`toggleSaved`, `addEntry`/`updateEntry`/`deleteEntry`, `addTruth`/`addStruggle`, `openShareTruth`/`copyTruthLink`/`shareWithFriend`). `truthUrl` is exported from `useShareTruth` and imported by `ShareTruthCard`. Storage functions are synchronous and the hooks call them synchronously.
