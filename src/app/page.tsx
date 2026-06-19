"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { JournalCompose } from "@/components/JournalCompose";
import { PersonalizationPanel } from "@/components/PersonalizationPanel";
import { ShareTruthCard } from "@/components/ShareTruthCard";
import { StruggleResponse } from "@/components/StruggleResponse";
import { StruggleSheet } from "@/components/StruggleSheet";
import { Toast } from "@/components/Toast";
import { TruthCard } from "@/components/TruthCard";
import { useContent, useStruggles, useVerses } from "@/data/ContentProvider";
import { getShareableTruthById, truthFromStruggle } from "@/data/content";
import { formatToday, getDailyTruth, greetingForDate } from "@/data/dailyTruth";
import type { Struggle, Truth } from "@/data/verseUtils";
import { useFavorites } from "@/hooks/useFavorites";
import { useJournal } from "@/hooks/useJournal";
import { useSettings } from "@/hooks/useSettings";
import { useShareTruth } from "@/hooks/useShareTruth";

function personalizeTruth(truth: Truth, name: string, gender: "male" | "female") {
  const key = gender === "female" ? "feminine" : "masculine";
  const template = truth.personalized?.[key] ?? truth.statement;
  return template.replaceAll("{name}", name);
}

export default function TodayScreen() {
  const router = useRouter();
  const content = useContent();
  const truths = useVerses();
  const struggles = useStruggles();
  const favorites = useFavorites();
  const journal = useJournal();
  const { settings, reload: reloadSettings } = useSettings();
  const share = useShareTruth();

  const now = new Date();
  const today = getDailyTruth(now, truths);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedStruggle, setSelectedStruggle] = useState<Struggle | null>(null);
  const [compose, setCompose] = useState<{
    prompt: string;
    sourceTruthId?: string;
  } | null>(null);

  const name =
    settings?.personalize && settings.name.trim() ? settings.name.trim() : "";
  const greeting = name
    ? `${greetingForDate(now)}, ${name}.`
    : `${greetingForDate(now)}.`;
  const statement =
    name && settings
      ? personalizeTruth(today, name, settings.gender)
      : today.statement;

  const shareTruth = share.shareTruthId
    ? getShareableTruthById(share.shareTruthId, content)
    : undefined;

  const saveJournal = (body: string) => {
    if (!compose) return;
    journal.addEntry({
      prompt: compose.prompt,
      body,
      sourceTruthId: compose.sourceTruthId,
    });
    setCompose(null);
    router.push("/journal");
  };

  return (
    <>
      <AppShell activeTab="today">
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-accent">
              {formatToday(now)}
            </p>
            <h1 className="mt-1 font-serif text-[30px] leading-9 text-scriptureInk">
              {greeting}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] border border-borderSoft bg-surface text-xl text-softInk focus-ring"
          >
            {"⚙"}
          </button>
        </div>

        <div className="mt-[34px]">
          <TruthCard
            truth={today}
            statement={statement}
            saved={favorites.isSaved(today.id)}
            onToggleSaved={() => favorites.toggleSaved(today.id)}
            onShare={() => share.openShareTruth(today.id)}
          />
        </div>

        <p className="mt-[30px] text-[11px] font-extrabold uppercase tracking-[1.6px] text-accent">
          Reflect
        </p>
        <p className="mt-2.5 font-serif text-[23px] leading-8 text-scriptureInk">
          {today.reflectionQuestion}
        </p>

        <div className="mt-6 rounded-lg bg-tint p-5">
          <p className="text-xs font-extrabold uppercase tracking-[1.4px] text-accentDeep">
            Journal prompt
          </p>
          <p className="mt-2.5 font-serif text-[21px] leading-[29px] text-ink">
            {today.journalPrompt}
          </p>
          <button
            type="button"
            onClick={() =>
              setCompose({ prompt: today.journalPrompt, sourceTruthId: today.id })
            }
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-surface px-[18px] text-sm font-extrabold text-accentDeep focus-ring"
          >
            Write a reflection
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mt-6 block w-full rounded-xl bg-ink p-6 text-left shadow-card transition active:opacity-70 focus-ring"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[1.5px] text-[#bfe0d6]">
            When your heart is heavy
            <span aria-hidden="true" className="text-sm leading-none">
              {"→"}
            </span>
          </span>
          <span className="mt-3 block font-serif text-[28px] leading-9 text-page">
            What lie are you believing?
          </span>
          <span className="mt-2.5 block text-[15px] leading-[23px] text-[#d6eae3]">
            Name what you are carrying and sit with what God says.
          </span>
        </button>
      </AppShell>

      <PersonalizationPanel
        visible={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          reloadSettings();
        }}
      />

      <StruggleSheet
        visible={pickerOpen}
        struggles={struggles}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => {
          const next = struggles.find((struggle) => struggle.id === id);
          if (!next) return;
          setPickerOpen(false);
          setSelectedStruggle(next);
        }}
      />

      {selectedStruggle ? (
        <StruggleResponse
          struggle={selectedStruggle}
          saved={favorites.isSaved(`lie-${selectedStruggle.id}`)}
          onBack={() => {
            setSelectedStruggle(null);
            setPickerOpen(true);
          }}
          onClose={() => setSelectedStruggle(null)}
          onToggleSaved={() =>
            favorites.toggleSaved(`lie-${selectedStruggle.id}`)
          }
          onJournal={() =>
            setCompose({
              prompt: selectedStruggle.reflection,
              sourceTruthId: `lie-${selectedStruggle.id}`,
            })
          }
          onShare={() =>
            share.openShareTruth(truthFromStruggle(selectedStruggle).id)
          }
        />
      ) : null}

      <JournalCompose
        visible={compose !== null}
        prompt={compose?.prompt ?? ""}
        onCancel={() => setCompose(null)}
        onSave={saveJournal}
      />

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
      <Toast message={share.toast} />
    </>
  );
}
