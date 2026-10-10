import render from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { DocsComponentContent } from "../../DocsComponentContent";
import { docsPages } from "../../registry";
import { packageGuideRecipes } from "./package-guide-recipes";

const packages = Object.keys(packageGuideRecipes);

describe("package guide navigation and static reading", () => {
  it.each(packages)("%s exposes every contents destination once without JavaScript", (slug) => {
    const doc = docsPages.find((page) => page.slug === slug)!;
    const html = render(<DocsComponentContent slug={slug} section="installation" />);
    for (const section of doc.guideContents!) {
      for (const entry of [section, ...(section.children ?? [])]) {
        expect(html.split(`id="${entry.id}"`).length - 1, entry.id).toBe(1);
        expect(html).toContain(`href="#${entry.id}"`);
      }
    }
    expect(html.replace(/<[^>]+>/g, "")).not.toContain("View Markdown");
    expect(html).toContain("Reference Display");
    expect(html).toContain(`download="${slug}-reference.md"`);
    expect(html).toContain("## Troubleshooting");
    expect(html).toContain("Sources &amp; Attribution");
    const reference = decodeURIComponent(
      html.match(/href="data:text\/markdown;charset=utf-8,([^"]+)"/)![1],
    );
    expect(reference).toContain(`https://ui.kamod.ch/docs/${slug}/installation#usage`);
    expect(reference).not.toMatch(/\]\((?:#|\/)/);
    for (const id of ["installation", "usage"]) {
      const introduction = doc.sections!.find((section) => section.id === id)!.text!;
      // Exports retain the complete introduction, including its last paragraph before any links.
      expect(reference).toContain(introduction.split("\n\n").at(-1)!.split("[")[0]);
    }
    expect(reference).toContain(`${doc.usageImportSnippet}\n\n${doc.usageExampleSnippet}`);
  });
});
