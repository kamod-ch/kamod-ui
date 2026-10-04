import {
  ArrowUpRightIcon,
  BookOpenIcon,
  BugIcon,
  GitPullRequestIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { SheetClose } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { repositoryUrl } from "../../blocks/block-links";
import { GithubRepoLink } from "../GithubRepoLink";

/** Compact project resources and contribution links beneath the scrolling mobile directory. */
export function NavigationFooter() {
  return (
    <footer class="site-navigation-footer">
      <a
        class="site-navigation-project"
        href={repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kamod UI repository on GitHub"
      >
        <span class="site-navigation-project-icon">
          <BrandGithubIcon size={19} aria-hidden="true" />
        </span>
        <span>
          <strong>Make it yours.</strong>
          <small>Explore the source on GitHub</small>
        </span>
        <ArrowUpRightIcon size={15} aria-hidden="true" />
      </a>
      <div class="site-navigation-footer-bottom">
        <nav class="site-navigation-secondary-links" aria-label="Useful links">
          <SheetClose asChild>
            <a href={withBasePath("/docs/theming/css-setup")}>
              <BookOpenIcon size={15} aria-hidden="true" />
              CSS setup
            </a>
          </SheetClose>
          <a href={`${repositoryUrl}/issues/new/choose`} target="_blank" rel="noopener noreferrer">
            <BugIcon size={15} aria-hidden="true" />
            Feedback
          </a>
        </nav>
        <div class="site-navigation-footer-actions">
          <a
            class="docs-icon-button site-icon-button"
            href={`${repositoryUrl}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contribute to Kamod UI (opens in a new tab)"
            title="Contribute to Kamod UI"
          >
            <GitPullRequestIcon size={17} aria-hidden="true" />
          </a>
          <GithubRepoLink />
        </div>
      </div>
    </footer>
  );
}
