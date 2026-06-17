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
