# Claude Instructions

## Content Sync Rule

`src/data/content.bundled.json` is the authoritative content source for this repo.
`public/content.json` is the public static copy served at `/content.json` for the
mobile apps.

When changing verse content, categories, struggles, prompts, prayers, or the
content `version`:

1. Edit `src/data/content.bundled.json` first.
2. Copy it to `public/content.json`.
3. Run `npm test -- src/data/publicContent.test.ts`.
4. Do not finish the task if the public content test fails.

Use this copy command from the repo root:

```bash
cp src/data/content.bundled.json public/content.json
```

Do not edit `public/content.json` as the primary source. If a requested change is
made there first, mirror it back into `src/data/content.bundled.json` before
finishing and run the public content test.
