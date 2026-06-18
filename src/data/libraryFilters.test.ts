import { describe, expect, it } from "vitest";

import { filterLibraryCards, type LibraryFilter } from "./libraryFilters";
import type { Truth } from "./verseUtils";

const truthCards: Truth[] = [
  {
    id: "truth-purpose",
    category: "Purpose",
    statement: "You were made on purpose.",
    reference: "Ephesians 2:10",
    verse: "Created in Christ Jesus for good works.",
    reflectionQuestion: "What changes?",
    journalPrompt: "Write it down.",
  },
  {
    id: "truth-identity",
    category: "Identity",
    statement: "You are loved.",
    reference: "John 3:16",
    verse: "For God so loved...",
    reflectionQuestion: "What changes?",
    journalPrompt: "Write it down.",
  },
];

const lieCards: Truth[] = [
  {
    id: "lie-fear",
    category: "Fear",
    statement: "God is with you.",
    reference: "Deuteronomy 31:6",
    verse: "He will never leave you.",
    reflectionQuestion: "What changes?",
    journalPrompt: "Write it down.",
  },
  {
    id: "lie-purpose",
    category: "Purpose",
    statement: "Your life has meaning.",
    reference: "Ephesians 2:10",
    verse: "Created in Christ Jesus for good works.",
    reflectionQuestion: "What changes?",
    journalPrompt: "Write it down.",
  },
];

describe("filterLibraryCards", () => {
  it("shows every card with positive truths first when no group is selected", () => {
    const filter: LibraryFilter = { group: null, category: null };

    expect(filterLibraryCards(filter, truthCards, lieCards).map((card) => card.id)).toEqual([
      "truth-purpose",
      "truth-identity",
      "lie-fear",
      "lie-purpose",
    ]);
  });

  it("shows only positive truths for the truths group", () => {
    const filter: LibraryFilter = { group: "truths", category: null };

    expect(filterLibraryCards(filter, truthCards, lieCards).map((card) => card.id)).toEqual([
      "truth-purpose",
      "truth-identity",
    ]);
  });

  it("shows only lie-answering cards for the lies group", () => {
    const filter: LibraryFilter = { group: "lies", category: null };

    expect(filterLibraryCards(filter, truthCards, lieCards).map((card) => card.id)).toEqual([
      "lie-fear",
      "lie-purpose",
    ]);
  });

  it("applies category filters within the selected group", () => {
    const filter: LibraryFilter = { group: "lies", category: "Purpose" };

    expect(filterLibraryCards(filter, truthCards, lieCards).map((card) => card.id)).toEqual([
      "lie-purpose",
    ]);
  });

  it("applies category filters across all cards with positive truths first", () => {
    const filter: LibraryFilter = { group: null, category: "Purpose" };

    expect(filterLibraryCards(filter, truthCards, lieCards).map((card) => card.id)).toEqual([
      "truth-purpose",
      "lie-purpose",
    ]);
  });
});
