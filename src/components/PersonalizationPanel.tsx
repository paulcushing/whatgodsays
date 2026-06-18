"use client";

import { useSettings } from "@/hooks/useSettings";

export function PersonalizationPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { settings, setPersonalize, setName, setGender } = useSettings();

  if (!visible) return null;

  const personalize = settings?.personalize ?? false;
  const name = settings?.name ?? "";
  const gender = settings?.gender ?? "male";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(28,38,50,0.34)]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-xl bg-page p-6 pb-8 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
              Settings
            </p>
            <h2 className="mt-2 font-serif text-[31px] leading-[38px] text-scriptureInk">
              Personalize
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[42px] items-center rounded-full border border-border px-3.5 text-[13px] font-bold text-softInk focus-ring"
          >
            Close
          </button>
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={personalize}
            onChange={(event) => setPersonalize(event.target.checked)}
            className="h-5 w-5 accent-accentDeep"
          />
          <span className="text-base font-bold text-ink">
            Use my name and pronouns
          </span>
        </label>

        {personalize ? (
          <div className="mt-4 flex flex-col gap-1.5">
            <span className="text-sm font-bold text-ink">First name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoCapitalize="words"
              placeholder="First name"
              className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink focus-ring"
            />

            <span className="mt-2 text-sm font-bold text-ink">Gender</span>
            <select
              value={gender}
              onChange={(event) =>
                setGender(event.target.value === "female" ? "female" : "male")
              }
              className="rounded-sm border border-border bg-surface px-3 py-3 text-base text-ink focus-ring"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <p className="mt-1.5 text-[13px] text-softInk">
              (Your name will be inserted and pronouns will be adjusted.)
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
