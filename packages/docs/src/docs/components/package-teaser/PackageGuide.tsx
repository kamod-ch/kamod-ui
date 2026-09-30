import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { BlockGuideContents } from "../../../blocks/detail/BlockGuideContents";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import type { DocContentsSection, DocRenderMainContext } from "../../types";
import { CodeBlock } from "../CodeBlock";
import { LibraryGuideSection } from "../LibraryGuideSection";
import { PackageGuideHeader, PackageText } from "./PackageGuideHeader";
import { packageGuideNotes } from "./package-guide-notes";

const featureId = (title: string) =>
  `capability-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export function packageGuideContents(config: PackageTeaserConfig): DocContentsSection[] {
  return [
    {
      id: "capabilities",
      label: "What the package brings",
      children: config.features.map(({ title }) => ({ id: featureId(title), label: title })),
    },
    {
      id: "installation",
      label: "Installation",
      children: [{ id: "check-your-environment", label: "Check your environment" }],
    },
    { id: "usage", label: "Usage" },
    { id: "integration", label: "Integrate with your application" },
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
  ];
}

/** All five companion packages retain their source content inside the shared guide layout. */
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
  const sections = context.sections.flatMap((section) =>
    section.id === "usage"
      ? [section, { id: "integration", title: "Integrate with your application", text: "" }]
      : [section],
  );
  return (
    <article class="block-guide package-guide" id="top">
      <PackageGuideHeader config={config} renderMarkdownAction={context.renderMarkdownAction} />
      <BlockGuideContents id={`${config.slug}-mobile-contents`} sections={contents} mobile />
      <div class="block-guide-documentation">
        <div class="blocks-doc-body">
          <LibraryGuideSection id="capabilities" title="What the package brings">
            <dl class="package-guide-stats">
              {config.stats.map(({ value, label }) => (
                <div key={label}>
                  <dt>{value}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
            <div class="block-guide-prose">
              {config.features.map(({ title, text }) => (
                <div key={title} class="package-guide-feature">
                  <h3 id={featureId(title)} tabIndex={-1}>
                    <BlockHeadingLink id={featureId(title)}>{title}</BlockHeadingLink>
                  </h3>
                  <p>
                    <PackageText text={text} />
                  </p>
                </div>
              ))}
            </div>
          </LibraryGuideSection>
          {sections.map((section) => (
            <LibraryGuideSection key={section.id} id={section.id} title={section.title}>
              {section.text && (
                <div class="block-guide-prose">
                  <p>
                    <PackageText text={section.text} />
                  </p>
                </div>
              )}
              {section.id === "integration" && (
                <div class="block-guide-prose">{notes.integration}</div>
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
                      Use your existing package manager and keep the peer dependencies aligned with
                      your application. Compare <code>package.json</code> and your lockfile with the
                      documentation for the version you install; add the package once at the
                      workspace boundary that uses it.
                    </p>
                    <p>
                      <strong>Keep the first change small.</strong> Start with the usage example,
                      run your project’s typecheck and build, then connect it to a real screen. The{" "}
                      <a href={withBasePath("/docs/packages")}>package overview</a> helps you decide
                      how companion libraries fit together.
                    </p>
                  </div>
                </>
              )}
              {section.id === "usage" && (
                <CodeBlock
                  code={`${config.quickStart.import}\n\n${config.quickStart.usage}`}
                  language="tsx"
                  filePath="src/example.tsx"
                />
              )}
              {section.id === "api-reference" && (
                <div class="block-guide-prose">
                  <p>
                    <a href={config.externalDocsUrl} target="_blank" rel="noopener noreferrer">
                      Full API reference on live docs
                    </a>
                  </p>
                  <h3 id="explore-the-package" tabIndex={-1}>
                    <BlockHeadingLink id="explore-the-package">
                      {config.externalCtaTitle}
                    </BlockHeadingLink>
                  </h3>
                  <p>{config.externalCtaDescription}</p>
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
                      Review the result with <strong>real content and keyboard input</strong>. Keep
                      visible labels, loading and error feedback, and focus behavior in sync with
                      the state your application exposes.
                    </p>
                  </div>
                </>
              )}
            </LibraryGuideSection>
          ))}
        </div>
      </div>
    </article>
  );
}
