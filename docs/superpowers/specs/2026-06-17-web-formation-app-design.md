# Web Formation App — Replicating the Expo Experience

**Date:** 2026-06-17
**Status:** Approved (design)
**Repo:** `whatgodsays` (Next.js 14 App Router web app)
**Reference:** `../whatgodsaysaboutme-app` (Expo / React Native)

## Goal

Evolve the existing Next.js web app from a verse-flipper landing experience into
the same calm, mobile-first formation experience as the Expo app: a Today screen
with a daily truth, a struggle ("what lie are you believing?") flow, a journal, a
truth library, favorites, custom content, and remote-content loading — **without**
any push-notification or reminder functionality.

The bundled content source is `content.bundled.json`, copied verbatim from the
Expo app, conforming to the `ContentPayload` shape below.

## Non-Goals / Explicit Exclusions

- No push notifications.
- No daily reminder scheduling.
- No native-only or Expo-specific modules (`expo-*`, AsyncStorage, react-native).
- No reminder UI. The only settings surface is personalization (name/gender).

## Decisions (from brainstorming)

1. **Old experience:** Replace the numeric `/[slug]` verse-flipper, `begin.tsx`,
   landing-page `page.tsx`, and inline 50-verse data. Add a legacy redirect so old
   numeric URLs (`/5`) resolve to a truth (`/t/identity-5`), matching how the Expo
   app handles `/verse/[id]`.
2. **Secondary pages kept:** Privacy page, PWA (installable; service worker +
   install prompt), and About + contact form (posts to existing `/api/contact`).
   The reminder/notification Settings dialog is **dropped**.
3. **Styling:** Tailwind with the Expo theme ported into `tailwind.config.ts`
   (colors, radii, shadows as tokens). Drop daisyUI. Newsreader (serif) + Mulish
   (sans) via `next/font/google`.
4. **Personalization location:** A small gear-icon panel on the Today header,
   personalization-only (name + gender), reusing the existing `localStorage` keys
   (`personalize` / `name` / `gender`) so current users keep their settings.

## Data Model

```ts
type ContentPayload = {
  version: string;
  truths: Truth[];
  struggles: Struggle[];
};

type TruthCategory =
  | "Purpose" | "Identity" | "Fear" | "Anxiety"
  | "Rejection" | "Shame" | "Failure" | "Loneliness";

type Truth = {
  id: string;
  category: TruthCategory;
  statement: string;
  reference: string;
  verse: string;
  reflectionQuestion: string;
  journalPrompt: string;
  personalized?: { masculine: string; feminine: string };
};

type Struggle = {
  id: string;
  label: string;
  category: TruthCategory;
  lie: string;
  truth: string;
  verses: { reference: string; verse: string }[];
  reflection: string;
  prayer: string;
};

type JournalEntry = {
  id: string;
  createdAt: string;
  prompt: string;
  body: string;
  sourceTruthId?: string;
};
```

## Architecture

- Next.js 14 App Router, TypeScript, Tailwind. Mobile-first single column,
  max-width ~480px centered, with the Expo vertical "mist" gradient background and
  a fixed bottom tab bar (Today / Library / Journal / Favorites).
- All interactive screens are **client components** (they read browser storage).
- Content flows through a React context (`ContentProvider`), mirroring the Expo
  `VersesProvider` (exposes content + a `refresh()`).
- Fonts: Newsreader (serif, for Scripture/statements) + Mulish (sans, for
  labels/actions/body) via `next/font/google`.

### Theme tokens (ported from Expo `theme.ts`)

Colors (`page #f6f8fb`, `surface #edf2f8`, `ink #243347`, `scriptureInk #1b2737`,
`softInk #5d6f85`, `mutedInk #8492a5`, `accent #607691`, `accentDeep #42576f`,
`accentBright #7e94ad`, `tint #dce4ee`, `border #cfd7e2`, `borderSoft #dfe5ee`,
`borderCool #c2ccd9`, `white #ffffff`, `danger #8c6154`), radii (sm 14 / md 20 /
lg 24 / xl 28 / pill 999), and the two card/soft shadows become Tailwind theme
extensions. Background gradient: `#f6f8fb → #edf2f8 → #d8e2ee → #aebed1`.

## Data Layer

Ported from the Expo `src/data` layer, adapted from AsyncStorage to `localStorage`:

