import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { LibraryJumpLinks } from "../LibraryJumpLinks";
import { LibraryPageHeader } from "../LibraryPageHeader";
import { PackageResources } from "./PackageResources";
import { packageGuideNotes } from "./package-guide-notes";

/** Formats existing package prose without changing its wording or punctuation. */
export function PackageText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(
          /(@[\w-]+\/[\w./-]+|\b(?:use[A-Z]\w*|create[A-Z]\w*|persistedSignal|I18nProvider|Intl(?:\.\w+)?|currentColor|aria-hidden|aria-label)\b|\.value|\.match\(\))/g,
        )
        .map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part))}
    </>
  );
}

/** Preserves package resources within the shared library introduction. */
export function PackageGuideHeader({
  config,
  renderMarkdownAction,
}: {
  config: PackageTeaserConfig;
  renderMarkdownAction: () => ComponentChildren;
}) {
  const notes = packageGuideNotes[config.slug];
  return (
    <LibraryPageHeader
      parent={{ label: "Packages", href: "/docs/packages" }}
      label={config.title}
      eyebrow={config.eyebrow}
      focus="Install · Compose · Explore"
      title={config.headline}
      description={
        <>
          <p>
            <PackageText text={config.lead} />
          </p>
          <p>
            {notes.introduction} Pair it with the{" "}
            <a href={withBasePath("/docs/components")}>component library</a> when building your
            interface.
          </p>
        </>
      }
    >
      <PackageResources config={config} markdown={renderMarkdownAction()} />
      <LibraryJumpLinks
        class="block-guide-switcher"
        label="Package sections"
        reference={{ label: "Full documentation", href: config.externalDocsUrl, external: true }}
      >
        <li>
          <a href="#installation">Installation</a>
        </li>
        <li>
          <a href="#usage">Usage</a>
        </li>
        <li>
          <a href="#integration">Integration</a>
        </li>
      </LibraryJumpLinks>
    </LibraryPageHeader>
  );
}
