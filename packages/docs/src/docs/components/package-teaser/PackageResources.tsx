import { ArrowUpRightIcon, BookOpenIcon, PackageIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import type { ComponentChildren } from "preact";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";

/** Groups external destinations by intent; the Markdown action remains local to this guide. */
export function PackageResources({
  config,
  markdown,
}: {
  config: PackageTeaserConfig;
  markdown: ComponentChildren;
}) {
  const resources = [
    {
      title: "Learn the API",
      description: "Full guides, examples and package-specific behavior.",
      action: "Open live docs",
      href: config.externalDocsUrl,
      Icon: BookOpenIcon,
    },
    {
      title: "Explore the source",
      description: "Read the implementation, follow changes or report an issue.",
      action: "GitHub",
      href: config.githubUrl,
      Icon: BrandGithubIcon,
    },
    {
      title: "Check the package",
      description: "Review published versions and installation details.",
      action: "npm",
      href: config.npmUrl,
      Icon: PackageIcon,
    },
  ];
  return (
    <div class="package-guide-resources" role="group" aria-label="Package resources">
      <div class="package-guide-resource-heading">
        <span>Resources for your next step</span>
        <code>{config.packagePath}</code>
      </div>
      <div class="package-guide-resource-grid">
        {resources.map(({ title, description, action, href, Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            class="package-guide-resource"
          >
            <Icon size={18} aria-hidden="true" />
            <strong>{title}</strong>
            <p>{description}</p>
            <span class="package-guide-resource-action">
              {action}
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
      <div class="package-guide-resource-footnote">
        <p>
          <strong>Keep this guide handy.</strong> View the Markdown for a portable text reference.
          Resource links above open in a new tab.
        </p>
        {markdown}
      </div>
    </div>
  );
}
