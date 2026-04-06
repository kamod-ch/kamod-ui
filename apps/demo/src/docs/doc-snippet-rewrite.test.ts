import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildDocsPageSlugsLongestFirst,
  rewriteKamodCoreImportsInDocString,
  symbolToKamodSlug,
} from "./doc-snippet-rewrite";
import { docsPageSlugsLongestFirst, docsPages } from "./registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("doc-snippet-rewrite", () => {
  it("orders slugs longest-first", () => {
    expect(buildDocsPageSlugsLongestFirst(["a", "long-slug", "long"])).toEqual([
      "long-slug",
      "long",
      "a",
    ]);
  });

  it("maps symbols using slug list", () => {
    const slugs = buildDocsPageSlugsLongestFirst(["navigation-menu", "menu"]);
    expect(symbolToKamodSlug("NavigationMenuItem", slugs)).toBe("navigation-menu");
  });

  it("leaves pnpm install snippet unchanged", () => {
    const s = "pnpm add @kamod-ui/core";
    expect(rewriteKamodCoreImportsInDocString(s, "button", docsPageSlugsLongestFirst)).toBe(s);
  });

  it("rewrites core import and sends unknown symbols to lucide", () => {
    const src = 'import { Button, Menu } from "@kamod-ui/core"';
    const out = rewriteKamodCoreImportsInDocString(src, "button", docsPageSlugsLongestFirst);
    expect(out).toContain("@/components/kamod-ui/button");
    expect(out).toContain("lucide-preact");
  });

  it("registry slug list matches docsPages", () => {
    const fromPages = buildDocsPageSlugsLongestFirst(docsPages.map((p) => p.slug));
    expect(docsPageSlugsLongestFirst).toEqual(fromPages);
  });
});

describe("docs registry vs page files", () => {
  it("registry slugs match *-doc slug fields on disk", () => {
    const pagesDir = path.join(__dirname, "pages");
    const fromDisk = new Set<string>();
    for (const name of fs.readdirSync(pagesDir)) {
      if (!name.endsWith("-doc.tsx") && !name.endsWith("-doc.ts")) continue;
      const raw = fs.readFileSync(path.join(pagesDir, name), "utf8");
      const m = raw.match(/slug:\s*"([^"]+)"/);
      if (m) fromDisk.add(m[1]!);
    }
    const fromRegistry = new Set(docsPages.map((p) => p.slug));
    expect([...fromRegistry].sort()).toEqual([...fromDisk].sort());
  });
});
