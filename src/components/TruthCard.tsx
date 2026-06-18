import { ActionPill } from "@/components/ActionPill";
import { SaveHeartButton } from "@/components/SaveHeartButton";
import type { Truth } from "@/data/verseUtils";

export function TruthCard({
  eyebrow = "Today's truth",
  truth,
  statement,
  saved,
  onToggleSaved,
  onShare,
}: {
  eyebrow?: string;
  truth: Truth;
  statement?: string;
  saved: boolean;
  onToggleSaved: () => void;
  onShare: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-borderSoft bg-surface px-[30px] pb-7 pt-14 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[132px] bg-gradient-to-b from-[rgba(126,148,173,0.35)] via-[rgba(230,236,243,0.8)] to-transparent"
      />
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
        {eyebrow}
      </p>
      <p className="font-serif text-[31px] leading-[41px] text-scriptureInk">
        {statement ?? truth.statement}
      </p>
      <div className="mt-6 flex items-center gap-2.5">
        <span className="h-px w-6 bg-[#cdb89e]" />
        <span className="font-serif italic text-base text-accentDeep">
          {truth.reference}
        </span>
      </div>
      <p className="mt-5 text-base leading-[25px] text-softInk">{truth.verse}</p>
      <div className="mt-[26px] flex flex-wrap gap-2.5">
        <SaveHeartButton saved={saved} onClick={onToggleSaved} />
        <ActionPill label="Share" variant="tint" onClick={onShare} />
      </div>
    </div>
  );
}
