"use client";

import type { Struggle } from "@/data/verseUtils";

export function StruggleSheet({
  visible,
  struggles,
  onClose,
  onSelect,
}: {
  visible: boolean;
  struggles: Struggle[];
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,48,46,0.26)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[30px] bg-page px-6 pb-6 pt-3 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-[18px] h-1 w-[46px] rounded-full bg-border" />
        <div className="flex items-start justify-between gap-[18px]">
          <h2 className="flex-1 font-serif text-2xl leading-[31px] text-scriptureInk">
            What are you feeling right now?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] items-center text-[13px] font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          {struggles.map((struggle) => (
            <button
              key={struggle.id}
              type="button"
              onClick={() => onSelect(struggle.id)}
              className="flex min-h-[50px] items-center rounded-md border border-borderSoft bg-surface px-[18px] text-left text-base font-semibold text-ink transition active:opacity-70 focus-ring"
            >
              {struggle.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
