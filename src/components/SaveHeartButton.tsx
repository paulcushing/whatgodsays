"use client";

export function SaveHeartButton({
  saved,
  onClick,
}: {
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Unsave" : "Save"}
      aria-pressed={saved}
      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl transition active:opacity-70 focus-ring ${
        saved
          ? "border-borderCool bg-tint text-accentDeep"
          : "border-border bg-surface text-softInk"
      }`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
