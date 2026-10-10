import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { LibraryGuideSection } from "../LibraryGuideSection";
import { PathDisplay } from "../PathDisplay";
import { PackageText } from "./PackageGuideHeader";
import { type PackagePractice, packageGuidePractices } from "./package-guide-practices";

export function PackageOwnership({ config }: { config: PackageTeaserConfig }) {
  const practice = packageGuidePractices[config.slug];
  return (
    <div class="block-guide-prose">
      <h3 id="state-and-lifetime" tabIndex={-1}>
        <BlockHeadingLink id="state-and-lifetime">Choose the Owner and Lifetime</BlockHeadingLink>
      </h3>
      <p>
        <PackageText text={practice.ownership} />
      </p>
      <h3 id="environment-boundaries" tabIndex={-1}>
        <BlockHeadingLink id="environment-boundaries">Account for the Environment</BlockHeadingLink>
      </h3>
      <p>
        <PackageText text={practice.environment} />
      </p>
      <p>
        <strong>Connect the Pieces.</strong>{" "}
        <a href={withBasePath(practice.related.href)}>{linkTitle(practice.related.label)}</a> —{" "}
        {practice.related.reason}
      </p>
    </div>
  );
}

export function PackageTroubleshooting({ config }: { config: PackageTeaserConfig }) {
  return (
    <LibraryGuideSection id="troubleshooting" title="When Something Behaves Differently">
      <div class="block-guide-prose">
        <p>
          Start with the smallest failing interaction. Compare a fresh page with the same page after
          a change or reload, and keep the package version in your reproduction.
        </p>
      </div>
      <dl class="package-guide-troubleshooting">
        {packageGuidePractices[config.slug].failures.map(({ symptom, check }) => (
          <div key={symptom}>
            <dt>{symptom}</dt>
            <dd>
              <PackageText text={check} />
            </dd>
          </div>
        ))}
      </dl>
      <div class="block-guide-prose">
        <p>
          If the behavior still differs from the documented API,{" "}
          <a href={`${config.githubUrl}/issues`} target="_blank" rel="noopener noreferrer">
            Check Existing Issues
          </a>{" "}
          before opening a report. Include the expected result, actual result, package version and a
          small reproduction without private application data.
        </p>
      </div>
    </LibraryGuideSection>
  );
}

export function PackageSources({ config }: { config: PackageTeaserConfig }) {
  const practice: PackagePractice = packageGuidePractices[config.slug];
  return (
    <LibraryGuideSection id="sources-and-attribution" title="Sources & Attribution">
      <div class="block-guide-prose">
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
        {practice.attribution && (
          <p>
            {practice.attribution.text} See{" "}
            <a href={practice.attribution.href} target="_blank" rel="noopener noreferrer">
              {linkTitle(practice.attribution.label)}
            </a>{" "}
            for the original project.
          </p>
        )}
        {config.slug === "icons-package" && (
          <p>
            Icon artwork can carry its own upstream notices. Check the selected family’s source and
            license information in the repository before redistributing assets; the package’s
            license does not replace notices attached to individual icon sets.
          </p>
        )}
        <p>
          When copying or distributing source, retain the applicable license and attribution notices
          from the version you use. Check{" "}
          <a href={config.npmUrl} target="_blank" rel="noopener noreferrer">
            The Published Package
          </a>{" "}
          alongside your lockfile when comparing an example with a newer release.
        </p>
      </div>
    </LibraryGuideSection>
  );
}
