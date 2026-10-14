import { ArrowUpRightIcon, BugPlayIcon, GitForkIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, Card, CardContent, CardFooter, CardHeader, Separator } from "@kamod-ch/ui";
import { Fragment } from "preact";

const sourceLinks = [
  {
    label: "Explore the UI source",
    href: "https://github.com/kamod-ch/kamod-ui",
    Icon: GitForkIcon,
  },
  {
    label: "Find or report an issue",
    href: "https://github.com/kamod-ch/kamod-ui/issues",
    Icon: BugPlayIcon,
  },
];

/** A compact repository handoff; description HTML comes from the trusted guide renderer. */
export function EcosystemSourceCard({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Card class="ecosystem-source" size="sm">
      <CardHeader class="ecosystem-source-header">
        <BrandGithubIcon size={20} aria-hidden="true" />
        <h3>{title}</h3>
        <span class="ecosystem-source-context">
          <span aria-hidden="true">·</span>
          <span>Source, releases and conversations</span>
        </span>
      </CardHeader>
      <CardContent>
        <p class="ecosystem-source-description" dangerouslySetInnerHTML={{ __html: description }} />
      </CardContent>
      <Separator decorative class="ecosystem-source-rule" />
      <CardFooter class="ecosystem-source-footer">
        <Button
          class="docs-icon-button ecosystem-source-action"
          variant="ghost"
          size="sm"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandGithubIcon class="size-3.5" size={14} aria-hidden="true" />
          All Repositories
          <ArrowUpRightIcon class="size-3" size={12} aria-hidden="true" />
        </Button>
        <div class="ecosystem-source-links" role="group" aria-label="UI source and issues">
          {sourceLinks.map(({ label, href, Icon }, index) => (
            <Fragment key={href}>
              {index > 0 && (
                <span class="ecosystem-source-slash" aria-hidden="true">
                  /
                </span>
              )}
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
                <ArrowUpRightIcon size={12} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </Fragment>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
