"use client";

import { useCallback, useEffect, useState } from "react";

import {
  loadJournalEntries,
  saveJournalEntries,
  type JournalEntry,
} from "@/storage/journal";

type AddEntryInput = { prompt: string; body: string; sourceTruthId?: string };

export function useJournal() {
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(loadJournalEntries());
    setReady(true);
  }, []);

  const persist = useCallback((next: JournalEntry[]) => {
    setEntries(next);
    saveJournalEntries(next);
  }, []);

  const addEntry = useCallback(
    ({ prompt, body, sourceTruthId }: AddEntryInput) => {
      const cleanBody = body.trim();
      if (!cleanBody) return null;
      const entry: JournalEntry = {
        id: `journal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt,
        body: cleanBody,
        sourceTruthId,
      };
      setEntries((current) => {
        const next = [entry, ...current];
        saveJournalEntries(next);
        return next;
      });
      return entry;
    },
    [],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((current) => {
        const next = current.filter((entry) => entry.id !== id);
        saveJournalEntries(next);
        return next;
      });
    },
    [],
  );

  const updateEntry = useCallback((id: string, body: string) => {
    const cleanBody = body.trim();
    if (!cleanBody) return null;
    let updated: JournalEntry | null = null;
    setEntries((current) => {
      const next = current.map((entry) => {
        if (entry.id !== id) return entry;
        updated = { ...entry, body: cleanBody };
        return updated;
      });
      saveJournalEntries(next);
      return next;
    });
    return updated;
  }, []);

  return { ready, entries, addEntry, updateEntry, deleteEntry };
}
