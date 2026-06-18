import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TruthLibraryFilters } from "./TruthLibraryFilters";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(element);
  });

  return container;
}

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = null;
  container = null;
});

describe("TruthLibraryFilters", () => {
  it("uses one show menu for all categories", () => {
    const onToggleMenu = vi.fn();
    const onSelectAll = vi.fn();
    const onSelect = vi.fn();

    const view = render(
      React.createElement(TruthLibraryFilters, {
        filter: { group: null, category: null },
        open: false,
        onSelectAll,
        onToggleMenu,
        onSelect,
      }),
    );

    const topLevelButtons = view.querySelectorAll(":scope > div > div > button");
    expect(topLevelButtons).toHaveLength(1);
    expect(topLevelButtons[0]?.textContent).toBe("Show: All");

    act(() => {
      topLevelButtons[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onToggleMenu).toHaveBeenCalledOnce();
  });

  it("labels the selected category and selects categories across the full library", () => {
    const onSelect = vi.fn();

    const view = render(
      React.createElement(TruthLibraryFilters, {
        filter: { group: null, category: "Purpose" },
        open: true,
        onSelectAll: vi.fn(),
        onToggleMenu: vi.fn(),
        onSelect,
      }),
    );

    expect(view.querySelector("button")?.textContent).toBe("Show: Purpose");

    const identityOption = Array.from(view.querySelectorAll("button")).find(
      (button) => button.textContent === "Identity",
    );
    act(() => {
      identityOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSelect).toHaveBeenCalledWith("Identity");
  });
});
