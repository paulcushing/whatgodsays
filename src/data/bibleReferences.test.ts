import { describe, expect, it } from "vitest";

import {
  bibleReferenceToYouVersionUrl,
  parseBibleReferenceLinks,
} from "./bibleReferences";

describe("bibleReferenceToYouVersionUrl", () => {
  it("builds a YouVersion link for a full book reference", () => {
    expect(bibleReferenceToYouVersionUrl("John 1:2")).toBe(
      "https://www.bible.com/bible/3034/JHN.1.2.BSB",
    );
  });

  it("supports numbered books and verse ranges", () => {
    expect(bibleReferenceToYouVersionUrl("1 Peter 1:18-19")).toBe(
      "https://www.bible.com/bible/3034/1PE.1.18-19.BSB",
    );
  });

  it("supports common abbreviations used by custom content", () => {
    expect(bibleReferenceToYouVersionUrl("Deut 31:6")).toBe(
      "https://www.bible.com/bible/3034/DEU.31.6.BSB",
    );
  });

  it("returns null for text that is not a verse reference", () => {
    expect(bibleReferenceToYouVersionUrl("Scripture")).toBeNull();
  });
});

describe("parseBibleReferenceLinks", () => {
  it("links comma-separated references independently", () => {
    expect(parseBibleReferenceLinks("Ephesians 1:7, Hebrews 9:14")).toEqual([
      {
        text: "Ephesians 1:7",
        href: "https://www.bible.com/bible/3034/EPH.1.7.BSB",
      },
      { text: ", " },
      {
        text: "Hebrews 9:14",
        href: "https://www.bible.com/bible/3034/HEB.9.14.BSB",
      },
    ]);
  });

  it("links same-book same-chapter continuations", () => {
    expect(parseBibleReferenceLinks("Romans 6:2 & 11")).toEqual([
      {
        text: "Romans 6:2",
        href: "https://www.bible.com/bible/3034/ROM.6.2.BSB",
      },
      { text: " & " },
      {
        text: "11",
        href: "https://www.bible.com/bible/3034/ROM.6.11.BSB",
      },
    ]);
  });
});
