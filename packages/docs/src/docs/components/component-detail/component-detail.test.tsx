import { existsSync } from "node:fs";
import { resolve } from "node:path";
import render from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { DocsComponentContent } from "../../DocsComponentContent";
import { docsPages } from "../../registry";
import { componentDesignReference, componentSourceUrl } from "./component-guidance";

const components = docsPages.filter(
  (doc) =>
    !doc.guideContents &&
    (!doc.navGroup || doc.navGroup === "components" || doc.navGroup === "forms"),
);

describe("component detail documentation", () => {
  it.each(components.map((doc) => [doc.slug, doc] as const))(
    "%s keeps its sections inside the shared reading layout",
    (_slug, doc) => {
      const sourcePath = componentSourceUrl(doc.slug).split("/main/")[1];
      expect(
        existsSync(resolve(import.meta.dirname, "../../../../../..", sourcePath)),
        doc.slug,
      ).toBe(true);
      const html = render(<DocsComponentContent slug={doc.slug} section="installation" />);
      expect(html).toContain('class="block-guide component-detail blocks-doc-body"');
      expect(html).toContain('id="component-preview"');
      expect(html.includes('class="blocks-doc-toc"')).toBe(true);
      expect(html).toContain('id="integration-guide"');
      expect(html).toContain('id="component-references"');
      for (const section of doc.sections.filter(
        (section) =>
          !/rtl/i.test(section.id) && !/rtl/i.test(section.title) && !/motion/i.test(section.id),
      )) {
        expect(html.includes(`id="${section.id}"`), `${doc.slug}/${section.id}`).toBe(true);
        expect(html.includes(`href="#${section.id}"`), `${doc.slug}/${section.id} heading`).toBe(
          true,
        );
      }
    },
  );

  it("Formisch uses Forms navigation and counts only interactive examples", () => {
    const html = render(<DocsComponentContent slug="formisch" section="installation" />);
    expect(html).toContain('href="/docs/forms"');
    expect(html).toContain("10 documented patterns");
    expect(html.replace(/<[^>]+>/g, "")).toContain("pnpm add @formisch/preact valibot");
    expect(html).toContain(componentSourceUrl("formisch"));
    const directory = html.split('aria-label="Formisch examples"')[1].split("</nav>")[0];
    expect(directory).toContain('href="#array-fields"');
    expect(directory).not.toContain('href="#sources"');
    expect(directory).not.toContain('href="#approach"');
    expect(html).toContain('href="https://ui.shadcn.com/docs/forms/formisch"');
  });

  it("only links verified external categories and maps different category names deliberately", () => {
    expect(componentDesignReference("accordion")).toBe(
      "https://www.shadcnblocks.com/components/accordion",
    );
    expect(componentDesignReference("video")).toBe(
      "https://www.shadcnblocks.com/components/video-player",
    );
    expect(componentDesignReference("dropdown")).toBe(
      "https://www.shadcnblocks.com/components/dropdown-menu",
    );
    expect(componentDesignReference("cn")).toBeUndefined();
  });
});
