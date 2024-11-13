"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  let hidePrompt = typeof window !== "undefined" ? false : true;
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("hideInstallPrompt")
  ) {
    hidePrompt = true;
  }

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (!isIOS || isStandalone || hidePrompt) {
    return null;
  }

  return (
    <dialog id="install_modal" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Install</h3>
        {isIOS && (
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {" "}
              ⎋{" "}
            </span>
            and then "Add to Home Screen"
            <span role="img" aria-label="plus icon">
              {" "}
              ➕{" "}
            </span>
            .
          </p>
        )}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn"
              onClick={() => localStorage.setItem("hideInstallPrompt", "true")}
            >
              Continue in browser
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
