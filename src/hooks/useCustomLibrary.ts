"use client";

import { useCallback, useEffect, useState } from "react";

import type { Struggle, Truth } from "@/data/verseUtils";
import {
  defaultCustomLibraryContent,
  loadCustomLibraryContent,
  saveCustomLibraryContent,
  type CustomLibraryContent,
} from "@/storage/customLibrary";

type AddTruthInput = Omit<Truth, "id">;
type AddStruggleInput = Omit<Struggle, "id">;

export function useCustomLibrary() {
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<CustomLibraryContent>(
    defaultCustomLibraryContent,
  );

  useEffect(() => {
    setContent(loadCustomLibraryContent());
    setReady(true);
  }, []);

  const addTruth = useCallback((truth: AddTruthInput) => {
    const nextTruth: Truth = { ...truth, id: `custom-truth-${Date.now()}` };
    setContent((current) => {
      const next = { ...current, truths: [nextTruth, ...current.truths] };
      saveCustomLibraryContent(next);
      return next;
    });
    return nextTruth;
  }, []);

  const addStruggle = useCallback((struggle: AddStruggleInput) => {
    const nextStruggle: Struggle = {
      ...struggle,
      id: `custom-struggle-${Date.now()}`,
    };
    setContent((current) => {
      const next = {
        ...current,
        struggles: [nextStruggle, ...current.struggles],
      };
      saveCustomLibraryContent(next);
      return next;
    });
    return nextStruggle;
  }, []);

  return {
    ready,
    truths: content.truths,
    struggles: content.struggles,
    addTruth,
    addStruggle,
  };
}
