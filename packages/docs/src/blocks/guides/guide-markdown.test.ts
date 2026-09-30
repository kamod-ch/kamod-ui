import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { blockGuides } from "./guide-catalog";
import { parseGuide } from "./guide-markdown";

const root = resolve(import.meta.dirname, "../../..");
const source = (slug: string) => readFileSync(resolve(root, `blocks/${slug}.md`), "utf8");

describe("block guide documents", () => {
  it("preserves source code and file paths separately from rendered prose", () => {
    const [section] = parseGuide(
      "---\ntitle: Test\n---\n## First steps\n\nUse **Preact**.\n\n```tsx src/App.tsx\nconst node = <div />;\n```\n\nContinue here.",
    );
    expect(section.id).toBe("first-steps");
    expect(section.parts).toEqual([
      { kind: "html", html: "<p>Use <strong>Preact</strong>.</p>\n" },
      { kind: "code", language: "tsx", filePath: "src/App.tsx", code: "const node = <div />;" },
      { kind: "html", html: "<p>Continue here.</p>\n" },
    ]);
  });

  it("escapes literal HTML and does not activate executable links", () => {
    const [{ parts }] = parseGuide(
      "## Safety\n\n<script>alert(1)</script>\n\n[Bad](javascript:alert) [External](https://example.com)",
    );
    const html = parts
      .filter((part) => part.kind === "html")
      .map((part) => part.html)
      .join("");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('href="https://example.com"');
  });

  it("uses a deployment prefix for internal links and preserves fragments", async () => {
    vi.resetModules();
    vi.stubEnv("BASE_URL", "/kamod-ui/");
    try {
      const { parseGuide: parse } = await import("./guide-markdown");
      const [{ parts }] = parse("## Links\n\n[Guide](/blocks/styles#review) [Section](#links)");
      expect(parts[0]).toMatchObject({
        html: expect.stringContaining('href="/kamod-ui/blocks/styles#review"'),
      });
      expect(parts[0]).toMatchObject({ html: expect.stringContaining('href="#links"') });
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  it("exposes subsection headings as nested contents targets and linked heading parts", () => {
    const [section] = parseGuide("## Setup\n\nIntro\n\n### Check styles\n\nDetails");
    expect(section.children).toEqual([{ id: "check-styles", label: "Check styles" }]);
    expect(section.parts).toContainEqual({
      kind: "heading",
      id: "check-styles",
      title: "Check styles",
    });
    expect(() => parseGuide("## Setup\n\n### Setup")).toThrow("Duplicate block guide heading");
  });

  it("rejects duplicate heading targets", () => {
    expect(() => parseGuide("## Setup\n\nOne\n\n## Setup\n\nTwo")).toThrow(
      "Duplicate block guide heading",
    );
  });

  for (const { slug } of blockGuides) {
    it(`${slug} supplies valid routes, section links and copyable examples`, () => {
      const markdown = source(slug);
      const sections = parseGuide(markdown);
      expect(markdown).toContain(`slug: ${slug}`);
      expect(markdown).toContain("pageKind: blocks-guide");
      expect(sections.length).toBeGreaterThan(0);
      expect(sections.every(({ parts }) => parts.length > 0)).toBe(true);
      expect(sections.flatMap(({ parts }) => parts).some((part) => part.kind === "code")).toBe(
        true,
      );
      for (const [, path, fragment] of markdown.matchAll(/\]\((\/[^)#]+)(?:#([^)]*))?\)/g)) {
        const route = resolve(root, path.slice(1));
        expect(existsSync(`${route}.md`) || existsSync(`${route}/index.md`), path).toBe(true);
        const otherGuide = blockGuides.find((guide) => path === `/blocks/${guide.slug}`);
        if (fragment && otherGuide) {
          expect(
            parseGuide(source(otherGuide.slug)).flatMap(({ id, children }) => [
              id,
              ...(children?.map((child) => child.id) ?? []),
            ]),
            `${path}#${fragment}`,
          ).toContain(fragment);
        }
      }
    });
  }
});
