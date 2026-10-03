import { existsSync } from "node:fs";
import { resolve } from "node:path";
import render from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { DocsComponentContent } from "../../DocsComponentContent";
import { docsPages } from "../../registry";
import { accessibilityContents, componentAccessibility } from "./accessibility";
import { componentApiTypes, componentTypeId } from "./component-api";
import { getComponentExamples } from "./component-examples";
import { componentDesignReference, componentSourceUrl } from "./component-guidance";

const components = docsPages.filter(
  (doc) =>
    !doc.guideContents &&
    (!doc.navGroup || doc.navGroup === "components" || doc.navGroup === "forms"),
);

describe("component detail documentation", () => {
  it.each(["kbd", "type-definition"])(
    "%s distinguishes usage requirements from fallback values",
    (slug) => {
      const text = render(<DocsComponentContent slug={slug} section="installation" />).replace(
        /<[^>]+>/g,
        " ",
      );
      expect(text).toMatch(/Usage requirement\s+Required/);
      expect(text).not.toMatch(/Documented default\s+required/i);
      if (slug === "type-definition") expect(text).toMatch(/Documented default\s+false/);
    },
  );

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
      const previews = [...html.matchAll(/data-example-index="(\d+)"/g)];
      expect(previews.length, doc.slug).toBeGreaterThan(0);
      expect((html.match(/aria-label="Prompt"/g) ?? []).length).toBe(previews.length);
      for (const [, index] of previews) {
        const preview = render(
          <DocsComponentContent slug={doc.slug} previewIndex={Number(index)} />,
        );
        expect(preview, `${doc.slug} example ${index}`).not.toContain(
          "This example is not available",
        );
        expect(preview).toContain("component-example-canvas");
        expect(preview).not.toContain("component-example-frame");
      }
      expect(html.includes('class="blocks-doc-toc"')).toBe(true);
      expect(html).toContain('id="integration-guide"');
      expect(html).toContain('id="component-references"');
      expect(html).toContain('id="integration-compose"');
      expect(html).toContain('id="component-props"');
      expect(html).toContain('id="component-data-types"');
      // Every component needs its own verified guidance, with reachable nested contents.
      const accessibility = componentAccessibility(doc.slug);
      expect(accessibility, `${doc.slug} accessibility profile`).toBeDefined();
      expect(accessibility?.checks).toHaveLength(3);
      for (const { id } of accessibilityContents) {
        expect(html).toContain(`id="${id}"`);
        expect(html).toContain(`href="#${id}"`);
      }
      const definitions = componentApiTypes(doc.slug);
      expect(new Set(definitions.map(componentTypeId)).size, doc.slug).toBe(definitions.length);
      for (const entry of definitions) {
        expect(html).toContain(`id="${componentTypeId(entry)}"`);
      }

      const examples = getComponentExamples(doc, doc.sections).filter(
        ({ id, title }) => !/rtl|motion/i.test(id) && !/rtl/i.test(title),
      );
      if (examples.length) {
        expect((html.match(/id="component-examples"/g) ?? []).length).toBe(1);
        for (const example of examples) {
          expect(html).toContain(`<h3 id="${example.id}-title"`);
        }
        expect(html.indexOf('id="component-examples"')).toBeLessThan(
          html.indexOf(`id="${examples[0].id}"`),
        );
      }
      const contents = html.split('class="blocks-doc-toc"')[1];
      expect(contents).toMatch(
        /href="#api-reference"[^>]*>Props and data<\/a><ul><li><a href="#component-props"/,
      );
      expect(contents).toContain('href="#component-data-types"');

      expect(contents).toMatch(
        /href="#top"[^>]*>Overview<\/a><ul><li><a href="#component-preview"/,
      );
      if (examples.length) {
        expect(contents).toMatch(/href="#component-examples"[^>]*>[^<]+<\/a><ul>/);
      }

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
    expect(html).not.toContain("component-detail-actions");
    expect(html.replace(/<[^>]+>/g, "")).toContain("pnpm add @formisch/preact valibot");
    expect(html).toContain(componentSourceUrl("formisch"));
    const directory = html.split('aria-label="Formisch examples"')[1].split("</nav>")[0];
    expect(directory).toContain('href="#array-fields"');
    expect(directory).not.toContain('href="#sources"');
    expect(directory).not.toContain('href="#approach"');
    expect(html.indexOf('id="array-fields"')).toBeLessThan(html.indexOf('id="approach"'));
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
