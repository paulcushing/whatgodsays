"use client";

import { useCallback, useState } from "react";

import { getShareableTruthById } from "@/data/content";
import { useContent } from "@/data/ContentProvider";

export function truthUrl(id: string): string {
  return `https://whatgodsaysabout.me/t/${encodeURIComponent(id)}`;
}

export function useShareTruth() {
  const content = useContent();
  const [shareTruthId, setShareTruthId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const flash = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 1800);
  }, []);

  const copyTruthLink = useCallback(
    async (id: string) => {
      try {
        await navigator.clipboard.writeText(truthUrl(id));
        flash("Link copied");
      } catch {
        flash("Could not copy link");
      }
    },
    [flash],
  );

  const shareWithFriend = useCallback(
    async (id: string) => {
      const truth = getShareableTruthById(id, content);
      if (!truth) return;
      const text = `"${truth.statement}" - ${truth.reference}\n${truthUrl(id)}`;
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: "What God Says About Me",
            text,
            url: truthUrl(id),
          });
          return;
        } catch {
          // user cancelled or share failed — fall back to copy
        }
      }
      await copyTruthLink(id);
    },
    [content, copyTruthLink],
  );

  return {
    shareTruthId,
    openShareTruth: setShareTruthId,
    closeShareTruth: () => setShareTruthId(null),
    copyTruthLink,
    shareWithFriend,
    toast,
  };
}
