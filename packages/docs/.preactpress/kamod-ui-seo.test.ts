import { describe, expect, it } from "vitest";
import {
  applySeoPageData,
  filterSitemap,
  isIndexablePage,
  kamodUiStructuredDataHead,
  routeFromSitemapLoc,
} from "./kamod-ui-seo";

const site = {
  url: "https://ui.kamod.ch",
  base: "/",
  title: "Kamod UI",
  description: "Preact UI components and blocks for Tailwind.",
};

function parseJsonLd(tag: ReturnType<typeof kamodUiStructuredDataHead>[number]): unknown {
  expect(tag[0]).toBe("script");
  return JSON.parse(tag[2] as string);
}

describe("kamodUiStructuredDataHead", () => {
  it("emits WebSite and SoftwareApplication on the home route", () => {
    const tags = kamodUiStructuredDataHead({
      route: "/",
      title: "Kamod UI — Preact UI components & blocks",
      description: site.description,
      site,
    });
    expect(tags).toHaveLength(2);
    const types = tags.map((tag) => (parseJsonLd(tag) as { "@type": string })["@type"]);
    expect(types).toEqual(["WebSite", "SoftwareApplication"]);
    const app = parseJsonLd(tags[1]) as { applicationSubCategory: string; sameAs: string[] };
    expect(app.applicationSubCategory).toContain("Preact UI");
    expect(app.sameAs).toContain("https://www.npmjs.com/package/@kamod-ch/ui");
  });

  it("emits SoftwareApplication, TechArticle and a breadcrumb on getting started", () => {
    const tags = kamodUiStructuredDataHead({
      route: "/docs/getting-started",
      title: "Getting Started with Kamod UI",
      description: "Preact UI setup guide.",
      site,
    });
    const types = tags.map((tag) => (parseJsonLd(tag) as { "@type": string })["@type"]);
    expect(types).toEqual(["SoftwareApplication", "TechArticle", "BreadcrumbList"]);
  });

  it("emits a breadcrumb for an indexable component page", () => {
    const tags = kamodUiStructuredDataHead({
      route: "/docs/button",
      title: "Button",
      description: "Button component.",
      site,
    });
    const crumb = parseJsonLd(tags.at(-1)!) as {
      "@type": string;
      itemListElement: Array<{ name: string; item: string }>;
    };
    expect(crumb["@type"]).toBe("BreadcrumbList");
    expect(crumb.itemListElement.at(-1)).toMatchObject({
      name: "Button",
      item: "https://ui.kamod.ch/docs/button",
    });
  });

  it("skips structured data on section aliases", () => {
    expect(
      kamodUiStructuredDataHead({
        route: "/docs/button/variants",
        title: "Button — Variants",
        description: "Variants",
        site,
      }),
    ).toEqual([]);
  });
});

describe("indexable routes", () => {
  it("keeps the component landing page and hides section and preview copies", () => {
    expect(
      isIndexablePage("/docs/button", { meta: { pageKind: "component-doc", slug: "button" } }),
    ).toBe(true);
    expect(
      isIndexablePage("/docs/button/variants", {
        meta: { pageKind: "component-doc", slug: "button" },
      }),
    ).toBe(false);
    expect(
      isIndexablePage("/blocks/marketing/hero-01/preview", {
        meta: { pageKind: "marketing-block-preview" },
      }),
    ).toBe(false);
    expect(isIndexablePage("/404", { meta: { pageKind: "not-found" } })).toBe(false);
  });

  it("adds a noindex robots tag without duplicating one", () => {
    const page = applySeoPageData(
      { title: "Preview", meta: { pageKind: "block-preview" } },
      "/blocks/sidebar/sidebar-01/preview",
    );
    expect(page.meta.head).toEqual([["meta", { name: "robots", content: "noindex, follow" }]]);
    expect(applySeoPageData(page, "/blocks/sidebar/sidebar-01/preview").meta.head).toHaveLength(1);
  });

  it("drops hidden routes from the sitemap and keeps the base prefix", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kamod-ch.github.io/kamod-ui/docs/button/</loc><lastmod>2026-11-17</lastmod></url>
  <url><loc>https://kamod-ch.github.io/kamod-ui/docs/button/variants/</loc><lastmod>2026-11-17</lastmod></url>
</urlset>
`;
    const hidden = new Set([
      routeFromSitemapLoc("https://kamod-ch.github.io/kamod-ui/docs/button/variants/", "/kamod-ui"),
    ]);
    const next = filterSitemap(xml, hidden, "/kamod-ui");
    expect(next).toContain("/docs/button/");
    expect(next).not.toContain("/docs/button/variants/");
  });
});
