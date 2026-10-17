import { Prose } from "@kamod-ch/ui";
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
      text: "**Give Long-Form Content a Consistent Reading Rhythm.** Wrap article content in `Prose` to coordinate headings, paragraphs and lists as a reading surface. Semantic HTML provides the document structure, while the typography treatment gives those elements a consistent visual rhythm.\n\nUse meaningful heading levels and real list markup, and inspect links and inline `code` alongside ordinary text before applying the surface to generated or user-authored content.",
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
          <h2>Documentation Heading</h2>
          <p>Readable paragraph styles with sensible defaults.</p>
          <ul>
            <li>First point</li>
            <li>Second point</li>
          </ul>
        </Prose>
      ),
    },
    {
      id: "narrow-prose",
      title: "Narrow Prose",
      text: "**Control Line Length as Well as Font Size.** Constrain the prose container's width when the page is primarily intended for reading. Shorter line lengths can make dense explanations easier to follow without changing their heading hierarchy or introducing separate surfaces around every paragraph.\n\nKeep code blocks and tables usable within that width, and check how nested lists and longer links wrap at the smallest supported viewport.",
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
      ),
    },
  ],
  apiRows: [
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "children", type: "rich text content", defaultValue: "required" },
    { prop: "data-slot", type: '"prose"', defaultValue: '"prose"' },
  ],
  accessibilityText:
    "Ensure semantic heading order is maintained and links remain distinguishable from body text.",
});
