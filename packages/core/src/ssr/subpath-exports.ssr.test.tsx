import { describe, expect, it } from "vitest";
import { hydrateSubpath, listSubpaths, serverRenderSubpath } from "./load-subpaths";

const subpaths = listSubpaths();

describe("subpath export SSR and hydration", () => {
  it("loads every JavaScript subpath export", () => {
    expect(subpaths.map((entry) => entry.subpath)).toEqual(
      expect.arrayContaining(["button", "utils", "lib/utils", "lib/signals", "lib/interactive"]),
    );
    expect(subpaths.some((entry) => entry.source.endsWith(".css"))).toBe(false);
  });

  describe.each(subpaths)("$subpath", (entry) => {
    it("server-renders without window or document and hydrates in the DOM", async () => {
      const rendered = await serverRenderSubpath(entry);
      expect(rendered.html).toEqual(expect.any(String));

      if (rendered.vnode == null) return;

      const repeated = await serverRenderSubpath(entry);
      expect(repeated.html).toBe(rendered.html);

      const hydrationErrors = hydrateSubpath(rendered.vnode);
      expect(hydrationErrors, hydrationErrors.join("\n")).toEqual([]);
    });
  });
});
