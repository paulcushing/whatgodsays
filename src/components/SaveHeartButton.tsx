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
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition active:opacity-70 focus-ring ${
        saved
          ? "border-borderCool bg-tint text-accentDeep"
          : "border-border bg-surface text-softInk"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7.5-4.6-10-9.5C.6 8.4 2 5 5.2 5c2 0 3.4 1.1 4.3 2.4l.5.8.5-.8C11.4 6.1 12.8 5 14.8 5 18 5 19.4 8.4 22 11.5 19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
