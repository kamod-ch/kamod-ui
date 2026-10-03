import { BookOpenIcon, BugIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import type { ShowcaseBlock } from "./BlockShowcase";
import { blockIssueUrl, blockSourceUrl } from "./block-links";

/** Quiet reference shortcuts; setup and source-browser links stay in the prompt's text. */
export function BlockPromptLinks({ block }: { block: ShowcaseBlock }) {
  const source = blockSourceUrl(block.category, block.id);
  const links = [
    { label: "Refine component styles", href: withBasePath("/blocks/styles"), Icon: BookOpenIcon },
    {
      label: "Explore theming and Tailwind",
      href: withBasePath("/docs/theming/installation"),
      Icon: PaletteIcon,
    },
    { label: "View this block on GitHub", href: source, Icon: BrandGithubIcon, external: true },
    {
      label: "Report an issue with this block",
      href: blockIssueUrl(block.title, source, "Block"),
      Icon: BugIcon,
      external: true,
    },
  ];
  return (
    <nav class="blocks-prompt-links" aria-label="Prompt references">
      {links.map(({ label, href, Icon, external }) => (
        <Tooltip key={href}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              href={href}
              aria-label={external ? `${label} (opens in a new tab)` : label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon size={16} aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" sideOffset={6}>
            {label}
            {external ? " (opens in a new tab)" : ""}
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
