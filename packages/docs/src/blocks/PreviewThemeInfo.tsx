/** Compact snapshot guidance with viewport-aware positioning and core dismissal behavior. */
import { ArrowUpRightIcon, InfoIcon } from "@kamod-ch/icons/lucide";
import {
  Badge,
  Button,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { repositoryUrl } from "./block-links";
import { usePreviewGuidePosition } from "./use-preview-guide-position";

/** A persistent, wrapping explanation for pointer, keyboard and touch activation. */
export function PreviewThemeInfo() {
  // Stable IDs keep the trigger and panel connected across SSR hydration.
  const id = useId();
  return (
    <Popover>
      <Button class="docs-icon-button" asChild variant="ghost" size="icon-xs">
        <PopoverTrigger
          id={`${id}-trigger`}
          aria-controls={`${id}-content`}
          aria-label="About preview themes"
        >
          <InfoIcon size={13} strokeWidth={1.75} aria-hidden="true" />
        </PopoverTrigger>
      </Button>
      <PopoverContent
        id={`${id}-content`}
        aria-labelledby={`${id}-title`}
        class="blocks-preview-theme-info"
        side="top"
        align="end"
        sideOffset={0}
      >
        <PreviewGuideBody id={id} />
      </PopoverContent>
    </Popover>
  );
}

/** Mount positioning only while the core Popover renders its content. */
function PreviewGuideBody({ id }: { id: string }) {
  usePreviewGuidePosition(id);
  return (
    <>
      <div class="blocks-preview-theme-info-heading">
        <PopoverTitle id={`${id}-title`}>Preview guide</PopoverTitle>
        <span class="blocks-preview-theme-info-dot" aria-hidden="true">
          ·
        </span>
        <Badge variant="primary" size="xs">
          Snapshots
        </Badge>
      </div>
      <PopoverClose class="docs-icon-button" aria-label="Close preview guide" />
      <PopoverDescription>
        Gallery previews use the <code>Kamod</code> theme and follow your <code>light</code> or{" "}
        <code>dark</code> mode. These{" "}
        <a
          class="blocks-preview-theme-info-link"
          href={`${repositoryUrl}/blob/main/packages/docs/scripts/BLOCK-PREVIEW-IMAGES.md`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="How preview images are generated (opens in a new tab)"
        >
          saved images <ArrowUpRightIcon size={10} strokeWidth={1.75} aria-hidden="true" />
        </a>{" "}
        keep collections quick to browse without loading every live demo.
      </PopoverDescription>
      <PopoverDescription class="blocks-preview-theme-info-hint">
        Screenshots show the layout. Open any block to try the real interactions.
      </PopoverDescription>
    </>
  );
}
