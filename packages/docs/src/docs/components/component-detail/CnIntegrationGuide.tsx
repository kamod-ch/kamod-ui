import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";
import { CodeBlock } from "../CodeBlock";
import { ComponentDocSection } from "./ComponentDocSection";
import { ComponentRelatedComponents } from "./ComponentRelatedComponents";
import { componentGuidance } from "./component-guidance";

/** Keep the utility's integration advice about class composition rather than component state APIs. */
export function CnIntegrationGuide({ doc }: { doc: DocPageModule }) {
  const guidance = componentGuidance(doc.slug);
  return (
    <ComponentDocSection
      section={{
        id: "integration-guide",
        title: "Build It into Your Interface",
        text: "Move from individual class strings to a shared styling contract. Decide which defaults belong to the component, which classes describe its current state, and what a caller can override.",
      }}
    >
      <div class="block-guide-prose">
        <h3 id="integration-behavior" tabIndex={-1}>
          <BlockHeadingLink id="integration-behavior">Connect the Behavior</BlockHeadingLink>
        </h3>
        <p>
          <strong>Keep Class Composition Pure.</strong> <code>cn</code> returns a string; it does
          not create state, attach events or set accessibility attributes. Keep behavior in the
          component that owns the interaction, then derive its visual state with{" "}
          <a href="#conditional-classes">Conditional Classes</a>.
        </p>
        <h3 id="integration-styling" tabIndex={-1}>
          <BlockHeadingLink id="integration-styling">Refine the Presentation</BlockHeadingLink>
        </h3>
        <p>
          <strong>Choose Complete Class Names.</strong> Map named options to literal utilities so
          your Tailwind build can discover them. A typed lookup makes the supported choices clear; a
          final <code>className</code> provides the consumer override point.
        </p>
      </div>
      <CodeBlock
        language="typescript"
        filePath="src/components/surface-classes.ts"
        code={`import { cn } from "@kamod-ch/ui/utils";

const densityClasses = {
  compact: "p-3 text-sm",
  comfortable: "p-6 text-base",
} as const;

type Density = keyof typeof densityClasses;

export function surfaceClasses(density: Density, className?: string) {
  return cn(
    "rounded-lg border border-border bg-card text-card-foreground",
    densityClasses[density],
    className,
  );
}

surfaceClasses("compact", "p-4"); // Keeps text-sm; replaces p-3 with p-4.`}
      />
      <div class="block-guide-prose">
        <p>
          Use the returned value on the element’s <code>class</code> attribute. Keep the shared
          surface and foreground paired; change{" "}
          <a href={withBasePath("/docs/theming/token-overrides")}>Theme Tokens</a> for app-wide
          colors, or compare the <a href="#variant-system">Variant Pattern</a> when a component
          needs more named choices.
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
      </div>
      <ComponentRelatedComponents doc={doc} related={guidance.related} />
    </ComponentDocSection>
  );
}
