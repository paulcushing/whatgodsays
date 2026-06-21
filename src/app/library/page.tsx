"use client";

import { useMemo, useState } from "react";

import { ActionPill } from "@/components/ActionPill";
import { AppShell } from "@/components/AppShell";
import { BibleReferenceLink } from "@/components/BibleReferenceLink";
import {
  CustomPromiseCompose,
  type ComposeEditing,
} from "@/components/CustomPromiseCompose";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { Toast } from "@/components/Toast";
import { TruthLibraryFilters } from "@/components/TruthLibraryFilters";
import { useContent, useStruggles, useVerses } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import { filterLibraryCards, type LibraryFilter } from "@/data/libraryFilters";
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
    group: null,
    category: null,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editing, setEditing] = useState<ComposeEditing | null>(null);

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
    return filterLibraryCards(filter, truthCards, lieCards);
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

  const openEdit = (id: string) => {
    if (id.startsWith("lie-custom-struggle-")) {
      const struggle = custom.struggles.find((s) => `lie-${s.id}` === id);
      if (struggle) setEditing({ kind: "struggle", value: struggle });
      return;
    }
    const truth = custom.truths.find((t) => t.id === id);
    if (truth) setEditing({ kind: "truth", value: truth });
  };

  const closeEditor = () => {
    setComposeOpen(false);
    setEditing(null);
  };

  const deleteCustom = (entry: ComposeEditing) => {
    const cardId =
      entry.kind === "struggle" ? `lie-${entry.value.id}` : entry.value.id;
    if (entry.kind === "struggle") {
      custom.removeStruggle(entry.value.id);
    } else {
      custom.removeTruth(entry.value.id);
    }
    if (favorites.isSaved(cardId)) favorites.toggleSaved(cardId);
    closeEditor();
    flashCustomToast("Deleted");
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
          open={filterOpen}
          onSelectAll={() => {
            setFilter({ group: null, category: null });
            setFilterOpen(false);
          }}
          onToggleMenu={() => setFilterOpen((current) => !current)}
          onSelect={(category) => {
            setFilter({ group: null, category });
            setFilterOpen(false);
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
                  <BibleReferenceLink reference={truth.reference} className="focus-ring" />
                </p>
                <div className="mt-3.5 flex gap-3">
                  <SaveHeartButton
                    saved={favorites.isSaved(truth.id)}
                    onClick={() => favorites.toggleSaved(truth.id)}
                  />
                  {isCustom(truth.id) ? (
                    <ActionPill
                      label="Edit"
                      onClick={() => openEdit(truth.id)}
                    />
                  ) : (
                    <ActionPill
                      label="Share"
                      onClick={() => share.openShareTruth(truth.id)}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center rounded-lg bg-surface p-[26px]">
              <p className="text-[15px] text-softInk">
                No library entries found for this filter.
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilter({
                    group: null,
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
        key={editing ? editing.value.id : "new"}
        visible={composeOpen || editing !== null}
        editing={editing ?? undefined}
        onCancel={closeEditor}
        onSaveTruth={(truth) => {
          custom.addTruth(truth);
          closeEditor();
          setFilter({ group: null, category: truth.category });
        }}
        onSaveStruggle={(struggle) => {
          custom.addStruggle(struggle);
          closeEditor();
          setFilter({ group: null, category: struggle.category });
        }}
        onUpdateTruth={(id, truth) => {
          custom.updateTruth(id, truth);
          closeEditor();
        }}
        onUpdateStruggle={(id, struggle) => {
          custom.updateStruggle(id, struggle);
          closeEditor();
        }}
        onDelete={deleteCustom}
      />
    </>
  );
}
