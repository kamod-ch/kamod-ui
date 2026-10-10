import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { parseGuide } from "../blocks/guides/guide-markdown";
import { navigationGroups } from "../layout/navigation/navigation-data";
import { GettingStartedReference } from "./components/GettingStartedReference";
import { renderGettingStartedTable } from "./components/GettingStartedVerification";

const root = resolve(import.meta.dirname, "../..");
const source = readFileSync(resolve(root, "docs/getting-started.md"), "utf8");
const sections = parseGuide(source);
const ids = sections.flatMap(({ id, parts }) => [
  id,
  ...parts.flatMap((part) => (part.kind === "heading" ? [part.id] : [])),
]);

describe("Getting Started guide", () => {
  it("replaces Foundations and references every remaining introductory navigation destination", () => {
    expect(navigationGroups.map(({ id }) => id)).toEqual([
      "components",
      "blocks",
      "forms",
      "packages",
    ]);
    expect(existsSync(resolve(root, "docs/foundations/index.md"))).toBe(false);
    expect(source).not.toContain("/docs/foundations");
    const destinations = new Set(
      [...source.matchAll(/\]\((\/[^)\s]*)\)/g)].map((match) => match[1].split("#")[0]),
    );
    for (const group of navigationGroups) {
      for (const { href } of [group.overview, ...(group.guides ?? [])])
        expect(destinations, href).toContain(href);
    }
  });

  it("keeps verification destinations and row headers in a two-column table without changing other tables", () => {
    const enhanced = parseGuide(source, renderGettingStartedTable);
    const html = enhanced
      .flatMap(({ parts }) => parts)
      .filter((part) => part.kind === "html")
      .map((part) => part.html)
      .join("");
    expect(html.match(/class="getting-started-checks"/g)).toHaveLength(1);
    const checks = html.split('class="getting-started-checks"')[1].split("</table>")[0];
    expect(checks.match(/scope="col"/g)).toHaveLength(2);
    expect(checks.match(/scope="row"/g)).toHaveLength(6);
    expect(checks).toContain('href="/docs/packages#package-installation"');
    expect(checks).toContain('href="/docs/forms#form-review"');
    expect(checks).not.toContain("Continue Reading");
    expect(html).toContain('class="block-guide-table"');
    expect(JSON.stringify(parseGuide(source))).not.toContain("getting-started-checks");
  });

  it("provides an independent route with all four library chapters and nested contents", () => {
    expect(source).toContain("pageKind: getting-started-guide");
    expect(sections.map(({ id }) => id)).toEqual([
      "choose-your-starting-point",
      "set-up-your-app",
      "components",
      "blocks",
      "forms",
      "packages",
      "ship-a-complete-feature",
      "find-your-next-reference",
    ]);
    expect(sections.some(({ children }) => children?.some((child) => child.children?.length))).toBe(
      true,
    );
  });

  it("keeps internal route destinations and same-page fragments valid", () => {
    for (const [, href] of source.matchAll(/\]\((\/[^)\s]*|#[^)\s]*)\)/g)) {
      const [path, fragment] = href.split("#");
      if (path) {
        const route = resolve(root, path.slice(1));
        expect(existsSync(`${route}.md`) || existsSync(`${route}/index.md`), href).toBe(true);
      } else if (fragment) expect(ids, href).toContain(fragment);
    }
  });

  it("keeps complete TypeScript examples syntactically valid and highlighted", () => {
    for (const part of sections.flatMap(({ parts }) => parts)) {
      if (part.kind !== "code" || !part.filePath?.match(/\.tsx?$/)) continue;
      expect(["typescript", "tsx"]).toContain(part.language);
      const { diagnostics } = ts.transpileModule(part.code, {
        fileName: part.filePath,
        reportDiagnostics: true,
        compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ESNext },
      });
      expect(diagnostics, part.filePath).toEqual([]);
    }
  });

  it("sends shared references to existing contextual anchors without linking the guide to itself", () => {
    for (const scope of ["components", "blocks", "forms", "packages"] as const) {
      const markup = renderToString(<GettingStartedReference scope={scope} />);
      const fragment = markup.match(/getting-started#([^"]+)/)?.[1];
      expect(ids, scope).toContain(fragment);
    }
    for (const slug of [
      "icons-package",
      "hooks-package",
      "signals-package",
      "state-package",
      "i18n-package",
      "cn",
      "theming",
    ]) {
      const markup = renderToString(<GettingStartedReference scope="packages" slug={slug} />);
      expect(ids, slug).toContain(markup.match(/getting-started#([^"]+)/)?.[1]);
    }
    expect(renderToString(<GettingStartedReference scope="getting-started" />)).toBe("");
  });
});
