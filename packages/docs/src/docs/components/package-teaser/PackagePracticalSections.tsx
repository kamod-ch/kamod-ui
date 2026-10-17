import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { LibraryGuideSection } from "../LibraryGuideSection";
import { PackageText } from "./PackageGuideHeader";
import { packageGuidePractices } from "./package-guide-practices";

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
