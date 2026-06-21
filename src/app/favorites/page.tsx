"use client";

import { useState } from "react";

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
import { useContent } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import type { Truth } from "@/data/verseUtils";
import { useCustomLibrary } from "@/hooks/useCustomLibrary";
import { useFavorites } from "@/hooks/useFavorites";
import { useShareTruth } from "@/hooks/useShareTruth";

export default function FavoritesScreen() {
  const favorites = useFavorites();
  const content = useContent();
  const custom = useCustomLibrary();
  const share = useShareTruth();
  const [customToast, setCustomToast] = useState("");
  const [editing, setEditing] = useState<ComposeEditing | null>(null);

  const resolveSavedTruth = (id: string): Truth | undefined => {
    if (id.startsWith("lie-")) {
      const struggleId = id.slice(4);
      const customStruggle = custom.struggles.find((s) => s.id === struggleId);
      if (customStruggle) return truthFromStruggle(customStruggle);
      return getShareableTruthById(id, content);
    }
    const customTruth = custom.truths.find((t) => t.id === id);
    if (customTruth) return customTruth;
    return getShareableTruthById(id, content);
  };

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

  const deleteCustom = (entry: ComposeEditing) => {
    const cardId =
      entry.kind === "struggle" ? `lie-${entry.value.id}` : entry.value.id;
    if (entry.kind === "struggle") {
      custom.removeStruggle(entry.value.id);
    } else {
      custom.removeTruth(entry.value.id);
    }
    if (favorites.isSaved(cardId)) favorites.toggleSaved(cardId);
    setEditing(null);
    flashCustomToast("Deleted");
  };

  const savedTruths = favorites.savedIds
    .map(resolveSavedTruth)
    .filter((truth): truth is Truth => truth !== undefined);

  const shareTruth = share.shareTruthId
    ? resolveSavedTruth(share.shareTruthId)
    : undefined;

  return (
    <>
      <AppShell activeTab="favorites">
        <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
          Favorites
        </p>
        <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
          Saved truths
        </h1>

        <div className="mt-[26px] flex flex-col gap-3.5">
          {savedTruths.length > 0 ? (
            savedTruths.map((truth) => (
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
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <SaveHeartButton
                    saved
                    onClick={() => favorites.toggleSaved(truth.id)}
                  />
                  {isCustom(truth.id) ? (
                    <ActionPill
                      label="Edit"
                      variant="tint"
                      onClick={() => openEdit(truth.id)}
                    />
                  ) : (
                    <ActionPill
                      label="Share"
                      variant="tint"
                      onClick={() => share.openShareTruth(truth.id)}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-borderSoft bg-surface p-7 text-center">
              <p className="font-serif text-2xl leading-[31px] text-scriptureInk">
                Saved truths will appear here.
              </p>
              <p className="mt-2.5 text-[15px] leading-[23px] text-softInk">
                Tap Save on any truth you want to return to.
              </p>
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
        visible={editing !== null}
        editing={editing ?? undefined}
        onCancel={() => setEditing(null)}
        onSaveTruth={() => setEditing(null)}
        onSaveStruggle={() => setEditing(null)}
        onUpdateTruth={(id, truth) => {
          custom.updateTruth(id, truth);
          setEditing(null);
        }}
        onUpdateStruggle={(id, struggle) => {
          custom.updateStruggle(id, struggle);
          setEditing(null);
        }}
        onDelete={deleteCustom}
      />
    </>
  );
}
