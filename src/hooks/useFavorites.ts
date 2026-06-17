"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { loadFavoriteIds, saveFavoriteIds } from "@/storage/favorites";

export function useFavorites() {
  const [ready, setReady] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(loadFavoriteIds());
    setReady(true);
  }, []);

  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  const isSaved = useCallback((id: string) => savedSet.has(id), [savedSet]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [id, ...current];
      saveFavoriteIds(next);
      return next;
    });
  }, []);

  return { ready, savedIds, isSaved, toggleSaved };
}
