import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  CheckIcon,
  CompassIcon,
  GitBranchIcon,
  LanguagesIcon,
  LayersIcon,
  LinkIcon,
  MousePointerClickIcon,
  PackageIcon,
  ZapIcon,
} from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { LibraryGuideSection } from "../LibraryGuideSection";
import { PathDisplay } from "../PathDisplay";
import {
  packageGuideConnections,
  packageGuideHref,
  packageGuideIdentities,
  packageSourceNotices,
  packageSourceResources,
} from "./package-guide-connections";
import { type PackagePractice, packageGuidePractices } from "./package-guide-practices";

const resourceIcons = [BookOpenIcon, GitBranchIcon, PackageIcon];
const companionIcons = {
  "hooks-package": MousePointerClickIcon,
  "icons-package": LayersIcon,
  "i18n-package": LanguagesIcon,
  "signals-package": ZapIcon,
  "state-package": GitBranchIcon,
};

/** A static, shared finish with curated handoffs; no remote fetch or other guide bundles. */
export function PackageSources({ config }: { config: PackageTeaserConfig }) {
  const practice: PackagePractice = packageGuidePractices[config.slug];
  const { companionIntro, companions, next } = packageGuideConnections[config.slug];
  return (
    <LibraryGuideSection id="sources-and-attribution" title="Sources & Attribution">
      <div class="package-guide-sources">
        <div class="block-guide-prose package-source-intro">
          <p>
            This integration guide accompanies{" "}
            <a href={config.githubUrl} target="_blank" rel="noopener noreferrer">
              <PathDisplay as="span" path={config.packagePath} link={false} />
            </a>
            , maintained in the Kamod ecosystem. The{" "}
            <a href={config.externalDocsUrl} target="_blank" rel="noopener noreferrer">
              Dedicated Documentation
            </a>{" "}
            is the reference for package APIs; examples here show how those APIs fit into a Kamod UI
            application.
          </p>
        </div>

        <div class="package-source-desk">
          <header class="package-source-heading">
            <BookOpenIcon size={15} aria-hidden="true" />
            <h3 id="source-resources" tabIndex={-1}>
              <BlockHeadingLink id="source-resources">Keep the source close</BlockHeadingLink>
            </h3>
            <span class="package-source-context">
              <span aria-hidden="true">·</span>
              <span>Look it up, then build</span>
            </span>
          </header>
          <nav class="package-source-links" aria-label="Package source resources">
            {packageSourceResources(config).map(({ title, text, href }, index) => {
              const Icon = resourceIcons[index];
              return (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon size={17} aria-hidden="true" />
                  <span>
                    <strong>{title}</strong>
                    <span class="package-source-description">{text}</span>
                  </span>
                  <ArrowUpRightIcon size={14} aria-hidden="true" />
                </a>
              );
            })}
          </nav>
          <div class="package-source-notices">
            {practice.attribution && (
              <p>
                {practice.attribution.text} See{" "}
                <a href={practice.attribution.href} target="_blank" rel="noopener noreferrer">
                  {linkTitle(practice.attribution.label)}
                </a>{" "}
                for the original project.
              </p>
            )}
            {packageSourceNotices(config).map((notice) => (
              <p key={notice}>{notice}</p>
            ))}
          </div>
        </div>

        <div class="package-source-companions">
          <header class="package-source-heading">
            <LinkIcon size={15} aria-hidden="true" />
            <h3 id="companion-packages" tabIndex={-1}>
              <BlockHeadingLink id="companion-packages">
                Good company for {config.title}
              </BlockHeadingLink>
            </h3>
            <span class="package-source-context">
              <span aria-hidden="true">·</span>
              <span>Three useful connections</span>
            </span>
          </header>
          <p class="package-source-lead">{companionIntro}</p>
          <nav class="package-companions" aria-label="Companion packages">
            {companions.map(({ package: slug, title, text }) => {
              const { title: name, path } = packageGuideIdentities[slug];
              const Icon = companionIcons[slug];
              return (
                <a key={slug} href={withBasePath(packageGuideHref(slug))}>
                  <span class="package-companion-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span class="package-companion-content">
                    <span class="package-companion-heading">
                      <strong>{name}</strong>
                      <span aria-hidden="true">·</span>
                      <span>{title}</span>
                      <code class="package-companion-path" data-inline-code-size="compact">
                        {path}
                      </code>
                    </span>
                    <span class="package-source-description">{text}</span>
                  </span>
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </a>
              );
            })}
          </nav>
        </div>

        <div class="package-source-finish">
          {/* Keep old incoming icon-guide fragments useful after sharing its ending. */}
          {config.slug === "icons-package" && (
            <span id="icons-next-steps" class="package-source-alias" />
          )}
          <header class="package-source-heading">
            <CompassIcon size={15} aria-hidden="true" />
            <h3 id="keep-going" tabIndex={-1}>
              <BlockHeadingLink id="keep-going">{next.title}</BlockHeadingLink>
            </h3>
          </header>
          <p class="package-source-lead">{next.text}</p>
          <p class="package-source-check">
            <CheckIcon size={14} aria-hidden="true" />
            {next.check}
          </p>
          <nav class="package-source-next" aria-label="Continue building">
            <a class="docs-icon-button package-source-action" href={withBasePath(next.href)}>
              {next.label}
              <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
            <span class="package-source-browse">
              <a href={withBasePath("/docs/packages")}>
                All packages
                <ArrowRightIcon size={12} aria-hidden="true" />
              </a>
              <span aria-hidden="true">/</span>
              <a href={withBasePath("/docs/ecosystem")}>
                The wider ecosystem
                <ArrowRightIcon size={12} aria-hidden="true" />
              </a>
            </span>
          </nav>
        </div>
      </div>
    </LibraryGuideSection>
  );
}
