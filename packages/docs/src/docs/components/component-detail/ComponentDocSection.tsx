import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocSection } from "../../types";
import { componentAccessibility } from "./accessibility";
import { ComponentAccessibilitySection } from "./ComponentAccessibilitySection";
import { ComponentApiSection } from "./ComponentApiSection";
import { ComponentExamplesSection } from "./ComponentExamplesSection";
import { ComponentExamplesContext } from "./component-examples";

/** Keep existing section anchors while sharing the block documentation's heading and prose styles. */
export function ComponentDocSection({
  section,
  children,
}: {
  section: DocSection;
  children?: ComponentChildren;
}) {
  const collection = useContext(ComponentExamplesContext);
  const accessibility =
    collection && section.id === "accessibility"
      ? componentAccessibility(collection.doc.slug)
      : undefined;
  if (collection && accessibility) {
    return (
      <ComponentAccessibilitySection doc={collection.doc} profile={accessibility}>
        {children}
      </ComponentAccessibilitySection>
    );
  }
  if (collection && section.id === "api-reference") {
    return (
      <ComponentApiSection doc={collection.doc} introduction={section.text}>
        {children}
      </ComponentApiSection>
    );
  }
  const isExample = collection?.examples.some(({ id }) => id === section.id);
  const Heading = isExample ? "h3" : "h2";
  return (
    <>
      {collection?.examples[0]?.id === section.id && <ComponentExamplesSection {...collection} />}
      <section
        id={section.id}
        class={`docs-section blocks-doc-section component-doc-section${isExample ? " component-variant-section" : ""}`}
        aria-labelledby={`${section.id}-title`}
      >
        <Heading id={`${section.id}-title`} tabIndex={-1}>
          <BlockHeadingLink id={section.id}>{section.title}</BlockHeadingLink>
        </Heading>
        <p class="docs-copy">
          {section.text
            .split(/(`[^`]+`|\b[\w-]+="[^"]+")/g)
            .map((part, index) =>
              part.startsWith("`") ? (
                <code key={index}>{part.slice(1, -1)}</code>
              ) : /^[\w-]+="/.test(part) ? (
                <code key={index}>{part}</code>
              ) : (
                part
              ),
            )}
        </p>
        {children}
      </section>
    </>
  );
}
