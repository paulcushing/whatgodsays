import { type ReactNode } from "react";

import { BottomTabs, type AppTab } from "@/components/BottomTabs";

export function AppShell({
  activeTab,
  children,
}: {
  activeTab: AppTab;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate min-h-[100dvh] bg-page">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-page via-[#d8e2ee] to-[#aebed1]" />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[480px]">
        <main className="px-6 pt-7 pb-[132px]">{children}</main>
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[480px] bg-[rgba(223,231,242,0.98)]">
          <BottomTabs activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
