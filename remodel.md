# Remodel: Web Formation App

Evolving this Next.js web app into the same calm, mobile-first formation
experience as the Expo app (`../whatgodsaysaboutme-app`) — Today / Library /
Journal / Favorites, the struggle ("what lie are you believing?") flow, custom
content, sharing, and remote-content loading — **with no notifications or
reminders**.

- **Branch:** `remodel`
- **Design spec:** [docs/superpowers/specs/2026-06-17-web-formation-app-design.md](docs/superpowers/specs/2026-06-17-web-formation-app-design.md)
- **Implementation plan:** [docs/superpowers/plans/2026-06-17-web-formation-app.md](docs/superpowers/plans/2026-06-17-web-formation-app.md)
- **Execution model:** subagent-driven (fresh implementer + reviewer per task)
- **Progress ledger (source of truth):** `.git/sdd/progress.md`

---

## Key Decisions

1. **Old experience replaced.** Removed the numeric `/[slug]` verse-flipper,
   `begin.tsx`, landing-page `page.tsx`, and inline 50-verse data. Legacy numeric
   URLs (`/5`) redirect to a truth (`/t/identity-5`).
2. **Kept:** Privacy page, PWA (installable; service worker + install prompt),
   About + contact form (posts to existing `/api/contact`).
3. **Dropped:** the reminder/notification Settings dialog. The only settings
   surface is personalization (name + gender), in a gear-icon panel on Today.
4. **Styling:** Tailwind with Expo theme tokens ported into `tailwind.config.ts`;
   Newsreader (serif) + Mulish (sans) via `next/font/google`; daisyUI removed.
5. **Persistence:** browser `localStorage` (SSR-safe). Reuses existing keys
   `personalize` / `name` / `gender`.
6. **Remote content:** optional `NEXT_PUBLIC_CONTENT_URL`; validated before use;
   falls back to bundled `src/data/content.bundled.json` on any failure.
7. **Testing:** Vitest + jsdom for pure-logic modules (data/storage); UI tasks
   gate on `tsc` + `next build` + manual mobile-viewport check.

---

## Task Plan & Status

Legend: ✅ complete (implemented + reviewed + committed) · ▶ in progress · ⬜ not started

| # | Task | Status | Commits |
|---|------|--------|---------|
| 1 | Bundled content, types, Vitest harness | ✅ | `da7f2de..a9639d6` |
| 2 | Content lookup helpers | ✅ | `a9639d6..a0bb3f1` |
| 3 | Deterministic daily truth + date helpers | ✅ | `a0bb3f1..d7c97d6` |
| 4 | Remote content loader + validation + fallback | ✅ | `d7c97d6..60e0136` |
| 5 | localStorage storage modules | ✅ | `60e0136..91683a8` |
| 6 | Tailwind theme, fonts, layout (drop daisyUI) | ✅ | `91683a8..9aafea1` |
| 7 | ContentProvider + hooks | ✅ | `9aafea1..180246f` |
| 8 | AppShell, BottomTabs, primitives | ✅ | `180246f..bc14e71` |
| 9 | TruthCard + ShareTruthCard | ✅ | `bc14e71..e61eb66` |
| 10 | StruggleSheet + StruggleResponse | ✅ | `e61eb66..3f8c871` |
| 11 | JournalCompose + PersonalizationPanel | ✅ | `3f8c871..e43572f` |
| 12 | **Today screen** (`src/app/page.tsx`) | ▶ | uncommitted working-tree change; not yet typechecked/built/reviewed |
| 13 | Library + filters + custom-promise compose | ⬜ | — |
| 14 | Journal screen | ⬜ | — |
| 15 | Favorites screen | ⬜ | — |
| 16 | Shareable truth route `/t/[id]` | ⬜ | — |
| 17 | Legacy redirect, About restyle, cleanup, full verification | ⬜ | — |
| — | Final whole-branch code review | ⬜ | — |

As of Task 11, `next build` succeeded and all **27** unit tests passed.

---

## Current State (resume here)

- Tasks 1–11 are complete, reviewed, and committed on `remodel`.
- **Task 12 is paused.** `src/app/page.tsx` has been overwritten with the
  Today-screen implementation but is **uncommitted** and has **not** been
  typechecked, built, or reviewed. (`git status` shows ` M src/app/page.tsx`.)
- To resume Task 12: verify the working-tree `page.tsx` against the Task 12
  brief, run `npx tsc --noEmit && npm run build && npm test`, commit, then run
  the task review. The new `page.tsx` must NOT import the old `begin.tsx`,
  `loadData.tsx`, or `personalization.tsx` (those are deleted in Task 17).

### Files still to create (Tasks 13–17)
- `src/components/TruthLibraryFilters.tsx`, `src/components/CustomPromiseCompose.tsx`
- `src/app/library/page.tsx`, `src/app/journal/page.tsx`,
  `src/app/favorites/page.tsx`, `src/app/t/[id]/page.tsx`

### Cleanup deferred to Task 17
- Replace `src/app/[slug]/page.tsx` with the numeric→`/t/identity-{n}` redirect.
- Delete `src/app/begin.tsx`, `src/app/loadData.tsx`, `src/app/personalization.tsx`.
- Restyle `src/app/about/page.tsx` + `src/app/contactform.tsx` to the new theme.
- Final verification: `tsc`, `lint`, `build`, manual mobile viewport, persistence,
  remote fallback.

---

## Review Findings Carried Forward

Fixed during task reviews: remote payload byte-cap (`60e0136`), dead `persist`
helper + `ContentProvider.refresh` unmount guard (`180246f`), active-tab
`aria-current` (`bc14e71`), share-card close-button alignment (`e61eb66`).

**Open for the final whole-branch review:**
- **Cross-cutting Minor:** modals lack `role="dialog"` / `aria-modal` / focus-trap
  (ShareTruthCard, StruggleSheet, JournalCompose, PersonalizationPanel).
- Minor: `hasStorage()` guard duplicated across the four storage modules.
- Minor: no branch tests for `refreshRemoteContent` (throttle/304/ETag/timeout).
- Adjudicated non-issues (no action): Task 5 "test isolation" (global
  `afterEach` clears localStorage); Task 10 `StruggleResponse` null guard (prop is
  non-optional, gated by caller) and verse keys (unique per struggle); Task 8
  `ActionPill` selected/tint collapse (matches reference app).
