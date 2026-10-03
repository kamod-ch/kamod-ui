import { ArrowUpRightIcon, BookOpenIcon, PackageIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";

/** Compact destinations keep the introduction focused on the guide itself. */
export function PackageResources({ config }: { config: PackageTeaserConfig }) {
  const resources = [
    { label: "Live docs", href: config.externalDocsUrl, Icon: BookOpenIcon },
    { label: "GitHub", href: config.githubUrl, Icon: BrandGithubIcon },
    { label: "npm", href: config.npmUrl, Icon: PackageIcon },
  ];
  return (
    <nav class="package-guide-resources" aria-label="Package resources">
      <code>{config.packagePath}</code>
      <div>
        {resources.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">
            <Icon size={15} aria-hidden="true" />
            {label}
            <ArrowUpRightIcon size={12} aria-hidden="true" />
            <span class="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
