import type { HtmlPageView } from "@kamod-ch/preactpress/client";
import { excerptFromHtml } from "@kamod-ch/preactpress/shared";
import { describe, expect, it } from "vitest";
import { compactGuidePageData } from "../../.preactpress/guide-page-data";
import { compactPageMetadataModule } from "../../.preactpress/page-metadata-plugin";

const guide: HtmlPageView = {
  kind: "markdown",
  title: "Getting Started",
  description: "A working first screen.",
  meta: { pageKind: "getting-started-guide", sidebar: false },
  headings: [{ id: "setup", text: "Setup", level: 2 }],
  html: `<h2 id="setup">Setup</h2><p>Build a working screen with components and shared themes.</p>${"<p>More examples follow.</p>".repeat(200)}`,
};

describe("guide page payloads", () => {
  it("removes duplicate guide HTML while retaining search text and complete page metadata", () => {
    for (const pageKind of ["getting-started-guide", "blocks-guide"]) {
      const original = { ...guide, meta: { ...guide.meta, pageKind } };
      const compact = compactGuidePageData(original) as HtmlPageView;
      expect(excerptFromHtml(compact.html)).toBe(excerptFromHtml(original.html));
      expect(compact.meta).toBe(original.meta);
      expect(compact.headings).toBe(original.headings);
      expect(compact.title).toBe(original.title);
      expect(compact.description).toBe(original.description);
      expect(JSON.stringify(compact).length).toBeLessThan(JSON.stringify(original).length / 5);
      expect(original.html).toContain("More examples follow.");
    }
  });

  it("leaves ordinary Markdown, unknown page kinds and MDX unchanged", () => {
    const ordinary = { ...guide, meta: {} };
    const unknown = { ...guide, meta: { pageKind: "future-guide" } };
    const mdx = { ...guide, kind: "mdx" as const, Component: () => null };
    for (const page of [ordinary, unknown, mdx]) expect(compactGuidePageData(page)).toBe(page);
  });
});

describe("browser route metadata", () => {
  it("preserves every route and loading/head fields, leaving full unknown and MDX metadata intact", async () => {
    const pages = {
      "/guide": { ...guide, html: undefined },
      "/mdx": {
        kind: "mdx",
        meta: { custom: true },
        title: "An MDX page",
        relativePath: "page.mdx",
      },
      "/unknown": {
        kind: "markdown",
        meta: { pageKind: "future-guide", custom: true },
        headings: ["keep"],
      },
      "/article": { kind: "markdown", meta: { author: "A person" }, lastUpdated: "2026-10-09" },
    };
    const routes = Object.keys(pages);
    const source = `export const routes = ${JSON.stringify(routes)};\nexport const pagesMeta = ${JSON.stringify(pages)};\nexport const mdxLoaders = {};\nexport const pages = pagesMeta;`;
    const output = compactPageMetadataModule(source);
    const result = await import(
      `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
    );
    expect(result.routes).toEqual(routes);
    expect(Object.keys(result.pagesMeta)).toEqual(routes);
    expect(result.pagesMeta["/guide"]).toEqual({
      kind: "markdown",
      title: guide.title,
      description: guide.description,
      meta: { pageKind: "getting-started-guide" },
    });
    for (const route of ["/mdx", "/unknown", "/article"])
      expect(result.pagesMeta[route]).toEqual(pages[route as keyof typeof pages]);
    expect(pages["/guide"].headings).toBe(guide.headings);
  });

  it("fails explicitly on upstream module-shape changes instead of quietly removing routes", () => {
    expect(() => compactPageMetadataModule("export const pagesMeta = buildPages();")).toThrow(
      "changed shape",
    );
    expect(() =>
      compactPageMetadataModule("export const pagesMeta = { '/': readPage() };"),
    ).toThrow("no longer JSON");
  });
});
