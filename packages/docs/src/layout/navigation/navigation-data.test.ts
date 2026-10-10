import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { blockCategories } from "../../blocks/block-categories";
import { PLACEHOLDER_BLOCK_CATEGORIES } from "../../blocks/block-nav-config";
import { docsAddedComponentSlugs, docsUpdatedComponentSlugs } from "../../docs/component-status";
import { getComponentExamples } from "../../docs/components/component-detail/component-examples";
import { getDocSections } from "../../docs/doc-sections";
import { docsPages } from "../../docs/registry";
import { isNavigationCurrent, navigationGroups } from "./navigation-data";

describe("site navigation", () => {
  it("keeps generated component variant counts aligned with the visible examples", () => {
    const components = navigationGroups.find((group) => group.id === "components")!;
    for (const link of components.links) {
      const doc = docsPages.find((page) => link.href === `/docs/${page.slug}/installation`)!;
      expect(link.variantCount, doc.slug).toBe(
        getComponentExamples(doc, getDocSections(doc)).length,
      );
    }
  });
  it("exposes every visible docs page with its original label and group", () => {
    for (const doc of docsPages) {
      const group = navigationGroups.find(
        (entry) =>
          entry.id === (doc.navGroup === "motion" ? "components" : (doc.navGroup ?? "components")),
      );
      expect([...(group?.guides ?? []), ...(group?.links ?? [])]).toContainEqual(
        expect.objectContaining({
          label: doc.navLabel ?? doc.title,
          href: `/docs/${doc.slug}/installation`,
        }),
      );
    }
    expect(
      navigationGroups
        .filter((group) => group.kind !== "blocks")
        .flatMap((group) => [...(group.guides ?? []), ...group.links])
        .filter(({ href }) => href.startsWith("/docs/")),
    ).toHaveLength(docsPages.length);
  });

  it("promotes component foundations to the introductory links without duplicates", () => {
    const components = navigationGroups.find((group) => group.id === "components")!;
    expect(components.guides).toEqual([
      { label: "Theming", href: "/docs/theming/installation", icon: "theming" },
      { label: "Component Styles", href: "/blocks/styles", icon: "styles" },
      { label: "cn Utility", href: "/docs/cn/installation", icon: "utility" },
    ]);
    expect(components.links.some(({ href }) => href.includes("/docs/cn/"))).toBe(false);
    expect(isNavigationCurrent("/docs/cn/usage", components.guides![2].href)).toBe(true);
    const blocks = navigationGroups.find((group) => group.id === "blocks")!;
    expect(blocks.guides).toContainEqual(components.guides![1]);
    expect(components.links.some(({ href }) => href.includes("/docs/theming/"))).toBe(false);
    expect(isNavigationCurrent("/docs/theming/css-setup", components.guides![0].href)).toBe(true);
    expect(components.links.some(({ href }) => href === "/docs/theme-toggle/installation")).toBe(
      true,
    );
  });

  it("applies contribution metadata to regular component links", () => {
    const links = navigationGroups
      .filter((group) => group.kind !== "blocks")
      .flatMap((group) => group.links);
    for (const [status, slugs] of [
      ["updated", docsUpdatedComponentSlugs],
      ["added", docsAddedComponentSlugs],
    ] as const) {
      expect(
        links
          .filter((link) => link[status])
          .map((link) => link.href)
          .sort(),
      ).toEqual([...slugs].map((slug) => `/docs/${slug}/installation`).sort());
      for (const slug of slugs) {
        expect(
          docsPages.some((doc) => doc.slug === slug),
          slug,
        ).toBe(true);
      }
    }
    expect([...docsAddedComponentSlugs]).toEqual(["code"]);
    expect([...docsAddedComponentSlugs].some((slug) => docsUpdatedComponentSlugs.has(slug))).toBe(
      false,
    );
  });

  it("preserves upstream badges and adds only significant contributor changes", () => {
    const components = navigationGroups.find((group) => group.id === "components")!;
    expect(components.links.filter((link) => link.updated).map((link) => link.href)).toEqual([
      "/docs/alert/installation",
      "/docs/dropdown/installation",
      "/docs/popover/installation",
      "/docs/spinner/installation",
      "/docs/switch/installation",
      "/docs/tabs/installation",
      "/docs/textarea/installation",
      "/docs/toggle/installation",
      "/docs/toggle-group/installation",
      "/docs/tooltip/installation",
      "/docs/tree/installation",
      "/docs/type-definition/installation",
      "/docs/typography/installation",
    ]);
    // Keep the ten pre-contribution badges; do not mark unrelated local copy/style fixes.
    for (const slug of ["accordion", "button", "avatar", "theme-toggle"]) {
      expect(
        components.links.find((link) => link.href === `/docs/${slug}/installation`)?.updated,
      ).toBe(false);
    }
  });

  it("distinguishes the added shell collection from updated and planned collections", () => {
    const links = navigationGroups.find((group) => group.kind === "blocks")!.links;
    expect(links.filter((link) => link.added).map((link) => link.href)).toEqual([
      "/blocks/application-shell",
    ]);
    expect(links.filter((link) => link.updated).map((link) => link.href)).toEqual([
      "/blocks/sidebar",
    ]);
    // Documentation, source manifests, moved branding and heading copy are not API changes.
    for (const href of ["/blocks/login", "/blocks/signup"]) {
      const link = links.find((link) => link.href === href)!;
      expect([link.added, link.updated, link.planned].some(Boolean)).toBe(false);
    }
    for (const link of links) {
      expect(
        [link.added, link.updated, link.planned].filter(Boolean).length,
        link.href,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("includes every available and planned collection exactly once", () => {
    const links = navigationGroups
      .filter((group) => group.kind === "blocks")
      .flatMap((group) => group.links);
    const expected = [
      ...Object.keys(blockCategories),
      ...PLACEHOLDER_BLOCK_CATEGORIES.map(({ key }) => key),
    ].map((category) => `/blocks/${category}`);
    expect(
      links.filter((link) => link.planned).map(({ label, href }) => ({ label, href })),
    ).toEqual(
      PLACEHOLDER_BLOCK_CATEGORIES.map(({ key, label }) => ({ label, href: `/blocks/${key}` })),
    );
    expect(links.map((link) => link.href).sort()).toEqual(expected.sort());
    expect(new Set(links.map((link) => link.href)).size).toBe(links.length);
    for (const [category, { blocks }] of Object.entries(blockCategories)) {
      expect(links.find((link) => link.href === `/blocks/${category}`)?.variantCount).toBe(
        blocks.length,
      );
    }
    expect(links.filter((link) => link.planned).every((link) => link.variantCount === 0)).toBe(
      true,
    );
  });

  it("distinguishes available routes from explicitly planned destinations", () => {
    for (const group of navigationGroups) {
      for (const link of [group.overview, ...(group.guides ?? []), ...group.links]) {
        const route = resolve(import.meta.dirname, "../../..", link.href.slice(1));
        expect(existsSync(`${route}.md`) || existsSync(`${route}/index.md`), link.href).toBe(
          !link.planned,
        );
      }
    }
  });

  it("groups direct collection links under one Blocks entry", () => {
    expect(navigationGroups.map((group) => group.label)).toEqual([
      "Components",
      "Blocks",
      "Forms",
      "Packages",
    ]);
    const blocks = navigationGroups.find((group) => group.id === "blocks")!;
    expect(blocks.overview.href).toBe("/blocks");
    expect(blocks.links).toHaveLength(
      Object.keys(blockCategories).length + PLACEHOLDER_BLOCK_CATEGORIES.length,
    );
    expect(
      blocks.links.filter((link) => !link.planned).every((link) => link.matchDescendants),
    ).toBe(true);
  });

  it("keeps the three introductory guides separate from collection counts", () => {
    for (const group of navigationGroups) {
      for (const link of [group.overview, ...(group.guides ?? [])]) {
        expect([link.added, link.updated, link.planned].some(Boolean), link.href).toBe(false);
        expect(link.variantCount, link.href).toBeUndefined();
      }
    }
    const blocks = navigationGroups.find((group) => group.id === "blocks")!;
    expect(blocks.guides?.map(({ href }) => href)).toEqual([
      "/blocks/getting-started",
      "/blocks/styles",
      "/blocks/theming",
    ]);
    expect(
      blocks.guides?.every((guide) => !guide.planned && guide.variantCount === undefined),
    ).toBe(true);
    expect(isNavigationCurrent("/blocks/theming/", blocks.guides![2].href)).toBe(true);
    expect(isNavigationCurrent("/blocks/theming", blocks.overview.href)).toBe(false);
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
    expect(isNavigationCurrent("/blocks/sidebar/sidebar-05", "/blocks/sidebar", true)).toBe(true);
    expect(isNavigationCurrent("/blocks/sidebar-other", "/blocks/sidebar", true)).toBe(false);
    expect(
      isNavigationCurrent("/kamod-ui/blocks/sidebar/sidebar-05/", "/kamod-ui/blocks/sidebar", true),
    ).toBe(true);
  });
});
