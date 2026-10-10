import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { DocPageModule, DocSection } from "../../types";
import { componentExamplesTitle } from "./component-examples";

/** Introduces the example collection immediately before its first existing section. */
export function ComponentExamplesSection({
  doc,
  examples,
}: {
  doc: DocPageModule;
  examples: DocSection[];
}) {
  const first = examples[0];
  return (
    <section
      id="component-examples"
      class="docs-section blocks-doc-section component-examples-intro"
      aria-labelledby="component-examples-title"
    >
      <h2 id="component-examples-title" tabIndex={-1}>
        <BlockHeadingLink id="component-examples">{componentExamplesTitle(doc)}</BlockHeadingLink>
      </h2>
      <div class="block-guide-prose">
        <p>
          Explore <strong>{doc.title} in Different Contexts</strong>, from the starting pattern to
          the compositions below. Begin with <a href={`#${first.id}`}>{linkTitle(first.title)}</a>,
          then compare the examples that match your content, state and layout. These are working
          patterns to adapt, not a list of interchangeable <code>variant</code> values: check the{" "}
          <a href="#api-reference">API Reference</a> before using a prop or combining behaviors.
          {doc.navGroup === "forms"
            ? " Pay particular attention to validation feedback, field relationships and what happens after submission."
            : " Look at the surrounding labels, supporting text and spacing as well as the component itself."}
        </p>
        <p>
          <strong>Read the Result and Its Implementation Together.</strong> Use each showcase’s Code
          view to inspect imports and composition, or its Prompt view to prepare a setup or
          adaptation brief. Try the narrow preview and local theme controls before connecting real
          data, and use Reset to return an example to its initial state. Keep layout changes in{" "}
          <code>class</code> utilities where appropriate; follow the{" "}
          <a href={withBasePath("/blocks/styles")}>Component Styles Guide</a> for hierarchy and the{" "}
          <a href={withBasePath("/docs/theming/installation")}>Theming Guide</a> for shared surfaces
          and colors. The <a href="#accessibility">Accessibility Notes</a> explain what to preserve
          when making those changes.
        </p>
      </div>
    </section>
  );
}
