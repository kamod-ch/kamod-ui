import { InfoIcon, MousePointerClickIcon } from "@kamod-ch/icons/lucide";
import { Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";

/** Shared introduction above block, component and form example controls. */
export function ShowcaseHeading({ href }: { href?: string }) {
  const title = (
    <strong>
      <MousePointerClickIcon size={16} strokeWidth={1.75} aria-hidden="true" />
      <span>Interactive Live Preview</span>
    </strong>
  );
  return (
    <div class="showcase-heading">
      {href ? (
        <a class="showcase-heading-link" href={href}>
          {title}
        </a>
      ) : (
        title
      )}
      <div class="showcase-heading-hint">
        <span class="showcase-heading-separator" aria-hidden="true">
          ·
        </span>
        <span class="showcase-heading-description">Try it. Make it yours.</span>
        <Tooltip class="shrink-0">
          <TooltipTrigger asChild>
            <button
              type="button"
              class="showcase-heading-info"
              aria-label="About the interactive preview"
            >
              <InfoIcon size={13} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            Try the live interactions, adjust the preview theme, then open Code to copy the example.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
