import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button, Separator } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { repositoryUrl } from "../../../blocks/block-links";
import { BrandText } from "../brand/BrandText";
import { InlineCodeLink } from "../InlineCodeLink";
import { PathDisplay } from "../PathDisplay";
import { ComponentDocSection } from "./ComponentDocSection";
import { componentSourceUrl } from "./component-guidance";
import { ReferenceReadingGuide } from "./ReferenceReadingGuide";

const references = [
  {
    name: "Formisch",
    href: "https://formisch.dev/",
    description: (
      <>
        Form state, field paths and submission behavior. Use the{" "}
        <PathDisplay path={"@formisch/preact"} /> adapter for these examples.
      </>
    ),
  },
  {
    name: "Valibot",
    href: "https://valibot.dev/",
    description: (
      <>
        Schema rules, validation messages and inferred types. Keep these rules close to your form’s
        data model.
      </>
    ),
  },
  {
    name: "shadcn/ui",
    href: "https://ui.shadcn.com/docs/forms/formisch",
    description: (
      <>
        The original Formisch guide referenced by this page. Compare its form patterns; its code
        uses React, while these examples use Preact and Kamod.
      </>
    ),
  },
];

/** Open, compact source notes for the form integration, with attribution separate from its APIs. */
export function FormischReferences() {
  const source = componentSourceUrl("formisch");
  return (
    <ComponentDocSection
      section={{
        id: "component-references",
        title: "Sources & Design References",
        text: "**Follow the Data from Input to Submission.** Use the [working examples](#component-preview) for the Preact composition, the [props and contracts](#api-reference) for bindings, and the package guides for behavior. Keep the design reference beside these sources when refining labels, feedback and spacing.",
      }}
    >
      <div class="formisch-references block-guide-prose">
        <ReferenceReadingGuide stage="start" />
        <div>
          <div class="formisch-reference-heading">
            <h3 id="component-source" tabIndex={-1}>
              <BlockHeadingLink id="component-source">Kamod UI Implementation</BlockHeadingLink>
            </h3>
            <Button
              class="docs-icon-button"
              variant="ghost"
              size="sm"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Source <ArrowUpRightIcon size={14} aria-hidden="true" />
            </Button>
          </div>
          <p>
            <strong>Follow a Complete Example from Field to Submission.</strong> The local source
            connects <InlineCodeLink href="/docs/field/installation">Field</InlineCodeLink>,
            validation feedback and Kamod controls. Compare its bindings with the{" "}
            <InlineCodeLink href="#api-reference">Props and Contracts</InlineCodeLink> before
            replacing the demo’s submit handler with your own request.
          </p>
          <p>
            <strong>Separate the Three Responsibilities.</strong> Start with the value your request
            needs, describe its validation with{" "}
            <InlineCodeLink href="https://valibot.dev/">Valibot</InlineCodeLink>, and connect field
            state with <InlineCodeLink href="https://formisch.dev/">Formisch</InlineCodeLink>. Kamod
            controls present those values and messages. Keep field names consistent with the schema,
            and use the <InlineCodeLink href="#component-examples">Form Examples</InlineCodeLink> to
            see the complete binding rather than copying only the visible input.
          </p>
          <div class="formisch-reference-location">
            <span>Source</span>
            <a href={source} target="_blank" rel="noopener noreferrer">
              <PathDisplay path={source.split("/main/")[1] ?? source} />
            </a>
          </div>
          <p class="formisch-reference-note">
            Match APIs to the versions in your <code>package.json</code> and lockfile; the
            repository’s <code>main</code> branch may be newer. Retain the applicable{" "}
            <a
              href={`${repositoryUrl}/blob/main/LICENSE.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              License Notices
            </a>{" "}
            when reusing source.
          </p>
        </div>

        <Separator decorative />

        <p>
          <strong>Trace One Field Before Comparing the Whole Form.</strong> Follow its initial
          value, label, validation message and submitted value in the source. Then use the
          references below to answer the part you are changing: field state, schema rules or visual
          presentation. Keeping those questions separate makes a larger form easier to understand
          one field at a time.
        </p>
        <div>
          <h3 id="component-design-reference" tabIndex={-1}>
            <BlockHeadingLink id="component-design-reference">
              Design Reference & Package Guides
            </BlockHeadingLink>
          </h3>
          <p>
            <BrandText>
              Each reference answers a different question.{" "}
              <strong>
                Formisch Owns Field State, Valibot Owns Schema Validation, and Kamod Supplies the
                Interface.
              </strong>{" "}
              The shadcn/ui guide provides the reference patterns; it is separate from the Preact
              implementation linked above.
            </BrandText>
          </p>
          <dl class="formisch-reference-list">
            {references.map(({ name, href, description }) => (
              <div key={name}>
                <dt>
                  <InlineCodeLink href={href}>{name}</InlineCodeLink>
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
          <p>
            <strong>Compare Feedback, Not Just Fields.</strong> Notice where the reference puts an
            error, how it labels the submit action and what remains visible during a request. Test
            those choices with a failed submission and corrected values, then follow the{" "}
            <InlineCodeLink href="#accessibility">Accessibility Guidance</InlineCodeLink> for labels
            and focus. Preserve the Preact bindings from the local example when borrowing a visual
            detail from a React design.
          </p>
        </div>

        <Separator decorative />

        <div>
          <h3 id="component-reference-next" tabIndex={-1}>
            <BlockHeadingLink id="component-reference-next">
              Bring It Back to Your App
            </BlockHeadingLink>
          </h3>
          <p>
            Start with one <a href="#component-examples">Documented Form Pattern</a>, connect your
            data and request, then work through the{" "}
            <a href="#accessibility">Accessibility Guidance</a>. Keep labels, errors and focus
            behavior intact while refining spacing with the{" "}
            <a href={withBasePath("/blocks/styles")}>Styles Guide</a>. Put shared colors in your{" "}
            <a href={withBasePath("/docs/theming/installation")}>Theme Tokens</a> so the form
            belongs naturally beside the rest of your interface.
          </p>
          <p>
            <strong>Make One Submission Work from End to End.</strong> Begin with the smallest{" "}
            <InlineCodeLink href="#component-examples">Form Example</InlineCodeLink> that matches
            your task. Replace its sample field names and schema together, connect the real request,
            then verify the submitted values before adding more fields. Keep request failures
            distinct from validation errors so the user knows what to fix or retry.
          </p>
          <p>
            <strong>Try the Unhappy Path Too.</strong> Submit incomplete values, correct an error,
            and try a request that fails. Check that the explanation stays near the relevant control
            and that entered values remain available for another attempt. Revisit{" "}
            <InlineCodeLink href="#api-reference">Props and Contracts</InlineCodeLink> when changing
            bindings; changing the look of a field should not silently change what it submits.
          </p>
        </div>
      </div>
    </ComponentDocSection>
  );
}
