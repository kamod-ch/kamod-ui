import { withBasePath } from "../../../base-path";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { BrandText } from "../brand/BrandText";
import { LibraryPageHeader } from "../LibraryPageHeader";
import { InlineCode } from "../PathDisplay";
import { PackageResources } from "./PackageResources";
import { packageGuideNotes } from "./package-guide-notes";

/** Spaces separators independently without expanding the words in each label. */
function PackageHeaderItems({ text }: { text: string }) {
  return (
    <>
      {text.split(/( · )/).map((part, index) =>
        index % 2 ? (
          <span class="package-guide-eyebrow-separator" key={index}>
            {part}
          </span>
        ) : (
          linkTitle(part)
        ),
      )}
    </>
  );
}

/** Formats existing package prose without changing its wording or punctuation. */
export function PackageText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(
          /(@[\w-]+\/[\w./-]+|\b(?:use[A-Z]\w*|create[A-Z]\w*|persistedSignal|I18nProvider|Intl(?:\.\w+)?|currentColor|aria-hidden|aria-label)\b|\.value|\.match\(\))/g,
        )
        .map((part, index) =>
          index % 2 ? (
            <InlineCode key={index}>{part}</InlineCode>
          ) : (
            <BrandText key={index}>{part}</BrandText>
          ),
        )}
    </>
  );
}

/** Preserves package resources within the shared library introduction. */
export function PackageGuideHeader({ config }: { config: PackageTeaserConfig }) {
  const notes = packageGuideNotes[config.slug];
  return (
    <LibraryPageHeader
      parent={{ label: "Packages", href: "/docs/packages" }}
      label={config.title}
      eyebrow={<PackageHeaderItems text={config.eyebrow} />}
      title={config.headline}
      description={
        <>
          <p>
            <PackageText text={config.lead} />
          </p>
          <p>
            {notes.introduction} Pair it with the{" "}
            <a href={withBasePath("/docs/components")}>Component Library</a> when building your
            interface. Continue with the{" "}
            <a href={config.externalDocsUrl} target="_blank" rel="noopener noreferrer">
              Full Documentation
            </a>{" "}
            for the complete package reference.
          </p>
        </>
      }
    >
      <PackageResources config={config} />
    </LibraryPageHeader>
  );
}
