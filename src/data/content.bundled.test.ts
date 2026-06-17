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
