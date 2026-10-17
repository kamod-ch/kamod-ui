import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { blockGuides } from "./guide-catalog";
import { parseGuide } from "./guide-markdown";

const root = resolve(import.meta.dirname, "../../..");
const source = (slug: string) => readFileSync(resolve(root, `blocks/${slug}.md`), "utf8");

describe("block guide documents", () => {
  it.each([
    ["", "const ready = true;", "javascript"],
    ["JS", "const ready = true;", "javascript"],
    ["typescript", "const ready = true;", "typescript"],
    ["json", '{ "name": "demo" }', "json"],
    ["text", ".panel { color: red; }", "css"],
    ["unknown src/theme.css", ":root { --surface: white; }", "css"],
    ["src/App.tsx", "export const App = () => <main />;", "tsx"],
    ["unknown", "A plain message for the reader.", "text"],
  ])("resolves the %j fence from its label, filename or content", (label, code, language) => {
    const [{ parts }] = parseGuide(`## Example\n\n\`\`\`${label}\n${code}\n\`\`\``);
    expect(parts.find((part) => part.kind === "code")).toMatchObject({ code, language });
  });

  it("marks nested fences for lazy highlighting while keeping their list/quote structure", () => {
    const [{ parts }] = parseGuide(
      '## Nested examples\n\n> ```\n> const message = "<script>";\n> ```\n\n1. Use this rule:\n\n   ```unknown styles.css\n   .panel { color: red; }\n   ```',
    );
    const html = parts
      .filter((part) => part.kind === "html")
      .map((part) => part.html)
      .join("");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<ol>");
    expect(html).toContain('data-language="javascript"');
    expect(html).toContain('data-language="css"');
    expect(html).toMatch(/&lt;script(?:&gt;|>)/);
    expect(html).toContain('href="https://tc39.es/ecma262/"');
    expect(html).toContain('title="styles.css"');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('class="token');
  });

  it("preserves source code and file paths separately from rendered prose", () => {
    const [section] = parseGuide(
      "---\ntitle: Test\n---\n## First steps\n\nUse **Preact**.\n\n```tsx src/App.tsx\nconst node = <div />;\n```\n\nContinue here.",
    );
    expect(section.id).toBe("first-steps");
    expect(section.parts).toEqual([
      { kind: "html", html: expect.stringContaining('href="https://preactjs.com/"') },
      { kind: "code", language: "tsx", filePath: "src/App.tsx", code: "const node = <div />;" },
      { kind: "html", html: "<p>Continue here.</p>\n" },
    ]);
  });

  it("opts explicit install fences into package-manager tabs while preserving ordinary shell code", () => {
    const [{ parts }] = parseGuide(
      "## Install\n\n```bash package-manager\npnpm add @kamod-ch/ui @preact/signals\n```\n\n```bash\npnpm add preact\n```",
    );
    expect(parts.filter((part) => part.kind !== "html")).toEqual([
      { kind: "dependencies", dependencies: ["@kamod-ch/ui", "@preact/signals"] },
      { kind: "code", code: "pnpm add preact", language: "bash", filePath: undefined },
    ]);
    expect(() =>
      parseGuide("## Install\n\n```bash package-manager\npnpm add preact && pnpm build\n```"),
    ).toThrow("Package-manager fences require a plain pnpm add command");
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

it("preserves four contents levels, heading ranks and sibling order", () => {
  const [section] = parseGuide(
    "## Setup\n### Validation\n#### Async Rules\n##### Retry\nDetails\n### Submission\n##### Skipped Rank\nMore",
  );
  expect(section.children).toEqual([
    {
      id: "validation",
      label: "Validation",
      children: [
        { id: "async-rules", label: "Async Rules", children: [{ id: "retry", label: "Retry" }] },
      ],
    },
    {
      id: "submission",
      label: "Submission",
      children: [{ id: "skipped-rank", label: "Skipped Rank" }],
    },
  ]);
  expect(section.parts).toContainEqual({
    kind: "heading",
    id: "async-rules",
    title: "Async Rules",
    level: 4,
  });
  expect(section.parts).toContainEqual({ kind: "heading", id: "retry", title: "Retry", level: 5 });
  expect(() => parseGuide("## Setup\n### Validation\n#### Retry\n##### Retry")).toThrow(
    "Duplicate block guide heading",
  );
});
