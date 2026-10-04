import { BookOpenIcon, RocketIcon, SwatchBookIcon } from "@kamod-ch/icons/lucide";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";

/** Shared guide shortcuts for the Code and Prompt headers, including the local setup anchor. */
export function ShowcaseGuideLinks({ setupHref, label }: { setupHref: string; label: string }) {
  const links = [
    {
      label: "Refine component styles",
      href: withBasePath("/blocks/styles"),
      Icon: BookOpenIcon,
    },
    {
      label: "Explore theming and Tailwind",
      href: withBasePath("/docs/theming/installation"),
      Icon: SwatchBookIcon,
    },
    {
      label: "Setup guide",
      href: setupHref,
      Icon: RocketIcon,
    },
  ];
  return (
    <nav class="blocks-prompt-links" aria-label={label}>
      {links.map(({ label, href, Icon }) => (
        <Tooltip key={href}>
          <TooltipTrigger asChild>
            <Button
              class="docs-icon-button"
              variant="ghost"
              size="icon-sm"
              href={href}
              aria-label={label}
            >
              <Icon size={16} aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" sideOffset={6}>
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
