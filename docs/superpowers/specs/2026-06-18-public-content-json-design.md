# Public Content JSON Design

**Date:** 2026-06-18
**Status:** Approved

## Goal

Expose the bundled verse content at a stable public URL so the iOS and Android apps can consume the web app's authoritative content list.

## Decision

Serve the content as a static file at `/content.json`.

This keeps the mobile contract simple, allows normal static hosting/CDN caching, and avoids runtime API code for data that already exists as a bundled JSON asset.

## Source Of Truth

`src/data/content.bundled.json` remains the authoritative source in the repo. `public/content.json` is the public copy served by Next.js static assets.

A Vitest regression test verifies `public/content.json` is byte-for-byte equivalent after JSON parsing to `src/data/content.bundled.json`, and also validates it with the existing `isContentPayload` guard. If the bundled content changes without updating the public file, tests fail.

## URL Contract

- Path: `/content.json`
- Shape: existing `ContentPayload`
- Required top-level fields: `version`, `truths`, `struggles`
- Compatibility: mobile apps should compare `version` and cache with their own network policy.

## Verification

- Add a failing test before creating the public file.
- Copy `src/data/content.bundled.json` to `public/content.json`.
- Run the focused Vitest file.
- Run the project test suite.
