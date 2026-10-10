import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseGuide } from "../../blocks/guides/guide-markdown";
import { createComponentThemingSections } from "./component-theming";

const source = readFileSync(
  resolve(import.meta.dirname, "../../../.preactpress/content/theming-foundations.md"),
  "utf8",
);

describe("component theming guide", () => {
  it("offers manager alternatives for the theme installation dependencies", () => {
    const installation = createComponentThemingSections(source).find(
      ({ id }) => id === "installation",
    );
    expect(installation?.parts).toContainEqual({
      kind: "dependencies",
      dependencies: ["@kamod-ch/ui", "@kamod-ch/themes", "@preact/signals"],
    });
  });

  it("preserves existing section routes and gives every contents entry a unique target", () => {
    const sections = createComponentThemingSections(source);
    expect(sections.map(({ id }) => id)).toEqual([
      "installation",
      "usage",
      "css-setup",
      "token-overrides",
      "provider-controls",
      "tailwind-preset",
      "api-reference",
      "accessibility",
    ]);
    const ids = sections.flatMap(({ id, children }) => [
      id,
      ...(children ?? []).map((child) => child.id),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of sections) {
      for (const child of section.children ?? []) {
        expect(section.parts).toContainEqual({ kind: "heading", id: child.id, title: child.label });
      }
    }
  });

  it("includes the canonical foundation sections and links to the Theme Toggle reference", () => {
    const sections = createComponentThemingSections(source);
    const shared = parseGuide(source);
    for (const [target, original] of [
      ["css-setup", "set-up-tailwind-and-theme-css"],
      ["token-overrides", "shape-your-design-with-tokens"],
      ["provider-controls", "manage-appearance-preferences"],
      ["accessibility", "troubleshoot-and-verify"],
    ]) {
      expect(sections.find((section) => section.id === target)?.parts).toEqual(
        shared.find((section) => section.id === original)?.parts,
      );
    }
    const appearance = sections.find((section) => section.id === "provider-controls")!;
    expect(
      appearance.parts.some(
        (part) => part.kind === "html" && part.html.includes("/docs/theme-toggle/installation"),
      ),
    ).toBe(true);
  });
  it("keeps block deep links valid and points shared setup back to the canonical reference", () => {
    const blockSource = readFileSync(
      resolve(import.meta.dirname, "../../../blocks/theming.md"),
      "utf8",
    );
    const blockSections = parseGuide(blockSource);
    const blockIds = blockSections.flatMap(({ id, children }) => [
      id,
      ...(children ?? []).map(({ id }) => id),
    ]);
    const canonicalIds = createComponentThemingSections(source).flatMap(({ id, children }) => [
      id,
      ...(children ?? []).map(({ id }) => id),
    ]);
    for (const section of parseGuide(source)) {
      expect(blockIds).toContain(section.id);
      for (const child of section.children ?? []) expect(blockIds).toContain(child.id);
    }
    for (const [, route, fragment] of blockSource.matchAll(
      /\]\(\/docs\/theming\/([^#)]+)(?:#([^)]*))?\)/g,
    )) {
      expect(canonicalIds).toContain(route);
      if (fragment) expect(canonicalIds).toContain(fragment);
    }
    expect(blockSource).not.toContain("getThemeInitScript({");
    expect(blockSource).toContain("/docs/theming/installation");
  });
});
