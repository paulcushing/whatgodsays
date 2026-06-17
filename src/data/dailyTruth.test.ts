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
