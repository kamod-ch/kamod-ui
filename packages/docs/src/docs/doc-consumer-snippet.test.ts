import { describe, expect, it } from "vitest";
import {
  docConsumerSnippet,
  docSnippetForDisplay,
  listUnmappedLocalUiImports,
} from "./doc-consumer-snippet";
import { docsPageSlugsLongestFirst } from "./doc-snippet-imports";
import { kamodUiComponentSlugs } from "./doc-ui-export-slugs";

const doc = { slug: "button", snippetImports: "package" as const };

describe("docConsumerSnippet", () => {
  it("rewrites local kamod-ui aliases to package subpaths", () => {
    const src = `import { Button } from "@/components/kamod-ui/button";
export const Example = () => <Button>Save</Button>;`;
    const out = docConsumerSnippet(src, doc, docsPageSlugsLongestFirst);
    expect(out).toContain('from "@kamod-ch/ui/button"');
    expect(out).not.toContain("@/components/kamod-ui/");
  });

  it("splits barrel imports into verified subpaths", () => {
    const src = 'import { Button, Spinner } from "@kamod-ch/ui"';
    const out = docConsumerSnippet(src, doc, docsPageSlugsLongestFirst);
    expect(out).toContain('@kamod-ch/ui/button"');
    expect(out).toContain('@kamod-ch/ui/spinner"');
  });

  it("maps button, input, and dialog snippets used in smoke coverage", () => {
    const samples = [
      ["button", "Button"],
      ["input", "Input"],
      ["dialog", "Dialog"],
    ] as const;
    for (const [slug, name] of samples) {
      expect(kamodUiComponentSlugs).toContain(slug);
      const out = docConsumerSnippet(
        `import { ${name} } from "@/components/kamod-ui/${slug}"`,
        { slug, snippetImports: "package" },
        docsPageSlugsLongestFirst,
      );
      expect(out).toContain(`@kamod-ch/ui/${slug}`);
    }
  });

  it("defaults component docs to package mode in docSnippetForDisplay", () => {
    const { mode, consumer } = docSnippetForDisplay(
      'import { Button } from "@/components/kamod-ui/button"',
      {
        slug: "button",
        title: "Button",
        command: "pnpm add @kamod-ch/ui",
        usageLabel: "Actions",
        sections: [],
        renderMain: () => null,
      },
      docsPageSlugsLongestFirst,
    );
    expect(mode).toBe("package");
    expect(consumer).toContain("@kamod-ch/ui/button");
  });
});

describe("listUnmappedLocalUiImports", () => {
  it("flags paths that are not published exports", () => {
    const missing = listUnmappedLocalUiImports(
      'import { X } from "@/components/kamod-ui/not-a-real-export"',
    );
    expect(missing).toContain("not-a-real-export");
  });
});
