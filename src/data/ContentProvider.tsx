"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { bundledContent } from "@/data/content";
import type { ContentPayload, Struggle, Truth } from "@/data/verseUtils";
import { loadInitialContent, refreshRemoteContent } from "@/lib/remoteContent";

type RefreshValue = { refreshing: boolean; refresh: () => Promise<void> };

const ContentContext = createContext<ContentPayload>(bundledContent);
const RefreshContext = createContext<RefreshValue>({
  refreshing: false,
  refresh: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentPayload>(bundledContent);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const payload = await loadInitialContent();
      if (!cancelled) setContent(payload);
      await refreshRemoteContent();
      const next = await loadInitialContent();
      if (!cancelled) setContent(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshRemoteContent({ force: true });
      const payload = await loadInitialContent();
      setContent(payload);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ContentContext.Provider value={content}>
      <RefreshContext.Provider value={{ refreshing, refresh }}>
        {children}
      </RefreshContext.Provider>
    </ContentContext.Provider>
  );
}

export function useContent(): ContentPayload {
  return useContext(ContentContext);
}

export function useVerses(): Truth[] {
  return useContent().truths;
}

export function useStruggles(): Struggle[] {
  return useContent().struggles;
}

export function useRefreshContent(): RefreshValue {
  return useContext(RefreshContext);
}
