import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button, Card } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { repositoryUrl } from "../../../blocks/block-links";
import type { DocPageModule } from "../../types";
import { ComponentDocSection } from "./ComponentDocSection";
import { componentDesignReference, componentSourceUrl } from "./component-guidance";
import { FormischReferences } from "./FormischReferences";

/** A consistent reading order for implementation sources and independent design references. */
function ReferencePanel({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ComponentChildren;
}) {
  return (
    <Card class="component-reference-panel block-guide-prose">
      <span class="component-reference-label">{label}</span>
      <h3 id={id} tabIndex={-1}>
        <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
      </h3>
      {children}
    </Card>
  );
}

/** Separate source ownership from visual inspiration, then connect both to the local guides. */
export function ComponentReferences({ doc }: { doc: DocPageModule }) {
  if (doc.slug === "formisch") return <FormischReferences />;
  const source = componentSourceUrl(doc.slug, doc.navGroup === "motion");
  const reference = componentDesignReference(doc.slug);
  const sourcePath = source.split("/main/")[1];
  return (
    <ComponentDocSection
      section={{
        id: "component-references",
        title: "Sources & design references",
        text: `Follow ${doc.title} from its implementation to the ideas behind your own composition. Start with the local API, explore a visual direction, then bring the result back to your app’s shared styles.`,
      }}
    >
      <div class="component-references">
        <ReferencePanel
          id="component-source"
          label="Implementation · Preact"
          title="Kamod UI implementation"
        >
          <p>
            <strong>Start with the code that powers this page.</strong> The{" "}
            <a href={source} target="_blank" rel="noopener noreferrer">
              {doc.title} source in Kamod UI
            </a>{" "}
            is the implementation reference. Use the <a href="#installation">installation guide</a>{" "}
            for setup and the <a href="#api-reference">API reference</a> for supported props,
            composition and events before adapting an example.
          </p>
          <p class="component-reference-location">
            <span>Source location</span>
            <code>{sourcePath}</code>
          </p>
          <p>
            Compare imports, default values and state handling with the example you chose. The
            repository’s <code>main</code> branch can be ahead of your installed version; check your{" "}
            <code>package.json</code> and lockfile when an API differs. Retain applicable license
            notices when reusing source.
          </p>
          <nav
            class="component-reference-actions"
            aria-label={`${doc.title} implementation resources`}
          >
            <Button
              variant="ghost"
              size="sm"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the source <ArrowUpRightIcon size={14} aria-hidden="true" />
            </Button>
            <a
              href={`${repositoryUrl}/blob/main/LICENSE.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository license
            </a>
            <a href="#component-preview">Back to the examples</a>
          </nav>
        </ReferencePanel>

        <ReferencePanel
          id="component-design-reference"
          label={
            reference
              ? "Visual reference · Independently maintained"
              : "Design direction · Shared foundations"
          }
          title={
            reference ? "Explore the visual possibilities" : "Build on a shared design language"
          }
        >
          {reference ? (
            <>
              <p>
                Browse the{" "}
                <a href={reference} target="_blank" rel="noopener noreferrer">
                  {doc.title} collection on Shadcnblocks
                </a>{" "}
                to compare <strong>hierarchy, density and composition</strong>. Look at how labels,
                supporting text and surrounding space work together, then choose the details that
                help your own content read clearly.
              </p>
              <p>
                <strong>Reference credit: Shadcnblocks.</strong> These independently maintained
                React examples are visual references; this link does not claim they authored Kamod’s{" "}
                <code>Preact</code> implementation. Check the original example’s license before
                reusing its code or assets, and use this page’s API when building the Kamod version.
              </p>
            </>
          ) : (
            <>
              <p>
                Start with the <a href={withBasePath("/blocks/styles")}>component styles guide</a>{" "}
                to choose a clear hierarchy and consistent spacing. Keep the same treatment for
                similar actions, and let <strong>content and behavior</strong> determine which
                details deserve emphasis.
              </p>
              <p>
                This page does not identify a matching external design collection. Use the local
                examples as your starting point and the{" "}
                <a href={withBasePath("/docs/components")}>component library</a> to find neighboring
                patterns. Shared <code>bg-card</code>, <code>text-card-foreground</code> and{" "}
                <code>border-border</code> utilities help those pieces feel related.
              </p>
            </>
          )}
          <nav class="component-reference-actions" aria-label={`${doc.title} design resources`}>
            <Button
              variant="ghost"
              size="sm"
              href={reference ?? withBasePath("/blocks/styles")}
              {...(reference ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {reference ? "Open the design collection" : "Explore component styles"}
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </Button>
            <a href="#integration-review">Review the interaction</a>
          </nav>
        </ReferencePanel>

        <div class="component-reference-next block-guide-prose">
          <h3 id="component-reference-next" tabIndex={-1}>
            <BlockHeadingLink id="component-reference-next">
              Bring it back to your app
            </BlockHeadingLink>
          </h3>
          <p>
            A reference becomes useful when it fits your real content. Work through these decisions
            in order:
          </p>
          <ol class="component-reference-steps">
            <li>
              <strong>Keep the behavior grounded.</strong> Start with the{" "}
              <a href="#component-preview">interactive examples</a>, then connect your data and
              callbacks using the <a href="#integration-behavior">integration guidance</a>. Preserve
              labels, keyboard access and disabled states as you change the presentation.
            </li>
            <li>
              <strong>Make the styling repeatable.</strong> Use the{" "}
              <a href={withBasePath("/blocks/styles")}>styles guide</a> for local <code>class</code>{" "}
              adjustments and{" "}
              <a href={withBasePath("/docs/theming/installation")}>theming documentation</a> for
              shared color decisions. Keep semantic surface and foreground pairs together in both
              light and dark mode.
            </li>
            <li>
              <strong>Check the complete screen.</strong> See how components combine in the{" "}
              <a href={withBasePath("/blocks")}>block collections</a>, then try long labels, loading
              states and narrow layouts in your own composition. The{" "}
              <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle guide</a> helps
              you expose a scheme switch in the finished interface.
            </li>
          </ol>
        </div>
      </div>
    </ComponentDocSection>
  );
}
