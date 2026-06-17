import { describe, expect, it } from "vitest";

import {
  defaultCustomLibraryContent,
  loadCustomLibraryContent,
  saveCustomLibraryContent,
} from "./customLibrary";
import { loadFavoriteIds, saveFavoriteIds } from "./favorites";
import { loadJournalEntries, saveJournalEntries } from "./journal";
import { loadSettings, setGender, setName, setPersonalize } from "./settings";

describe("favorites storage", () => {
  it("round-trips ids and dedupes", () => {
    saveFavoriteIds(["a", "b", "a"]);
    expect(loadFavoriteIds().sort()).toEqual(["a", "b"]);
  });

  it("returns [] when empty", () => {
    expect(loadFavoriteIds()).toEqual([]);
  });
});

describe("journal storage", () => {
  it("round-trips entries and filters malformed ones", () => {
    localStorage.setItem(
      "journal_entries",
      JSON.stringify([
        { id: "1", createdAt: "t", prompt: "p", body: "b" },
        { id: 2, body: "bad" },
      ]),
    );
    const entries = loadJournalEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe("1");
  });

  it("saves entries", () => {
    saveJournalEntries([{ id: "x", createdAt: "t", prompt: "p", body: "b" }]);
    expect(loadJournalEntries()[0].id).toBe("x");
  });
});

describe("custom library storage", () => {
  it("defaults to empty", () => {
    expect(loadCustomLibraryContent()).toEqual(defaultCustomLibraryContent);
  });

  it("round-trips a valid truth and filters bad categories", () => {
    saveCustomLibraryContent({
      truths: [
        {
          id: "c1",
          category: "Identity",
          statement: "s",
          reference: "r",
          verse: "v",
          reflectionQuestion: "q",
          journalPrompt: "p",
        },
      ],
      struggles: [],
    });
    expect(loadCustomLibraryContent().truths).toHaveLength(1);

    localStorage.setItem(
      "custom_library_content",
      JSON.stringify({ truths: [{ id: "x", category: "Bogus" }], struggles: [] }),
    );
    expect(loadCustomLibraryContent().truths).toHaveLength(0);
  });
});

describe("settings storage", () => {
  it("defaults sensibly", () => {
    const s = loadSettings();
    expect(s.personalize).toBe(false);
    expect(s.name).toBe("");
    expect(s.gender).toBe("male");
  });

  it("persists individual fields", () => {
    setPersonalize(true);
    setName("Sam");
    setGender("female");
    const s = loadSettings();
    expect(s).toEqual({ personalize: true, name: "Sam", gender: "female" });
  });
});
