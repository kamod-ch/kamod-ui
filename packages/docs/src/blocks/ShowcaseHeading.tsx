import { InfoIcon, MousePointerClickIcon } from "@kamod-ch/icons/lucide";
import { Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";

/** Shared heading, hint and help treatment for galleries and interactive examples. */
export function ShowcaseHeading({
  href,
  title = "Interactive Live Preview",
  description = "Try it. Make it yours.",
  infoLabel = "About the interactive preview",
  infoText = "Try the live interactions, adjust the preview theme, then open Code to copy the example.",
}: {
  href?: string;
  title?: string;
  description?: string;
  infoLabel?: string;
  infoText?: string;
}) {
  const heading = (
    <strong>
      <MousePointerClickIcon size={16} strokeWidth={1.75} aria-hidden="true" />
      <span>{title}</span>
    </strong>
  );
  return (
    <div class="showcase-heading">
      {href ? (
        <a class="showcase-heading-link" href={href}>
          {heading}
        </a>
      ) : (
        heading
      )}
      <div class="showcase-heading-hint">
        <span class="showcase-heading-separator" aria-hidden="true">
          ·
        </span>
        <span class="showcase-heading-description">{description}</span>
        <Tooltip class="shrink-0">
          <TooltipTrigger asChild>
            <button type="button" class="showcase-heading-info" aria-label={infoLabel}>
              <InfoIcon size={13} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            {infoText}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
