import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { Fragment } from "preact";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { BlockGuideContents } from "../../../blocks/detail/BlockGuideContents";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import type { DocContentsSection, DocRenderMainContext } from "../../types";
import { LibraryGuideSection } from "../LibraryGuideSection";
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
      label: "What the package brings",
      children: [
        { id: "choose-your-approach", label: "Choose the right approach" },
        ...config.features.map(({ title }) => ({ id: packageFeatureId(title), label: title })),
      ],
    },
    {
      id: "installation",
      label: "Installation",
      children: [{ id: "check-your-environment", label: "Check your environment" }],
    },
    {
      id: "usage",
      label: "Usage",
      children: [
        { id: "read-the-example", label: "Read the example" },
        { id: "put-it-to-work", label: packageGuideRecipes[config.slug].title },
      ],
    },
    {
      id: "integration",
      label: "Integrate with your application",
      children: [
        { id: "state-and-lifetime", label: "Choose the owner and lifetime" },
        { id: "environment-boundaries", label: "Account for the environment" },
      ],
    },
    { id: "troubleshooting", label: "When something behaves differently" },
    {
      id: "api-reference",
      label: "API Reference",
      children: [{ id: "explore-the-package", label: config.externalCtaTitle }],
    },
    {
      id: "accessibility",
      label: "Accessibility Notes",
      children: [{ id: "before-you-ship", label: "Before you ship" }],
    },
    { id: "portable-reference", label: "Take the guide with you" },
    { id: "sources-and-attribution", label: "Sources & attribution" },
  ];
}

/** Compose all five package guides from shared sections and package-specific examples. */
export function PackageGuide({
  config,
  context,
  contents,
}: {
  config: PackageTeaserConfig;
  context: DocRenderMainContext;
  contents: DocContentsSection[];
}) {
  const notes = packageGuideNotes[config.slug];
  const details = packageGuideDetails[config.slug];
  const sections = context.sections.flatMap((section) =>
    section.id === "usage"
      ? [section, { id: "integration", title: "Integrate with your application", text: "" }]
      : [section],
  );
  return (
    <article class="block-guide package-guide" id="top">
      <PackageGuideHeader config={config} />
      <BlockGuideContents
        id={`${config.slug}-mobile-contents`}
        sections={contents}
        pageTitle={config.headline}
        mobile
      />
      <div class="block-guide-documentation">
        <div class="blocks-doc-body">
          <LibraryGuideSection id="capabilities" title="What the package brings">
            <PackageCapabilities config={config} />
          </LibraryGuideSection>
          {sections.map((section) => (
            <Fragment key={section.id}>
              {section.id === "api-reference" && <PackageTroubleshooting config={config} />}
              <LibraryGuideSection id={section.id} title={section.title}>
                {section.text && (
                  <div class="block-guide-prose">
                    <p>
                      <PackageText text={section.text} />
                    </p>
                  </div>
                )}
                {section.id === "integration" && (
                  <>
                    <div class="block-guide-prose">{notes.integration}</div>
                    <PackageOwnership config={config} />
                    <aside class="package-guide-callout" aria-label="Integration goal">
                      <strong>What a good integration looks like</strong>
                      <p>{details.outcome}</p>
                    </aside>
                  </>
                )}
                {section.id === "installation" && (
                  <>
                    {context.renderSectionExtraContent(section.id)}
                    <h3 id="check-your-environment" tabIndex={-1}>
                      <BlockHeadingLink id="check-your-environment">
                        Check your environment
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
                        <strong>Keep the first change small.</strong> Start with the usage example,
                        run your project’s typecheck and build, then connect it to a real screen.
                        The <a href={withBasePath("/docs/packages")}>package overview</a> helps you
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
                        Full API reference on live docs
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
                        <strong>Before choosing an API:</strong> read its input types, return values
                        and default behavior.
                      </li>
                      <li>
                        <strong>Before shipping:</strong> review lifecycle or server-rendering notes
                        for the features you use.
                      </li>
                      <li>
                        <strong>When behavior differs:</strong> reduce the case to a small example
                        and include your package version in the report.
                      </li>
                    </ul>
                    <div class="package-guide-reference-action">
                      <span>Continue with the dedicated package documentation.</span>
                      <Button
                        variant="outline"
                        size="sm"
                        href={config.externalDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open live docs <ArrowUpRightIcon size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )}
                {section.id === "accessibility" && (
                  <>
                    <h3 id="before-you-ship" tabIndex={-1}>
                      <BlockHeadingLink id="before-you-ship">Before you ship</BlockHeadingLink>
                    </h3>
                    <div class="block-guide-prose">
                      <ul>
                        {notes.checks.map((check) => (
                          <li key={check}>{check}</li>
                        ))}
                      </ul>
                      <p>
                        Review the result with <strong>real content and keyboard input</strong>.
                        Keep visible labels, loading and error feedback, and focus behavior in sync
                        with the state your application exposes.
                      </p>
                    </div>
                  </>
                )}
              </LibraryGuideSection>
            </Fragment>
          ))}
          <LibraryGuideSection id="portable-reference" title="Take the guide with you">
            <PackageReference config={config} />
          </LibraryGuideSection>
          <PackageSources config={config} />
        </div>
      </div>
    </article>
  );
}
