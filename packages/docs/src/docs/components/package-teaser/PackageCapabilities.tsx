import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { PackageText } from "./PackageGuideHeader";
import { packageGuideDetails } from "./package-guide-details";
import { packageGuidePractices } from "./package-guide-practices";

export const packageFeatureId = (title: string) =>
  `capability-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Pairs a capability's definition with concrete guidance; facts remain supporting context. */
export function PackageCapabilities({ config }: { config: PackageTeaserConfig }) {
  const details = packageGuideDetails[config.slug];
  return (
    <>
      <div class="block-guide-prose">
        <p>{details.purpose}</p>
      </div>
      <h3 id="choose-your-approach" tabIndex={-1}>
        <BlockHeadingLink id="choose-your-approach">Choose the Right Approach</BlockHeadingLink>
      </h3>
      <div class="package-guide-decisions">
        {packageGuidePractices[config.slug].choices.map(({ need, approach, boundary }) => (
          <div class="package-guide-decision" key={need}>
            <strong>{linkTitle(need)}</strong>
            <div class="block-guide-prose">
              <p>
                <PackageText text={approach} />
              </p>
              <p class="package-guide-boundary">
                <PackageText text={boundary} />
              </p>
            </div>
          </div>
        ))}
      </div>
      <div class="package-guide-capabilities">
        {config.features.map(({ title, text }, index) => (
          <div key={title} class="package-guide-feature">
            <div class="block-guide-prose">
              <h3 id={packageFeatureId(title)} tabIndex={-1}>
                <BlockHeadingLink id={packageFeatureId(title)}>{title}</BlockHeadingLink>
              </h3>
              <p>
                <PackageText text={text} />
              </p>
              <p>
                <PackageText text={details.features[index]} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
