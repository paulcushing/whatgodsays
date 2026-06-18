"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setDismissed(localStorage.getItem("hideInstallPrompt") === "true");
  }, []);

  const dismiss = () => {
    localStorage.setItem("hideInstallPrompt", "true");
    setDismissed(true);
  };

  if (!isIOS || isStandalone || dismissed) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install app"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40"
    >
      <div className="w-full max-w-[480px] rounded-t-xl border border-borderSoft bg-surface p-6 shadow-card">
        <h3 className="font-serif text-[22px] leading-7 text-scriptureInk">
          Install
        </h3>
        <p className="mt-2.5 text-[15px] leading-[23px] text-softInk">
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            &nbsp;⎋&nbsp;
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            &nbsp;➕&nbsp;
          </span>
          .
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={dismiss}
            className="flex min-h-[44px] items-center justify-center rounded-full bg-ink px-6 text-sm font-extrabold text-page focus-ring"
          >
            Continue in browser
          </button>
        </div>
      </div>
    </div>
  );
}