- `src/data/content.bundled.json` — the copied bundled content (fallback source).
- `src/data/verseUtils.ts` — `Truth`, `Struggle`, `ContentPayload`, `TruthCategory`.
- `src/data/content.ts` — `getTruthById`, `getStruggleById`, `truthFromStruggle`,
  `getShareableTruthById` (resolves `lie-<id>` to a struggle-derived truth).
- `src/data/dailyTruth.ts` — `getDailyTruth(date, truths)` (deterministic by
  date-hash; not random per render), `formatToday`, `greetingForDate`.
- `src/lib/remoteContent.ts` — port of `remoteVerses.ts`:
  - Reads `process.env.NEXT_PUBLIC_CONTENT_URL` (optional).
  - Validates the full payload shape (`isContentPayload`, including category and
    nested verse/personalized checks) before use.
  - Timeout (AbortController), size cap, ETag/throttle, caches accepted payload in
    `localStorage`; **falls back to bundled content** on any failure.
  - Returns bundled unless a cached/remote payload has a strictly greater `version`.
  - Runs client-side on mount.
- `src/data/ContentProvider.tsx` — client context: `useContent`, `useVerses`,
  `useStruggles`, `useRefreshContent`.

## State & Persistence (browser `localStorage`, SSR-safe)

- `src/storage/*` — thin localStorage modules with load-time validation
  (`favorites`, `journal`, `customLibrary`, `settings`).
- Hooks (ported): `useFavorites` (`favorite_truth_ids`), `useJournal`
  (`journal_entries`, add/update/delete, newest-first), `useCustomLibrary`
  (`custom_library_content`), `useSettings` (`personalize`/`name`/`gender`),
  `useShareTruth`.
- **Sharing:** prefer `navigator.share`; fall back to copying a link to clipboard;
  toast feedback. Share text = `"{statement}" - {reference}\n{truthUrl}` where
  `truthUrl(id) = https://whatgodsaysabout.me/t/{id}`.

## Routes

- `/` **Today** — date, personalized greeting, `TruthCard` (save + share),
  reflection question, journal-prompt panel ("Write a reflection"), dark "What lie
  are you believing?" card opening the struggle flow. Daily truth is deterministic
  by date. Gear icon opens the personalization panel.
- `/library` — Truths/Lies filter (lies rendered as truth-style cards via
  `truthFromStruggle`), category filter, custom items merged in, "+" to add a
  custom promise (validated), save/share per card.
- `/journal` — entries newest-first; add, edit (prefilled), delete (with confirm);
  compose modal. Accepts an initial compose prompt from Today/struggle flows.
- `/favorites` — saved truths + saved struggle-truths; resolves custom + `lie-`
  ids; guiding empty state.
- `/t/[id]` — shareable truth page; resolves `lie-` ids; copy-link / share;
  "Return to Today"; not-found fallback.
- `/about` — devotional copy + contact form posting to existing `/api/contact`.
- `/privacy` — kept as-is.
- Legacy redirect: numeric `/[slug]` → `/t/identity-{n}` (server redirect).

## Components (web ports of Expo components)

`AppShell` (gradient + bottom tabs + scroll container), `BottomTabs`, `TruthCard`,
`StruggleSheet` (bottom-sheet picker), `StruggleResponse` (lie → "but God says" →
truth → Scripture verses → reflection → prayer → save / journal this / share),
`JournalCompose` (modal), `ShareTruthCard` (share sheet with preview card + copy +
share), `CustomPromiseCompose` (truth/struggle form with required-field
validation), `SaveHeartButton`, `ActionPill`, `Toast`, `TruthLibraryFilters`,
`PersonalizationPanel` (gear sheet, name + gender only).

The struggle flow, journal compose, share card, and personalization panel render
as overlays/modals layered on the screens, mirroring the Expo composition.

## Error Handling

- Remote content: any fetch/parse/validation failure silently falls back to
  bundled content; the app never blocks on the network.
- Storage reads: malformed JSON or wrong-shape values are filtered/ignored and
  treated as empty, never throwing.
- `/t/[id]` and the legacy redirect handle unknown ids with a graceful
  not-found / return-to-Today path.

## Verification (before declaring done)

- `tsc --noEmit` (typecheck) — clean.
- `next lint` — clean.
- `next build` — succeeds.
- Manual mobile-viewport check of each route.
- Confirm `content.bundled.json` loads and renders.
- Confirm remote-content fallback behavior (bad/missing `NEXT_PUBLIC_CONTENT_URL`
  still works).
- Confirm journal entries, favorites, custom content, and personalization persist
  across a reload.
