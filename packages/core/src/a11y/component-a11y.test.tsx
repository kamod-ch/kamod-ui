import axe from "axe-core";
import { render } from "preact";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { listSubpaths, withoutBrowserGlobals } from "../ssr/load-subpaths";
import { fixtureFor } from "../ssr/subpath-fixtures";

const loaders = import.meta.glob("../components/*/index.ts");

/**
 * jsdom does not apply Tailwind, so contrast ratios are not meaningful here.
 * The Chromium Playwright audit still enforces color-contrast on rendered previews.
 */
const JSDOM_DISABLED_RULES = {
  "color-contrast": { enabled: false },
  "color-contrast-enhanced": { enabled: false },
} as const;

describe("core component accessibility", () => {
  describe.each(listSubpaths().filter((entry) => entry.source.includes("/components/")))(
    "$subpath",
    (entry) => {
      it("has no serious or critical axe violations in the closed fixture", async () => {
        const loader = loaders[entry.source];
        expect(loader, entry.source).toBeTypeOf("function");
        const mod = await withoutBrowserGlobals(() => loader!());
        const vnode = fixtureFor(entry.subpath, mod as Record<string, unknown>);
        expect(vnode).not.toBeNull();

        const container = document.createElement("div");
        document.body.append(container);
        try {
          act(() => {
            render(vnode, container);
          });
          const results = await axe.run(container, { rules: { ...JSDOM_DISABLED_RULES } });
          const blocking = results.violations.filter(
            (violation) => violation.impact === "critical" || violation.impact === "serious",
          );
          const details = blocking
            .map((violation) => {
              const targets = violation.nodes
                .map((node) => node.target.join(" "))
                .slice(0, 6)
                .join("; ");
              return `- [${violation.impact}] ${violation.id}: ${violation.help} targets: ${targets}`;
            })
            .join("\n");
          expect(blocking, details).toEqual([]);
        } finally {
          act(() => {
            render(null, container);
          });
          container.remove();
        }
      });
    },
  );
});
