import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";
import { CodeBlock } from "../CodeBlock";
import { ComponentDocSection } from "./ComponentDocSection";
import {
  componentDesignReference,
  componentGuidance,
  componentSourceUrl,
} from "./component-guidance";

export const componentIntegrationContents = [
  {
    id: "integration-guide",
    label: "Build it into your interface",
    children: [
      { id: "integration-behavior", label: "Connect the behavior" },
      { id: "integration-styling", label: "Refine the presentation" },
      { id: "integration-review", label: "Review the complete interaction" },
    ],
  },
  {
    id: "component-references",
    label: "Sources & design references",
    children: [
      { id: "component-source", label: "Kamod UI implementation" },
      { id: "component-design-reference", label: "Design reference" },
    ],
  },
];

/** Practical family-specific guidance; the original examples remain the source of component API details. */
export function ComponentIntegrationGuide({ doc }: { doc: DocPageModule }) {
  const guidance = componentGuidance(doc.slug);
  const reference = componentDesignReference(doc.slug);
  return (
    <>
      <ComponentDocSection
        section={{
          id: "integration-guide",
          title: "Build it into your interface",
          text: `Use the ${doc.title} examples as a starting point, then review the behavior in the context of your own screen. Layout, state and content should work together.`,
        }}
      >
        <div class="block-guide-prose">
          <h3 id="integration-behavior" tabIndex={-1}>
            <BlockHeadingLink id="integration-behavior">Connect the behavior</BlockHeadingLink>
          </h3>
          <p>{guidance.integration}</p>
          <p>
            <strong>Copy the composition, then connect its intent.</strong> Replace sample records
            and callbacks with your own data flow. For options such as <code>value</code>,{" "}
            <code>defaultValue</code>, <code>open</code> or <code>onChange</code>, use only those
            documented in this component's <a href="#api-reference">API</a>; different components
            expose different contracts.
          </p>
          <h3 id="integration-styling" tabIndex={-1}>
            <BlockHeadingLink id="integration-styling">Refine the presentation</BlockHeadingLink>
          </h3>
          <p>
            Let a parent own the surrounding spacing. Keep related elements together with{" "}
            <code>gap</code> and use semantic surface/foreground pairs so the composition follows
            the active theme. The wrapper below changes the surrounding layout without assuming
            extra props on <code>{doc.title}</code>.
          </p>
        </div>
        <CodeBlock
          language="tsx"
          filePath="src/components/ExampleSurface.tsx"
          code={`import type { ComponentChildren } from "preact";\n\nexport function ExampleSurface({ children }: { children: ComponentChildren }) {\n  return (\n    <div class="grid min-w-0 gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground sm:p-6">\n      {children}\n    </div>\n  );\n}`}
        />
        <div class="block-guide-prose">
          <p>
            Put the chosen example inside <code>ExampleSurface</code>, then refine supported{" "}
            <strong>variants and sizes</strong> using the API above. For application-wide changes,
            adjust <a href={withBasePath("/docs/theming/token-overrides")}>theme tokens</a> instead
            of repeating fixed colors. See{" "}
            <a href={withBasePath("/blocks/styles")}>Component styles</a> for hierarchy, density and
            focus treatments.
          </p>
          <h3 id="integration-review" tabIndex={-1}>
            <BlockHeadingLink id="integration-review">
              Review the complete interaction
            </BlockHeadingLink>
          </h3>
          <ul class="component-review-list">
            {guidance.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
          <p>
            The preview's narrow control changes its <strong>container width</strong>. Also resize
            the browser when checking viewport-based Tailwind utilities such as <code>sm:</code> and{" "}
            <code>md:</code>, and test overlays in the full page where their portals render.
          </p>
        </div>
        <nav class="component-related-links" aria-label="Related components">
          <span>Compose with</span>
          {guidance.related
            .filter((slug) => slug !== doc.slug)
            .map((slug) => (
              <a key={slug} href={withBasePath(`/docs/${slug}/installation`)}>
                {slug
                  .split("-")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            ))}
        </nav>
      </ComponentDocSection>
      <ComponentDocSection
        section={{
          id: "component-references",
          title: "Sources & design references",
          text: "Keep the implementation reference and visual inspiration close at hand when adapting an example.",
        }}
      >
        <div class="component-reference-grid">
          <div class="block-guide-prose">
            <h3 id="component-source" tabIndex={-1}>
              <BlockHeadingLink id="component-source">Kamod UI implementation</BlockHeadingLink>
            </h3>
            <p>
              The Preact components, examples and API on this page are maintained in{" "}
              <a href={componentSourceUrl(doc.slug, doc.navGroup === "motion")}>
                kamod-ch/kamod-ui
              </a>
              . Use this repository as the source of truth for supported behavior and consult its{" "}
              <a href="https://github.com/kamod-ch/kamod-ui/blob/main/LICENSE">license</a> when
              reusing code.
            </p>
          </div>
          {reference ? (
            <div class="block-guide-prose">
              <h3 id="component-design-reference" tabIndex={-1}>
                <BlockHeadingLink id="component-design-reference">
                  Shadcnblocks design reference
                </BlockHeadingLink>
              </h3>
              <p>
                Explore the matching <a href={reference}>{doc.title} collection on Shadcnblocks</a>{" "}
                for additional visual patterns. These are independently maintained React examples;
                this link credits the reference collection, not the authorship of Kamod's Preact
                implementation. Check the source's own license before copying an example.
              </p>
            </div>
          ) : (
            <div class="block-guide-prose">
              <h3 id="component-design-reference" tabIndex={-1}>
                <BlockHeadingLink id="component-design-reference">
                  Shared design language
                </BlockHeadingLink>
              </h3>
              <p>
                Use the <a href={withBasePath("/blocks/styles")}>component styles guide</a> for
                composition decisions and the{" "}
                <a href={withBasePath("/docs/theming/installation")}>theming guide</a> for the
                shared token contract.
              </p>
            </div>
          )}
        </div>
      </ComponentDocSection>
    </>
  );
}
