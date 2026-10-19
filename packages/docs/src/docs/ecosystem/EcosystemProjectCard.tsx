import { ArrowUpRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, Card, CardContent, CardFooter, CardHeader } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../components/InlineCodeLink";
import type { FoundationProject } from "./foundation-projects";

type ProjectLink = { text: string; href: string };

/** Static project summary; prose HTML is supplied by the trusted Markdown renderer. */
export function EcosystemProjectCard({
  title,
  Icon,
  name,
  href,
  role,
  description,
  guide,
  source,
  foundation,
}: {
  title: string;
  Icon: typeof BookOpenIcon;
  name: string;
  href: string;
  role: string;
  description: string;
  guide: ProjectLink;
  source: ProjectLink;
  foundation?: FoundationProject;
}) {
  const id = `ecosystem-${name.replace("@kamod-ch/", "")}`;
  return (
    <Card
      size="sm"
      class={`ecosystem-project${foundation ? " ecosystem-foundation-project" : ""}`}
      role="group"
      aria-labelledby={id}
    >
      <CardHeader>
        <div class="ecosystem-project-heading">
          <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
          <h3 id={id}>{title}</h3>
          {foundation && (
            <span class="ecosystem-project-context">
              <span aria-hidden="true">·</span>
              <span dangerouslySetInnerHTML={{ __html: role }} />
            </span>
          )}
        </div>
        {foundation ? (
          <ProjectLinks title={title} guide={guide} source={source} compact />
        ) : (
          <p class="ecosystem-project-role" dangerouslySetInnerHTML={{ __html: role }} />
        )}
      </CardHeader>
      <CardContent>
        {!foundation && (
          <InlineCodeLink href={href} size="compact">
            {name}
          </InlineCodeLink>
        )}
        <p
          class="ecosystem-project-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {foundation && (
          <dl class="ecosystem-project-details">
            <div>
              <dt>Start with</dt>
              <dd class="ecosystem-project-examples">
                {foundation.examples.map(({ label, href }) => (
                  <a key={label} href={href.startsWith("/") ? withBasePath(href) : href}>
                    <code>{label}</code>
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt>You own</dt>
              <dd>{foundation.ownership}</dd>
            </div>
          </dl>
        )}
      </CardContent>
      <CardFooter>
        {foundation ? (
          <>
            <div class="ecosystem-project-package">
              <InlineCodeLink href={href} size="compact">
                {name}
              </InlineCodeLink>
              <span class="ecosystem-project-delivery">
                <span aria-hidden="true">·</span>
                {foundation.delivery}
              </span>
            </div>
            <span class="ecosystem-project-detail">
              <foundation.Icon size={13} strokeWidth={1.75} aria-hidden="true" />
              {foundation.detail}
            </span>
          </>
        ) : (
          <ProjectLinks title={title} guide={guide} source={source} />
        )}
      </CardFooter>
    </Card>
  );
}

/** The same destinations remain available as labeled links or compact, named header actions. */
function ProjectLinks({
  title,
  guide,
  source,
  compact = false,
}: {
  title: string;
  guide: ProjectLink;
  source: ProjectLink;
  compact?: boolean;
}) {
  const guideLabel = `Open ${title} guide`;
  const sourceLabel = `View ${title} source on GitHub (opens in a new tab)`;
  return (
    <div class="ecosystem-project-links" role="group" aria-label={`${title} references`}>
      <Button
        class="docs-icon-button ecosystem-project-guide"
        variant="ghost"
        size={compact ? "icon-sm" : "sm"}
        href={guide.href.startsWith("/") ? withBasePath(guide.href) : guide.href}
        aria-label={compact ? guideLabel : undefined}
        data-tooltip={compact ? guideLabel : undefined}
      >
        <BookOpenIcon class="size-3.5" size={14} aria-hidden="true" />
        {!compact && guide.text}
        {!compact && <ArrowUpRightIcon class="size-3" size={12} aria-hidden="true" />}
      </Button>
      <Button
        class="docs-icon-button"
        variant="ghost"
        size={compact ? "icon-sm" : "sm"}
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compact ? sourceLabel : undefined}
        data-tooltip={compact ? sourceLabel : undefined}
      >
        <BrandGithubIcon class="size-3.5" size={14} aria-hidden="true" />
        {!compact && source.text}
      </Button>
    </div>
  );
}
