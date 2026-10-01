import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { PackageText } from "./PackageGuideHeader";
import { packageGuideDetails } from "./package-guide-details";

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
      <dl class="package-guide-facts" aria-label="Package at a glance">
        {config.stats.map(({ value, label }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div class="package-guide-capabilities">
        {config.features.map(({ title, text }, index) => (
          <div key={title} class="package-guide-feature">
            <span class="package-guide-feature-number" aria-hidden="true">
              0{index + 1}
            </span>
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
