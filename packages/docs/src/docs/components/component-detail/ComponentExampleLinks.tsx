import { BugIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { repositoryUrl } from "../../../blocks/block-links";
import { componentSourceUrl } from "./component-guidance";

/** Shared source and issue links beside every component/form showcase heading. */
export function ComponentExampleLinks({
  slug,
  title,
  index,
}: {
  slug: string;
  title: string;
  index: number;
}) {
  const source = componentSourceUrl(slug);
  const report = new URLSearchParams({
    title: `bug(${slug}): example ${index + 1} — `,
    body: `Component: ${title}\nExample: ${index + 1}\nSource: ${source}\n\n### What happened?\n\n### Steps to reproduce\n\n1. \n\n### Expected behavior\n\n### Browser and screen size\n\n`,
  });
  return (
    <div class="component-example-links" role="group" aria-label="Example source and feedback">
      <Button
        variant="ghost"
        size="icon-sm"
        href={`${repositoryUrl}/issues/new?${report}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Report a bug with ${title} example ${index + 1} (opens in a new tab)`}
        title="Report a bug on GitHub"
      >
        <BugIcon size={16} aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} source on GitHub (opens in a new tab)`}
        title="View source on GitHub"
      >
        <BrandGithubIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
