import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { LibraryJumpLinks } from "../LibraryJumpLinks";
import { LibraryPageHeader } from "../LibraryPageHeader";
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
      <div class="package-guide-resources">
        <code>{config.packagePath}</code>
        <div role="group" aria-label="Package resources">
          <Button
            variant="ghost"
            size="sm"
            href={config.externalDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open live docs <ArrowUpRightIcon size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            href={config.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BrandGithubIcon size={14} aria-hidden="true" /> GitHub
          </Button>
          <Button
            variant="ghost"
            size="sm"
            href={config.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </Button>
          {renderMarkdownAction()}
        </div>
      </div>
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
