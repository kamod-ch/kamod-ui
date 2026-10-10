import { ArrowUpRightIcon, CheckIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { Fragment } from "preact";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import type { DocContentsSection, DocRenderMainContext } from "../../types";
import { SectionDescription } from "../component-detail/SectionDescription";
import { DocsCallout } from "../DocsCallout";
import { LibraryGuideSection } from "../LibraryGuideSection";
import { IconsIntegrationReview } from "./IconsIntegrationReview";
import { PackageCapabilities, packageFeatureId } from "./PackageCapabilities";
import { PackageExamples } from "./PackageExamples";
import { PackageGuideHeader, PackageText } from "./PackageGuideHeader";
import {
  PackageOwnership,
  PackageSources,
  PackageTroubleshooting,
} from "./PackagePracticalSections";
import { PackageReference } from "./PackageReference";
import { packageGuideDetails } from "./package-guide-details";
import { packageGuideNotes } from "./package-guide-notes";
import { packageGuideRecipes } from "./package-guide-recipes";

export function packageGuideContents(config: PackageTeaserConfig): DocContentsSection[] {
  return [
    {
      id: "capabilities",
      label: "What the Package Brings",
      children: [
        { id: "choose-your-approach", label: "Choose the Right Approach" },
        ...config.features.map(({ title }) => ({ id: packageFeatureId(title), label: title })),
      ],
    },
    {
      id: "installation",
      label: "Installation",
      children: [{ id: "check-your-environment", label: "Check Your Environment" }],
    },
    {
      id: "usage",
      label: "Usage",
      children: [
        { id: "read-the-example", label: "Read the Example" },
        { id: "put-it-to-work", label: packageGuideRecipes[config.slug].title },
      ],
    },
    {
      id: "integration",
      label: "Integrate with Your Application",
      children: [
        { id: "state-and-lifetime", label: "Choose the Owner and Lifetime" },
        { id: "environment-boundaries", label: "Account for the Environment" },
        ...(config.slug === "icons-package"
          ? [{ id: "icons-integration-review", label: "Review the Finished Controls" }]
          : []),
      ],
    },
    { id: "troubleshooting", label: "When Something Behaves Differently" },
    {
      id: "api-reference",
      label: "API Reference",
      children: [{ id: "explore-the-package", label: config.externalCtaTitle }],
    },
    {
      id: "accessibility",
      label: "Accessibility Notes",
      children: [{ id: "before-you-ship", label: "Before You Ship" }],
    },
    { id: "portable-reference", label: "Take the Guide with You" },
    { id: "sources-and-attribution", label: "Sources & Attribution" },
  ];
}

/** Compose all five package guides from shared sections and package-specific examples. */
export function PackageGuide({
  config,
  context,
}: {
  config: PackageTeaserConfig;
  context: DocRenderMainContext;
}) {
  const notes = packageGuideNotes[config.slug];
  const details = packageGuideDetails[config.slug];
  const sections = context.sections.flatMap((section) =>
    section.id === "usage"
      ? [section, { id: "integration", title: "Integrate with Your Application", text: "" }]
      : [section],
  );
  return (
    <article class="block-guide package-guide" id="top">
      <PackageGuideHeader config={config} />
      <div class="block-guide-documentation">
        <div class="blocks-doc-body">
          <LibraryGuideSection id="capabilities" title="What the Package Brings">
            <PackageCapabilities config={config} />
          </LibraryGuideSection>
          {sections.map((section) => (
            <Fragment key={section.id}>
              {section.id === "api-reference" && <PackageTroubleshooting config={config} />}
              <LibraryGuideSection id={section.id} title={section.title}>
                {section.text && (
                  <div class="block-guide-prose">
                    {section.id === "installation" || section.id === "usage" ? (
                      <SectionDescription text={section.text} paragraphClassName="" />
                    ) : (
                      <p>
                        <PackageText text={section.text} />
                      </p>
                    )}
                  </div>
                )}
                {section.id === "integration" && (
                  <>
                    <div class="block-guide-prose">{notes.integration}</div>
                    <PackageOwnership config={config} />
                    {config.slug === "icons-package" ? (
                      <IconsIntegrationReview outcome={details.outcome} />
                    ) : (
                      <DocsCallout
                        class="docs-callout-spaced"
                        icon={<CheckIcon />}
                        title="What a good integration looks like"
                        eyebrow="Integration goal"
                      >
                        <p>{details.outcome}</p>
                      </DocsCallout>
                    )}
                  </>
                )}
                {section.id === "installation" && (
                  <>
                    {context.renderSectionExtraContent(section.id)}
                    <h3 id="check-your-environment" tabIndex={-1}>
                      <BlockHeadingLink id="check-your-environment">
                        Check Your Environment
                      </BlockHeadingLink>
                    </h3>
                    <div class="block-guide-prose">
                      <p>
                        Use your existing package manager and keep the peer dependencies aligned
                        with your application. Compare <code>package.json</code> and your lockfile
                        with the documentation for the version you install; add the package once at
                        the workspace boundary that uses it.
                      </p>
                      <p>
                        <strong>Keep the First Change Small.</strong> Start with the usage example,
                        run your project’s typecheck and build, then connect it to a real screen.
                        The <a href={withBasePath("/docs/packages")}>Package Overview</a> helps you
                        decide how companion libraries fit together.
                      </p>
                    </div>
                  </>
                )}
                {section.id === "usage" && <PackageExamples config={config} />}
                {section.id === "api-reference" && (
                  <div class="block-guide-prose">
                    <p>
                      Use this page to understand the integration, then consult the{" "}
                      <a href={config.externalDocsUrl} target="_blank" rel="noopener noreferrer">
                        Full API Reference on Live Docs
                      </a>{" "}
                      for exact signatures and supported options. Compare those details with the
                      version in your lockfile before adapting an example.
                    </p>
                    <h3 id="explore-the-package" tabIndex={-1}>
                      <BlockHeadingLink id="explore-the-package">
                        {config.externalCtaTitle}
                      </BlockHeadingLink>
                    </h3>
                    <p>{config.externalCtaDescription}</p>
                    <ul>
                      <li>
                        <strong>Before Choosing an API:</strong> read its input types, return values
                        and default behavior.
                      </li>
                      <li>
                        <strong>Before Shipping:</strong> review lifecycle or server-rendering notes
                        for the features you use.
                      </li>
                      <li>
                        <strong>When Behavior Differs:</strong> reduce the case to a small example
                        and include your package version in the report.
                      </li>
                    </ul>
                    <div class="package-guide-reference-action">
                      <span>Continue with the dedicated package documentation.</span>
                      <Button
                        class="docs-icon-button"
                        variant="outline"
                        size="sm"
                        href={config.externalDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Live Docs <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )}
                {section.id === "accessibility" && (
                  <>
                    <h3 id="before-you-ship" tabIndex={-1}>
                      <BlockHeadingLink id="before-you-ship">Before You Ship</BlockHeadingLink>
                    </h3>
                    <div class="block-guide-prose">
                      <ul>
                        {notes.checks.map((check) => (
                          <li key={check}>{check}</li>
                        ))}
                      </ul>
                      <p>
                        Review the result with <strong>Real Content and Keyboard Input</strong>.
                        Keep visible labels, loading and error feedback, and focus behavior in sync
                        with the state your application exposes.
                      </p>
                    </div>
                  </>
                )}
              </LibraryGuideSection>
            </Fragment>
          ))}
          <LibraryGuideSection id="portable-reference" title="Take the Guide with You">
            <PackageReference config={config} />
          </LibraryGuideSection>
          <PackageSources config={config} />
        </div>
      </div>
    </article>
  );
}
