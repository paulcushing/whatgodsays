"use client";

import type { TruthCategory } from "@/data/verseUtils";

type FilterGroup = "truths" | "lies";

export type LibraryFilter = {
  group: FilterGroup | null;
  category: TruthCategory | null;
};

const truthOptions: { label: string; category: TruthCategory | null }[] = [
  { label: "All truths", category: null },
  { label: "Purpose", category: "Purpose" },
  { label: "Identity", category: "Identity" },
  { label: "Fear", category: "Fear" },
  { label: "Anxiety", category: "Anxiety" },
  { label: "Rejection", category: "Rejection" },
  { label: "Shame", category: "Shame" },
  { label: "Failure", category: "Failure" },
  { label: "Loneliness", category: "Loneliness" },
];

const lieOptions: { label: string; category: TruthCategory | null }[] = [
  { label: "All struggles", category: null },
  { label: "Purpose", category: "Purpose" },
  { label: "Fear", category: "Fear" },
  { label: "Anxiety", category: "Anxiety" },
  { label: "Rejection", category: "Rejection" },
  { label: "Shame", category: "Shame" },
  { label: "Failure", category: "Failure" },
  { label: "Loneliness", category: "Loneliness" },
];

export function TruthLibraryFilters({
  filter,
  openMenu,
  onToggleMenu,
  onSelect,
}: {
  filter: LibraryFilter;
  openMenu: FilterGroup | null;
  onToggleMenu: (group: FilterGroup) => void;
  onSelect: (group: FilterGroup, category: TruthCategory | null) => void;
}) {
  const truthActive = filter.group === "truths";
  const lieActive = filter.group === "lies";

  return (
    <div className="mt-[22px]">
      <div className="flex gap-2.5">
        <FilterButton
          label={truthActive && filter.category ? filter.category : "Truths"}
          active={truthActive}
          onClick={() => onToggleMenu("truths")}
        />
        <FilterButton
          label={lieActive && filter.category ? filter.category : "Lies"}
          active={lieActive}
          onClick={() => onToggleMenu("lies")}
        />
      </div>
      {openMenu === "truths" ? (
        <Menu
          options={truthOptions}
          selected={truthActive ? filter.category : null}
          onSelect={(category) => onSelect("truths", category)}
        />
      ) : null}
      {openMenu === "lies" ? (
        <Menu
          options={lieOptions}
          selected={lieActive ? filter.category : null}
          onSelect={(category) => onSelect("lies", category)}
        />
      ) : null}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[46px] items-center rounded-full border px-[18px] text-sm font-bold focus-ring ${
        active
          ? "border-ink bg-ink text-page"
          : "border-border bg-surface text-softInk"
      }`}
    >
      {label}
    </button>
  );
}

function Menu({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; category: TruthCategory | null }[];
  selected: TruthCategory | null;
  onSelect: (category: TruthCategory | null) => void;
}) {
  return (
    <div className="mt-2.5 flex flex-col gap-0.5 rounded-lg border border-borderSoft bg-surface p-2 shadow-soft">
      {options.map((option) => {
        const active = selected === option.category;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.category)}
            className={`flex min-h-[44px] items-center rounded-sm px-3.5 text-left text-sm focus-ring ${
              active
                ? "bg-tint font-extrabold text-accentDeep"
                : "font-semibold text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
