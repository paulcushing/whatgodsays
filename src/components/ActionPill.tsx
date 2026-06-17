"use client";

type Variant = "light" | "dark" | "tint";

export function ActionPill({
  label,
  onClick,
  variant = "light",
  selected = false,
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: Variant;
  selected?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-full border px-[18px] text-sm font-bold transition active:opacity-70 focus-ring";
  const styles =
    variant === "dark"
      ? "border-ink bg-ink text-page"
      : variant === "tint" || selected
        ? "border-borderCool bg-tint text-accentDeep"
        : "border-border bg-surface text-softInk";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {label}
    </button>
  );
}
