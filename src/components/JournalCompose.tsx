"use client";

import { useEffect, useState } from "react";

export function JournalCompose({
  visible,
  prompt,
  initialBody = "",
  onCancel,
  onSave,
}: {
  visible: boolean;
  prompt: string;
  initialBody?: string;
  onCancel: () => void;
  onSave: (body: string) => void;
}) {
  const [body, setBody] = useState(initialBody);

  useEffect(() => {
    if (visible) setBody(initialBody);
  }, [visible, initialBody]);

  if (!visible) return null;

  const canSave = body.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-page">
      <div className="flex w-full max-w-[480px] flex-col">
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-[max(env(safe-area-inset-top),48px)]">
          <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
            Reflection
          </p>
          <p className="mt-3 font-serif text-[28px] leading-[37px] text-scriptureInk">
            {prompt}
          </p>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            autoFocus
            placeholder="Write what you are noticing..."
            className="mt-6 min-h-[300px] w-full rounded-lg border border-borderSoft bg-surface p-[18px] font-serif text-[21px] leading-[30px] text-ink placeholder:text-mutedInk focus-ring"
          />
        </div>
        <div className="flex justify-end gap-3 bg-page px-6 pb-[max(env(safe-area-inset-bottom),20px)] pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-[48px] items-center rounded-full px-[18px] text-[15px] font-bold text-softInk focus-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(body)}
            className={`flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-extrabold focus-ring ${
              canSave ? "bg-ink text-page" : "bg-tint text-mutedInk"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
