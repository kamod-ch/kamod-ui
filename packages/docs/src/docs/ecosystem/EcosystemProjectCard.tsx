import { ArrowUpRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, Card, CardContent, CardFooter, CardHeader } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { InlineCodeLink } from "../components/InlineCodeLink";

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
}: {
  title: string;
  Icon: typeof BookOpenIcon;
  name: string;
  href: string;
  role: string;
  description: string;
  guide: { text: string; href: string };
  source: { text: string; href: string };
}) {
  const id = `ecosystem-${name.replace("@kamod-ch/", "")}`;
  return (
    <Card size="sm" class="ecosystem-project" role="group" aria-labelledby={id}>
      <CardHeader>
        <div class="ecosystem-project-heading">
          <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
          <h3 id={id}>{title}</h3>
        </div>
        <p class="ecosystem-project-role" dangerouslySetInnerHTML={{ __html: role }} />
      </CardHeader>
      <CardContent>
        <InlineCodeLink href={href} size="compact">
          {name}
        </InlineCodeLink>
        <p
          class="ecosystem-project-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
      <CardFooter>
        <Button
          class="docs-icon-button ecosystem-project-guide"
          variant="ghost"
          size="sm"
          href={guide.href.startsWith("/") ? withBasePath(guide.href) : guide.href}
        >
          <BookOpenIcon class="size-3.5" size={14} aria-hidden="true" />
          {guide.text}
          <ArrowUpRightIcon class="size-3" size={12} aria-hidden="true" />
        </Button>
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="sm"
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandGithubIcon class="size-3.5" size={14} aria-hidden="true" />
          {source.text}
        </Button>
      </CardFooter>
    </Card>
  );
}
