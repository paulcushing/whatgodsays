"use client";

import { ActionPill } from "@/components/ActionPill";
import type { Truth } from "@/data/verseUtils";
import { truthUrl } from "@/hooks/useShareTruth";

export function ShareTruthCard({
  truth,
  visible,
  onClose,
  onCopy,
  onShare,
}: {
  truth?: Truth;
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  if (!truth || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,48,46,0.36)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[30px] bg-page px-6 pb-7 pt-3.5"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share card"
          className="ml-auto flex min-h-[44px] items-center text-sm font-bold text-softInk focus-ring"
        >
          Close
        </button>

        <div className="relative overflow-hidden rounded-xl border border-borderSoft bg-surface px-7 pb-7 pt-[92px] shadow-card">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[122px] bg-gradient-to-b from-[#d6eae3] via-[#e6f1ec] to-transparent"
          />
          <p className="text-center text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            {truth.category}
          </p>
          <p className="mt-4 text-center font-serif text-[29px] leading-[39px] text-scriptureInk">
            {truth.statement}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <span className="h-px w-[22px] bg-[#cdb89e]" />
            <span className="font-serif italic text-base text-accentDeep">
              {truth.reference}
            </span>
          </div>
          <p className="mt-4 text-center text-sm leading-[23px] text-softInk">
            {truth.verse}
          </p>
          <p className="mt-[22px] border-t border-borderSoft pt-3.5 text-center font-serif italic text-[13px] text-mutedInkAlt">
            whatgodsaysabout.me
          </p>
        </div>

        <p className="mt-[22px] text-center font-serif text-lg text-ink">
          Encourage a friend with this truth.
        </p>

        <div className="mt-4 flex min-h-[48px] items-center gap-3 rounded-sm border border-borderSoft bg-surface px-4">
          <span className="flex-1 truncate text-xs text-softInk">
            {truthUrl(truth.id)}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="text-[13px] font-bold text-accentDeep focus-ring"
          >
            Copy link
          </button>
        </div>

        <ActionPill
          label="Share with a friend"
          variant="dark"
          onClick={onShare}
          className="mt-3 w-full"
        />
      </div>
    </div>
  );
}
