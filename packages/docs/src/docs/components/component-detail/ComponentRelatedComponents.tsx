import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";

const companionDescriptions: Record<string, string> = {
  alert:
    "Keep important status and recovery instructions in the page. Explain what happened and what the user can do next, especially when an operation fails.",
  empty:
    "Explain a finished view with no results and offer a useful next action. An empty state should not be confused with loading or a request error.",
  progress:
    "Show measured completion, or an indeterminate state when the duration is unknown. Pair the indicator with a meaningful label and an explicit outcome.",
  field:
    "Group a control with its label, help text and validation feedback. Keep these relationships intact when moving the field into a larger form.",
  label:
    "Name the control before the user interacts. Associate the label with a unique control ID rather than relying on placeholder text alone.",
  input:
    "Collect a simple text value using the appropriate input type. Connect its value and validation to the same form state as the surrounding controls.",
  select:
    "Offer a defined set of choices when free text would be ambiguous. Keep option values stable and distinguish the placeholder from an actual selection.",
  button:
    "Give the next action an explicit label. Choose a submit button for form submission and a non-submit button for secondary actions inside a form.",
  "button-group":
    "Keep closely related actions together and make their order deliberate. Grouping should clarify a relationship without giving every action equal visual emphasis.",
  spinner:
    "Indicate a short wait beside the action or region that caused it. Add readable pending text and stop the indicator when the request settles.",
  dialog:
    "Move a focused task into an overlay when users should stay on the current page. Give it a clear title, a reachable close action and a sensible focus return.",
  tooltip:
    "Add brief supplementary context to a control. Keep essential instructions and error messages visible instead of placing them only in a tooltip.",
  tabs: "Switch between related views within one context. Keep each panel labelled and decide whether the selected view should also be represented in the URL.",
  accordion:
    "Reveal supporting detail in manageable sections. Keep essential actions visible and choose headings that explain what each disclosure contains.",
  breadcrumb:
    "Show where a screen sits in a larger hierarchy. Use real destinations for ancestors and identify the current page without duplicating local controls.",
  table:
    "Present records with meaningful column headers and consistent units. Account for long values, missing data and narrow screens before adding more controls.",
  skeleton:
    "Reserve a recognizable layout while content is loading. Replace it with real content, an empty state or an error once the request finishes.",
  "aspect-ratio":
    "Reserve a predictable media area before an asset loads. Choose the ratio for the content and review cropping at narrow widths.",
  image:
    "Provide useful alternative text and a deliberate fallback for missing media. Review how the image and surrounding content behave during loading.",
  card: "Give related content and actions a shared boundary. Keep the heading, explanation and next action in a clear reading order.",
  separator:
    "Mark a meaningful boundary between groups of content. Use spacing alongside the separator so the relationship remains clear without a heavy border.",
  typography:
    "Give headings, paragraphs and supporting text a consistent hierarchy. Preserve semantic heading order when changing visual size or emphasis.",
};

/** Explain a companion's role before sending readers to another component reference. */
export function ComponentRelatedComponents({
  doc,
  related,
}: {
  doc: DocPageModule;
  related: readonly string[];
}) {
  return (
    <section class="component-composition block-guide-prose" aria-labelledby="integration-compose">
      <h3 id="integration-compose" tabIndex={-1}>
        <BlockHeadingLink id="integration-compose">Compose a complete interface</BlockHeadingLink>
      </h3>
      <p>
        <strong>{doc.title} is one part of the interaction.</strong> Choose companion components for
        the information or actions that still need a place on the screen. The references below are
        suggestions to compose deliberately, not extra dependencies you must add to every example.
      </p>
      <p>
        Keep one source of truth for the operation and let each component communicate a different
        part of it. For example, <strong>waiting, no results and failure</strong> need different
        explanations. Avoid showing contradictory states together, and keep recovery actions close
        to the message that explains them.
      </p>
      <nav aria-label={`Components to compose with ${doc.title}`} class="component-companion-list">
        {related
          .filter((slug) => slug !== doc.slug)
          .map((slug) => {
            const name = slug
              .split("-")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(" ");
            return (
              <div key={slug} class="component-companion">
                <Button asChild variant="ghost" size="sm" class="component-companion-link">
                  <a href={withBasePath(`/docs/${slug}/installation`)}>
                    {name}
                    <ArrowUpRightIcon size={14} aria-hidden="true" />
                  </a>
                </Button>
                <p>{companionDescriptions[slug]}</p>
              </div>
            );
          })}
      </nav>
      <p class="blocks-doc-note">
        Start with the smallest composition that explains the task. Browse the{" "}
        <a href={withBasePath("/docs/components")}>component library</a> for individual controls or
        the <a href={withBasePath("/blocks")}>block collections</a> for complete layouts. Reuse
        shared <a href={withBasePath("/docs/theming/installation")}>theme tokens</a> so these pieces
        feel consistent in light and dark mode.
      </p>
    </section>
  );
}
