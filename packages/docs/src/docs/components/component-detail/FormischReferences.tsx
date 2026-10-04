import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button, Separator } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { repositoryUrl } from "../../../blocks/block-links";
import { PathDisplay } from "../PathDisplay";
import { ComponentDocSection } from "./ComponentDocSection";
import { componentSourceUrl } from "./component-guidance";

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
        title: "Sources & design references",
        text: "Use the Kamod examples for the working Preact composition, the package documentation for behavior, and the original guide for the form patterns behind it.",
      }}
    >
      <div class="formisch-references block-guide-prose">
        <div>
          <div class="formisch-reference-heading">
            <h3 id="component-source" tabIndex={-1}>
              <BlockHeadingLink id="component-source">Kamod UI implementation</BlockHeadingLink>
            </h3>
            <Button
              class="docs-icon-button"
              variant="ghost"
              size="sm"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse source <ArrowUpRightIcon size={14} aria-hidden="true" />
            </Button>
          </div>
          <p>
            <strong>Follow a complete example from field to submission.</strong> The local source
            connects <code>Field</code>, validation feedback and Kamod controls. Compare its
            bindings with the <a href="#api-reference">props and contracts</a> before replacing the
            demo’s submit handler with your own request.
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
              license notices
            </a>{" "}
            when reusing source.
          </p>
        </div>

        <Separator decorative />

        <div>
          <h3 id="component-design-reference" tabIndex={-1}>
            <BlockHeadingLink id="component-design-reference">
              Design reference & package guides
            </BlockHeadingLink>
          </h3>
          <p>
            Each reference answers a different question.{" "}
            <strong>
              Formisch owns field state, Valibot owns schema validation, and Kamod supplies the
              interface.
            </strong>{" "}
            The shadcn/ui guide provides the reference patterns; it is separate from the Preact
            implementation linked above.
          </p>
          <dl class="formisch-reference-list">
            {references.map(({ name, href, description }) => (
              <div key={name}>
                <dt>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {name} <ArrowUpRightIcon size={13} aria-hidden="true" />
                  </a>
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Separator decorative />

        <div>
          <h3 id="component-reference-next" tabIndex={-1}>
            <BlockHeadingLink id="component-reference-next">
              Bring it back to your app
            </BlockHeadingLink>
          </h3>
          <p>
            Start with one <a href="#component-examples">documented form pattern</a>, connect your
            data and request, then work through the{" "}
            <a href="#accessibility">accessibility guidance</a>. Keep labels, errors and focus
            behavior intact while refining spacing with the{" "}
            <a href={withBasePath("/blocks/styles")}>styles guide</a>. Put shared colors in your{" "}
            <a href={withBasePath("/docs/theming/installation")}>theme tokens</a> so the form
            belongs naturally beside the rest of your interface.
          </p>
        </div>
      </div>
    </ComponentDocSection>
  );
}
