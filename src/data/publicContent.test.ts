import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { isContentPayload } from "@/lib/remoteContent";
import bundled from "./content.bundled.json";

describe("public/content.json", () => {
  it("matches the bundled authoritative content", async () => {
    const publicPath = path.join(process.cwd(), "public", "content.json");
    const publicContent = JSON.parse(await readFile(publicPath, "utf8"));

    expect(isContentPayload(publicContent)).toBe(true);
    expect(publicContent).toEqual(bundled);
  });
});
