import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";
import { BrandText } from "../brand/BrandText";
import { CodeBlock } from "../CodeBlock";
import { CnIntegrationGuide } from "./CnIntegrationGuide";
import { ComponentBehaviorGuide } from "./ComponentBehaviorGuide";
import { ComponentDocSection } from "./ComponentDocSection";
import { ComponentReferences } from "./ComponentReferences";
import { ComponentRelatedComponents } from "./ComponentRelatedComponents";
import { componentGuidance } from "./component-guidance";

const componentIntegrationContents = [
  {
    id: "integration-guide",
    label: "Build It into Your Interface",
    children: [
      { id: "integration-behavior", label: "Connect the Behavior" },
      { id: "integration-styling", label: "Refine the Presentation" },
      { id: "integration-review", label: "Review the Complete Interaction" },
      { id: "integration-compose", label: "Compose a Complete Interface" },
    ],
  },
  {
    id: "component-references",
    label: "Sources & Design References",
    children: [
      { id: "component-source", label: "Kamod UI Implementation" },
      { id: "component-design-reference", label: "Design Reference" },
      { id: "component-reference-next", label: "Bring It Back to Your App" },
    ],
  },
];

/** Keep contents labels aligned with utility-specific reference headings. */
export function getComponentIntegrationContents(doc: DocPageModule) {
  if (doc.slug !== "cn") return componentIntegrationContents;
  return [
    componentIntegrationContents[0],
    {
      id: "component-references",
      label: "Source, Styling & Next Steps",
      children: [
        { id: "component-source", label: "Follow the Merge" },
        { id: "component-design-reference", label: "Make Overrides Predictable" },
        { id: "component-reference-next", label: "Check the Result in Your App" },
      ],
    },
  ];
}

/** Practical family-specific guidance; the original examples remain the source of component API details. */
export function ComponentIntegrationGuide({ doc }: { doc: DocPageModule }) {
  if (doc.slug === "cn")
    return (
      <>
        <CnIntegrationGuide doc={doc} />
        <ComponentReferences doc={doc} />
      </>
    );
  const guidance = componentGuidance(doc.slug);
  return (
    <>
      <ComponentDocSection
        section={{
          id: "integration-guide",
          title: "Build It into Your Interface",
          text: `Use the ${doc.title} examples as a starting point, then review the behavior in the context of your own screen. Layout, state and content should work together.`,
        }}
      >
        <div class="block-guide-prose">
          <h3 id="integration-behavior" tabIndex={-1}>
            <BlockHeadingLink id="integration-behavior">Connect the Behavior</BlockHeadingLink>
          </h3>
          <p>{guidance.integration}</p>
          <p>
            <strong>Copy the Composition, Then Connect Its Intent.</strong> Replace sample records
            and callbacks with your own data flow. For options such as <code>value</code>,{" "}
            <code>defaultValue</code>, <code>open</code> or <code>onChange</code>, use only those
            documented in this component's <a href="#api-reference">API</a>; different components
            expose different contracts.
          </p>
          <ComponentBehaviorGuide doc={doc} />
          <h3 id="integration-styling" tabIndex={-1}>
            <BlockHeadingLink id="integration-styling">Refine the Presentation</BlockHeadingLink>
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
            <strong>Variants and Sizes</strong> using the API above. For application-wide changes,
            adjust <a href={withBasePath("/docs/theming/token-overrides")}>Theme Tokens</a> instead
            of repeating fixed colors. See{" "}
            <a href={withBasePath("/blocks/styles")}>Component Styles</a> for hierarchy, density and
            focus treatments.
          </p>
          <h3 id="integration-review" tabIndex={-1}>
            <BlockHeadingLink id="integration-review">
              Review the Complete Interaction
            </BlockHeadingLink>
          </h3>
          <ul class="component-review-list">
            {guidance.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
          <p>
            <BrandText>
              The preview's narrow control changes its <strong>Container Width</strong>. Also resize
              the browser when checking viewport-based Tailwind utilities such as <code>sm:</code>{" "}
              and <code>md:</code>, and test overlays in the full page where their portals render.
            </BrandText>
          </p>
        </div>
        <ComponentRelatedComponents doc={doc} related={guidance.related} />
      </ComponentDocSection>
      <ComponentReferences doc={doc} />
    </>
  );
}
