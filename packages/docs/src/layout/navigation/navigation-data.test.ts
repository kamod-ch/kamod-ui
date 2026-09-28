import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { blockCategories } from "../../blocks/block-categories";
import { docsPages } from "../../docs/registry";
import { filterNavigation, isNavigationCurrent, navigationGroups } from "./navigation-data";

describe("site navigation", () => {
  it("exposes every visible docs page with its original label and group", () => {
    for (const doc of docsPages) {
      const group = navigationGroups.find(
        (entry) =>
          entry.id === (doc.navGroup === "motion" ? "components" : (doc.navGroup ?? "components")),
      );
      expect(group?.links).toContainEqual(
        expect.objectContaining({
          label: doc.navLabel ?? doc.title,
          href: `/docs/${doc.slug}/installation`,
        }),
      );
    }
    expect(
      navigationGroups.filter((group) => group.kind !== "blocks").flatMap((group) => group.links),
    ).toHaveLength(docsPages.length);
  });

  it("includes every registered block exactly once and no placeholder routes", () => {
    const links = navigationGroups
      .filter((group) => group.kind === "blocks")
      .flatMap((group) => group.links);
    const expected = Object.entries(blockCategories).flatMap(([category, { blocks }]) =>
      blocks.map((block) => `/blocks/${category}/${block.id}`),
    );
    expect(links.map((link) => link.href).sort()).toEqual(expected.sort());
    expect(new Set(links.map((link) => link.href)).size).toBe(links.length);
  });

  it("links only to existing generated routes", () => {
    for (const group of navigationGroups) {
      for (const link of [group.overview, ...group.links]) {
        const route = resolve(import.meta.dirname, "../../..", link.href.slice(1));
        expect(existsSync(`${route}.md`) || existsSync(`${route}/index.md`), link.href).toBe(true);
      }
    }
  });

  it("searches across sections, slug names and block descriptions", () => {
    expect(
      filterNavigation(navigationGroups, "  SiDeBaR-05 ")
        .flatMap((group) => group.links)
        .map((link) => link.label),
    ).toEqual(["Sidebar 5"]);
    expect(
      filterNavigation(navigationGroups, "forms").some((group) =>
        group.links.some((link) => link.label === "Formisch"),
      ),
    ).toBe(true);
    expect(filterNavigation(navigationGroups, "not-a-real-page")).toEqual([]);
    expect(filterNavigation(navigationGroups, "   ")).toBe(navigationGroups);
  });

  it("identifies exact pages and docs section routes with a deployment prefix", () => {
    expect(
      isNavigationCurrent("/kamod-ui/docs/button/usage/", "/kamod-ui/docs/button/installation"),
    ).toBe(true);
    expect(isNavigationCurrent("/docs/button-group/usage", "/docs/button/installation")).toBe(
      false,
    );
    expect(isNavigationCurrent("/blocks/sidebar/sidebar-05/", "/blocks/sidebar/sidebar-05")).toBe(
      true,
    );
    expect(isNavigationCurrent("/blocks/sidebar/sidebar-05", "/blocks/sidebar")).toBe(false);
  });
});
