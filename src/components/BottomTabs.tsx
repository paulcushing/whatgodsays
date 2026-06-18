"use client";

import Link from "next/link";

export type AppTab = "today" | "library" | "journal" | "favorites";

const tabs: { key: AppTab; label: string; href: string }[] = [
  { key: "today", label: "Today", href: "/" },
  { key: "library", label: "Library", href: "/library" },
  { key: "journal", label: "Journal", href: "/journal" },
  { key: "favorites", label: "Favorites", href: "/favorites" },
];

export function BottomTabs({ activeTab }: { activeTab: AppTab }) {
  return (
    <nav className="flex items-start justify-around border-t border-borderCool bg-[rgba(223,231,242,0.96)] px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex min-h-[44px] min-w-[68px] flex-col items-center gap-1.5"
          >
            <span
              className={`h-[5px] w-[5px] rounded-full ${
                active ? "bg-accentBright" : "bg-transparent"
              }`}
            />
            <span
              className={`text-xs ${
                active ? "font-bold text-ink" : "font-medium text-mutedInk"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
