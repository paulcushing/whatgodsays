"use client";

import { ActionPill } from "@/components/ActionPill";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import type { Struggle } from "@/data/verseUtils";

export function StruggleResponse({
  struggle,
  saved,
  onBack,
  onClose,
  onToggleSaved,
  onJournal,
  onShare,
}: {
  struggle: Struggle;
  saved: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleSaved: () => void;
  onJournal: () => void;
  onShare: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-page">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex justify-between px-6 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>
        <div className="px-6 pb-11 pt-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            The lie
          </p>
          <p className="mt-2.5 font-serif text-[27px] leading-[35px] text-softInk line-through">
            {struggle.lie}
          </p>
          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-serif italic text-[17px] text-accentDeep">
              but God says
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="rounded-xl border border-borderSoft bg-surface p-[26px] shadow-card">
            <p className="font-serif text-[30px] leading-[40px] text-scriptureInk">
              {struggle.truth}
            </p>
          </div>
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Scripture
          </p>
          {struggle.verses.map((verse) => (
            <div key={verse.reference} className="mt-3.5">
              <p className="font-serif italic text-base text-accentDeep">
                {verse.reference}
              </p>
              <p className="mt-1.5 text-[15px] leading-6 text-softInk">
                {verse.verse}
              </p>
            </div>
          ))}
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Reflect
          </p>
          <p className="mt-2.5 font-serif text-[22px] leading-[30px] text-ink">
            {struggle.reflection}
          </p>
          <div className="mt-4 rounded-lg bg-tint px-5 pb-[22px]">
            <p className="pt-5 text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
              A prayer
            </p>
            <p className="mt-2.5 text-[15px] leading-6 text-softInk">
              {struggle.prayer}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <SaveHeartButton saved={saved} onClick={onToggleSaved} />
            <ActionPill label="Journal this" variant="tint" onClick={onJournal} />
            <ActionPill label="Share" variant="dark" onClick={onShare} />
          </div>
        </div>
      </div>
    </div>
  );
}
