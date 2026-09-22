/**
 * @file Shared requirement marker for the Application Shell setup and API guide.
 * Uses the core Tooltip for pointer, keyboard and touch help. Tooltip renders a
 * div, so inline prose containing this marker should use a styled ARIA paragraph.
 */
import { CodeAsteriskIcon } from "@kamod-ch/icons/tabler/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui";
import { useState } from "preact/hooks";

/** Accessible name, contextual help and placement within the surrounding documentation. */
type RequiredIndicatorProps = {
  /** Names the specific requirement for keyboard and screen-reader users. */
  label: string;
  /** Visible tooltip text; defaults to the contextual accessible name. */
  tooltip?: string;
  /** Align inward at card edges to keep the tooltip readable on narrow screens. */
  align?: "start" | "center" | "end";
  /** Use bottom inside code panels, where disclosure overflow clips top tooltips. */
  side?: "top" | "bottom";
};

/** Compact requirement marker with hover/focus help, tap activation and Escape dismissal. */
export const RequiredIndicator = ({
  label,
  tooltip = label,
  align = "center",
  side = "top",
}: RequiredIndicatorProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen} class="blocks-api-required-tooltip">
      <TooltipTrigger asChild>
        <button
          type="button"
          class="blocks-api-required"
          aria-label={label}
          onClick={() => setOpen(true)}
        >
          <CodeAsteriskIcon size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={6} align={align}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
