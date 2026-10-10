/** Explanatory excerpts and source links must continue to match the copied implementations. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { blockCategories } from "../block-categories";
import { getShowcaseCodeTarget } from "../ShowcaseCodeLink";
import { shellVariantGuides } from "./application-shell-variant-guides";
import { sidebarAboutContent } from "./sidebar-about-content";
import { sidebarAboutExamples } from "./sidebar-about-examples";

const blocksRoot = resolve(import.meta.dirname, "../../../../blocks");
const docsRoot = resolve(import.meta.dirname, "../../..");
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

describe("About section source references", () => {
  for (const [id, profile] of Object.entries(shellVariantGuides)) {
    it(`${id} documents its actual frame composition`, () => {
      const source = readFileSync(
        resolve(blocksRoot, `src/application-shell/${id}/${id}.tsx`),
        "utf8",
      );
      expect(source).toContain(`return <ShellFrame {...props} layout="${profile.layout}" />;`);
    });
  }
  for (const block of blockCategories.sidebar.blocks) {
    it(`${block.id} explains an actual source excerpt and links to included files`, () => {
      const example = sidebarAboutExamples[block.id];
      const source = readFileSync(
        resolve(blocksRoot, `src/sidebar/${block.id}/${block.id}.tsx`),
        "utf8",
      );
      expect(normalize(source)).toContain(normalize(example.code));
      const content = sidebarAboutContent[block.id];
      const html = render(
        <div>
          {content.summary}
          {content.value}
          {content.tradeoff}
          {content.composition}
          {content.interaction}
          {content.adaptation}
          {content.accessibility}
          {content.alternatives.map((entry) => entry.reason)}
        </div>,
      );
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (href.startsWith(`#${block.id}-code/`)) {
          expect(getShowcaseCodeTarget(block.id, block.files, href), href).toBeDefined();
        } else if (href.startsWith("/")) {
          const route = href.split("#")[0];
          expect(
            [`${route}.md`, `${route}/index.md`].some((path) =>
              existsSync(resolve(docsRoot, `.${path}`)),
            ),
            href,
          ).toBe(true);
        }
      }
    });
  }
  for (const category of ["login", "signup"] as const) {
    for (const block of blockCategories[category].blocks) {
      it(`${block.id} awaits the documented payload in its real handler`, () => {
        const source = readFileSync(
          resolve(blocksRoot, `src/${category}/${block.id}/${category}-form.tsx`),
          "utf8",
        );
        expect(source).toContain(
          block.id === "login-05" ? "await onSubmit?.({ email });" : "await onSubmit?.(values);",
        );
      });
    }
  }
});
