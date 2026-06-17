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
