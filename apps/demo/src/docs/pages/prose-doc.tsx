import { Prose } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const proseDocPage = createGenericDocPage({
  slug: "prose",
  title: "Prose",
  usageLabel: "Prose applies typographic defaults for rich text content.",
  installationText: "Import Prose from `@/components/kamod-ui/prose`.",
  usageText: "Wrap markdown or article-like HTML in Prose for readable typography.",
  exampleSections: [
    {
      id: "article-prose",
      title: "Article Prose",
      text: "Render headings, paragraphs and lists with prose styles.",
      code: `import { Prose } from "@/components/kamod-ui/prose";

export const Example = () => (
  <Prose class="max-w-2xl">
    <h2>Documentation heading</h2>
    <p>Readable paragraph styles with sensible defaults.</p>
    <ul><li>First point</li><li>Second point</li></ul>
  </Prose>
);`,
      renderPreview: () => (
        <Prose class="max-w-2xl">
          <h2>Documentation heading</h2>
          <p>Readable paragraph styles with sensible defaults.</p>
          <ul><li>First point</li><li>Second point</li></ul>
        </Prose>
      )
    },
    {
      id: "narrow-prose",
      title: "Narrow Prose",
      text: "Constrain width for long-form readability.",
      code: `import { Prose } from "@/components/kamod-ui/prose";

export const Example = () => (
  <Prose class="max-w-xl">
    <p>Constrained line length improves reading comfort and scanability.</p>
  </Prose>
);`,
      renderPreview: () => (
        <Prose class="max-w-xl">
          <p>Constrained line length improves reading comfort and scanability.</p>
        </Prose>
      )
    }
  ],
  apiRows: [
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "rich text content", defaultValue: "required" },
    { prop: "data-slot", type: '"prose"', defaultValue: '"prose"' }
  ],
  accessibilityText: "Ensure semantic heading order is maintained and links remain distinguishable from body text."
});
