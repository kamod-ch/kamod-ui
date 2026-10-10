import { BookOpenIcon, PackageIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { PathDisplay } from "../PathDisplay";

/** Compact destinations keep the introduction focused on the guide itself. */
export function PackageResources({ config }: { config: PackageTeaserConfig }) {
  const resources = [
    {
      label: "Live Docs",
      href: config.externalDocsUrl,
      Icon: BookOpenIcon,
      help: "Explore the full documentation and examples.",
    },
    {
      label: "GitHub",
      href: config.githubUrl,
      Icon: BrandGithubIcon,
      help: "Browse the source, releases and issues on GitHub.",
    },
    {
      label: "npm",
      href: config.npmUrl,
      Icon: PackageIcon,
      help: "Find published versions and installation details on npm.",
    },
  ];
  return (
    <nav class="package-guide-resources" aria-label="Package resources">
      <div class="package-guide-identity">
        <strong class="package-guide-identity-heading">Package Details</strong>
        <PathDisplay path={config.packagePath} />
      </div>
      <div class="package-guide-resource-actions">
        {resources.map(({ label, href, Icon, help }) => (
          <a
            key={label}
            class="docs-icon-button package-guide-resource-action"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
            data-reference-title={label}
            data-reference-path={config.packagePath}
            data-reference-description={`${help} The original link opens in a new tab.`}
          >
            <Icon size={16} aria-hidden="true" />
            <span class="package-guide-resource-label">{linkTitle(label)}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
