"use client";

import { useMemo, useState } from "react";

import { ActionPill } from "@/components/ActionPill";
import { AppShell } from "@/components/AppShell";
import { CustomPromiseCompose } from "@/components/CustomPromiseCompose";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import {
  TruthLibraryFilters,
  type LibraryFilter,
} from "@/components/TruthLibraryFilters";
import { useContent, useStruggles, useVerses } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import type { Truth } from "@/data/verseUtils";
import { useCustomLibrary } from "@/hooks/useCustomLibrary";
import { useFavorites } from "@/hooks/useFavorites";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function LibraryScreen() {
  const truths = useVerses();
  const struggles = useStruggles();
  const content = useContent();
  const custom = useCustomLibrary();
  const favorites = useFavorites();
  const share = useShareTruth();
  const [customToast, setCustomToast] = useState("");

  const [filter, setFilter] = useState<LibraryFilter>({
    group: "truths",
    category: null,
  });
  const [openMenu, setOpenMenu] = useState<"truths" | "lies" | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const truthCards = useMemo(
    () => [...custom.truths, ...truths],
    [custom.truths, truths],
  );
  const lieCards = useMemo(
    () =>
      [...custom.struggles, ...struggles].map((struggle) =>
        truthFromStruggle(struggle),
      ),
    [custom.struggles, struggles],
  );

  const filtered = useMemo(() => {
    const pool = filter.group === "lies" ? lieCards : truthCards;
    if (!filter.category) return pool;
    return pool.filter((truth) => truth.category === filter.category);
  }, [filter, lieCards, truthCards]);

  const shareTruth = share.shareTruthId
    ? getShareableTruthById(share.shareTruthId, content)
    : undefined;

  const isCustom = (id: string) =>
    id.startsWith("custom-truth-") || id.startsWith("lie-custom-struggle-");

  const flashCustomToast = (message: string) => {
    setCustomToast(message);
    setTimeout(() => setCustomToast(""), 1800);
  };

  const shareCustom = async (truth: Truth) => {
    const text = `"${truth.statement}" - ${truth.reference}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "What God Says About Me", text });
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flashCustomToast("Link copied");
    } catch {
      flashCustomToast("Could not copy link");
    }
  };

  return (
    <>
      <AppShell activeTab="library">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
              Truth library
            </p>
            <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
              Find the truth you need
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            aria-label="Add a custom promise"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-tint text-[26px] leading-none text-accentDeep focus-ring"
          >
            +
          </button>
        </div>

        <TruthLibraryFilters
          filter={filter}
          openMenu={openMenu}
          onToggleMenu={(group) =>
            setOpenMenu((current) => (current === group ? null : group))
          }
          onSelect={(group, category) => {
            setFilter({ group, category });
            setOpenMenu(null);
          }}
        />

        <div className="mt-[22px] flex flex-col gap-3.5">
          {filtered.length > 0 ? (
            filtered.map((truth) => (
              <div
                key={truth.id}
                className="rounded-lg border border-borderSoft bg-surface p-5 shadow-soft"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-[1.4px] text-accent">
                  {truth.category}
                </p>
                <p className="mt-2.5 font-serif text-[23px] leading-[31px] text-scriptureInk">
                  {truth.statement}
                </p>
                <p className="mt-3 font-serif italic text-[15px] text-accentDeep">
                  {truth.reference}
                </p>
                <div className="mt-3.5 flex gap-3">
                  <SaveHeartButton
                    saved={favorites.isSaved(truth.id)}
                    onClick={() => favorites.toggleSaved(truth.id)}
                  />
                  <ActionPill
                    label="Share"
                    onClick={() => {
                      if (isCustom(truth.id)) {
                        void shareCustom(truth);
                        return;
                      }
                      share.openShareTruth(truth.id);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center rounded-lg bg-surface p-[26px]">
              <p className="text-[15px] text-softInk">
                {filter.group === "lies"
                  ? "No struggles found for this filter."
                  : "No truths found for this filter."}
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilter({
                    group: filter.group === "lies" ? "lies" : "truths",
                    category: null,
                  })
                }
                className="mt-2 flex min-h-[44px] items-center font-extrabold text-accentDeep focus-ring"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </AppShell>

      <ShareTruthCard
        visible={share.shareTruthId !== null}
        truth={shareTruth}
        onClose={share.closeShareTruth}
        onCopy={() => {
          if (share.shareTruthId) void share.copyTruthLink(share.shareTruthId);
        }}
        onShare={() => {
          if (share.shareTruthId) void share.shareWithFriend(share.shareTruthId);
        }}
      />
      <Toast message={share.toast || customToast} />

      <CustomPromiseCompose
        visible={composeOpen}
        onCancel={() => setComposeOpen(false)}
        onSaveTruth={(truth) => {
          custom.addTruth(truth);
          setComposeOpen(false);
          setFilter({ group: "truths", category: truth.category });
        }}
        onSaveStruggle={(struggle) => {
          custom.addStruggle(struggle);
          setComposeOpen(false);
          setFilter({ group: "lies", category: struggle.category });
        }}
      />
    </>
  );
}
