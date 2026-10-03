import { ArrowRightIcon, ChevronDownIcon } from "@kamod-ch/icons/lucide";
import { Badge, Button } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
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
          Explore <strong>{doc.title} in different contexts</strong>, from the starting pattern to
          the compositions below. Begin with <a href={`#${first.id}`}>{first.title}</a>, then
          compare the examples that match your content, state and layout. These are working patterns
          to adapt, not a list of interchangeable <code>variant</code> values: check the{" "}
          <a href="#api-reference">API reference</a> before using a prop or combining behaviors.
          {doc.navGroup === "forms"
            ? " Pay particular attention to validation feedback, field relationships and what happens after submission."
            : " Look at the surrounding labels, supporting text and spacing as well as the component itself."}
        </p>
        <p>
          <strong>Read the result and its implementation together.</strong> Use each showcase’s Code
          view to inspect imports and composition, or its Prompt view to prepare a setup or
          adaptation brief. Try the narrow preview and local theme controls before connecting real
          data, and use Reset to return an example to its initial state. Keep layout changes in{" "}
          <code>class</code> utilities where appropriate; follow the{" "}
          <a href={withBasePath("/blocks/styles")}>component styles guide</a> for hierarchy and the{" "}
          <a href={withBasePath("/docs/theming/installation")}>theming guide</a> for shared surfaces
          and colors. The <a href="#accessibility">accessibility notes</a> explain what to preserve
          when making those changes.
        </p>
      </div>
      <details class="component-example-directory">
        <summary>
          <span class="component-example-directory-heading">
            <strong>Explore the examples</strong>
            <span>Find a pattern for your next step</span>
          </span>
          <Badge variant="outline" size="xxs">
            {examples.length} {examples.length === 1 ? "pattern" : "patterns"}
          </Badge>
          <ChevronDownIcon
            class="component-example-directory-chevron"
            size={16}
            aria-hidden="true"
          />
        </summary>
        <div class="component-example-directory-body">
          <p>
            Jump to a pattern’s <strong>explanation and source</strong>. Start with the simplest
            composition that fits your needs, then compare the differences before copying it. An
            example may share the <a href="#component-preview">main live preview</a> rather than
            repeat the same showcase.
          </p>
          <nav aria-label={`${doc.title} examples`}>
            <ul>
              {examples.map((example, index) => (
                <li key={example.id}>
                  <a href={`#${example.id}`}>
                    <span class="component-example-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span class="component-example-directory-copy">
                      <strong>{example.title}</strong>
                      <span>{example.text.replaceAll("`", "")}</span>
                    </span>
                    <ArrowRightIcon size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div class="component-example-directory-footer">
            <p>
              <strong>Choosing between patterns?</strong> Compare supported props first, then test
              the interaction with your own content.
            </p>
            <Button variant="ghost" size="sm" href="#api-reference">
              Read the API <ArrowRightIcon size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </details>
    </section>
  );
}
