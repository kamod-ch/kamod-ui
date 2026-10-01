/** Category navigation and project resources at the end of a block guide. */
import { ArrowLeftIcon, BugIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import type { BlockCategory } from "../block-categories";
import { repositoryUrl } from "../block-links";
import type { BlockGuideIdentity } from "./types";

export const BlockGuideFooter = ({
  block,
  category,
}: {
  block: BlockGuideIdentity;
  category: BlockCategory;
}) => (
  <footer class="blocks-doc-footer">
    <a
      href={withBasePath(`/blocks/${category}`)}
      aria-label={`Explore ${category === "application-shell" ? "application shells" : `${category} blocks`}`}
    >
      <ArrowLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
      <span class="blocks-doc-footer-long" aria-hidden="true">
        Explore {category === "application-shell" ? "application shells" : `${category} blocks`}
      </span>
      <span class="blocks-doc-footer-short" aria-hidden="true">
        Explore
      </span>
    </a>
    <nav class="blocks-doc-footer-actions" aria-label="Project resources">
      <Button
        variant="ghost"
        size="icon"
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Kamod UI on GitHub (opens in a new tab)"
        title="Kamod UI on GitHub"
      >
        <BrandGithubIcon size={16} aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        href={`${repositoryUrl}/issues/new`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Report an issue on GitHub (opens in a new tab)"
        title="Report an issue on GitHub"
      >
        <BugIcon
          size={16}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      </Button>
    </nav>
    <a href={`#${block.id}`} aria-label="Back to showcase">
      <span class="blocks-doc-footer-long" aria-hidden="true">
        Back to showcase
      </span>
      <span class="blocks-doc-footer-short" aria-hidden="true">
        Showcase
      </span>
      <span aria-hidden="true">↑</span>
    </a>
  </footer>
);
