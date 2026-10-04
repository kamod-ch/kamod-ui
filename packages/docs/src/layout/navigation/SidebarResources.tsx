import { ArrowUpRightIcon, BugIcon, GitPullRequestIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { repositoryUrl } from "../../blocks/block-links";

/** Persistent project links below the independently scrolling desktop directory. */
export function SidebarResources() {
  return (
    <div class="docs-sidebar-resources" role="group" aria-label="Contribute to Kamod UI">
      <a
        class="docs-sidebar-repository"
        href={repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kamod UI on GitHub (opens in a new tab)"
      >
        <span class="docs-sidebar-repository-icon">
          <BrandGithubIcon size={18} aria-hidden="true" />
        </span>
        <span>
          <strong>Kamod UI on GitHub</strong>
          <small>Explore the source. Make it yours.</small>
        </span>
        <ArrowUpRightIcon size={14} aria-hidden="true" />
      </a>
      <div class="docs-sidebar-resource-actions">
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="sm"
          href={`${repositoryUrl}/issues/new/choose`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Report a bug on GitHub (opens in a new tab)"
        >
          <BugIcon size={14} aria-hidden="true" />
          Report a bug
        </Button>
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="sm"
          href={`${repositoryUrl}/blob/main/CONTRIBUTING.md`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read the contribution guide on GitHub (opens in a new tab)"
        >
          <GitPullRequestIcon size={14} aria-hidden="true" />
          Contribute
        </Button>
      </div>
    </div>
  );
}
