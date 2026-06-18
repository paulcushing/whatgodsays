# Public Content JSON Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the bundled verse content at `/content.json` for mobile apps.

**Architecture:** Keep `src/data/content.bundled.json` as the authoritative source in the repository. Serve a static public copy from `public/content.json`, with a regression test that validates the copy against the source and the existing payload guard.

**Tech Stack:** Next.js 14 App Router static assets, TypeScript, Vitest, Node `fs/promises`.

## Global Constraints

- The public URL is `/content.json`.
- The JSON shape is the existing `ContentPayload` with `version`, `truths`, and `struggles`.
- `src/data/content.bundled.json` remains the authoritative source in the repo.
- No runtime API route is needed for this static payload.

---

### Task 1: Static Public Content File

**Files:**
- Create: `public/content.json`
- Create: `src/data/publicContent.test.ts`
- Reference: `src/data/content.bundled.json`
- Reference: `src/lib/remoteContent.ts`

**Interfaces:**
- Consumes: `isContentPayload(value: unknown): value is ContentPayload` from `src/lib/remoteContent.ts`
- Produces: `/content.json`, served by Next.js from `public/content.json`

- [ ] **Step 1: Write the failing test**

Create `src/data/publicContent.test.ts`:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import bundled from "./content.bundled.json";
import { isContentPayload } from "@/lib/remoteContent";

describe("public/content.json", () => {
  it("matches the bundled authoritative content", async () => {
    const publicPath = path.join(process.cwd(), "public", "content.json");
    const publicContent = JSON.parse(await readFile(publicPath, "utf8"));

    expect(isContentPayload(publicContent)).toBe(true);
    expect(publicContent).toEqual(bundled);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/publicContent.test.ts`

Expected: FAIL with `ENOENT` for `public/content.json`.

- [ ] **Step 3: Create the public file**

Copy `src/data/content.bundled.json` to `public/content.json`.

- [ ] **Step 4: Run focused test to verify it passes**

Run: `npm test -- src/data/publicContent.test.ts`

Expected: PASS with `1 passed`.

- [ ] **Step 5: Run full verification**

Run: `npm test`

Expected: all Vitest test files pass.

Run: `npm run build`

Expected: Next production build completes successfully.
