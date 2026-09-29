import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import {
  SaveStatusDirtyIcon,
  SaveStatusErrorIcon,
  SaveStatusOfflineIcon,
  SaveStatusPristineIcon,
  SaveStatusSavedIcon,
  SaveStatusSavingIcon,
} from "./SaveStatusIcons";
import type { SaveStatusProps, SaveStatusState } from "./save-status-types";
import {
  formatSaveStatusDateTime,
  resolveSaveStatusDisplay,
  toSaveStatusDateTime,
} from "./save-status-utils";
import { saveStatusLabel, saveStatusRoot } from "./save-status-variants";

const statusIcon = (status: SaveStatusState) => {
  switch (status) {
    case "pristine":
      return <SaveStatusPristineIcon />;
    case "dirty":
      return <SaveStatusDirtyIcon />;
    case "saving":
      return <SaveStatusSavingIcon />;
    case "saved":
      return <SaveStatusSavedIcon />;
    case "error":
      return <SaveStatusErrorIcon />;
    case "offline":
      return <SaveStatusOfflineIcon />;
  }
};

const labelForStatus = (
  status: SaveStatusState,
  labels: SaveStatusProps["labels"],
): ComponentChildren => labels[status];

export const SaveStatus = ({
  status,
  labels,
  hasUnsavedChanges = false,
  errorMessage,
  lastSavedAt,
  formatOptions,
  onRetry,
  size = "default",
  class: className,
  ...rest
}: SaveStatusProps) => {
  const effectiveStatus = resolveSaveStatusDisplay(status, hasUnsavedChanges);
  const previousStatusRef = useRef<SaveStatusState>(effectiveStatus);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const announcementTimerRef = useRef<number | null>(null);

  const formattedLastSaved =
    lastSavedAt != null ? formatSaveStatusDateTime(lastSavedAt, formatOptions) : null;
  const lastSavedIso = lastSavedAt != null ? toSaveStatusDateTime(lastSavedAt) : undefined;

  useEffect(() => {
    const previous = previousStatusRef.current;
    if (previous === effectiveStatus) return;

    if (effectiveStatus === "saved" && previous === "saving") {
      setAnnouncement(String(labels.saved));
    } else if (effectiveStatus === "error" && previous === "saving") {
      setAnnouncement(String(errorMessage ?? labels.error));
    }

    previousStatusRef.current = effectiveStatus;
  }, [effectiveStatus, errorMessage, labels.error, labels.saved]);

  useEffect(() => {
    if (!announcement) return;
    if (announcementTimerRef.current != null) {
      window.clearTimeout(announcementTimerRef.current);
    }
    announcementTimerRef.current = window.setTimeout(() => {
      setAnnouncement(null);
      announcementTimerRef.current = null;
    }, 3000);
    return () => {
      if (announcementTimerRef.current != null) {
        window.clearTimeout(announcementTimerRef.current);
      }
    };
  }, [announcement]);

  const showRetry = effectiveStatus === "error" && onRetry != null;
  const showErrorMessage = effectiveStatus === "error" && errorMessage != null;

  return (
    <div
      data-slot="save-status"
      data-status={effectiveStatus}
      data-size={size}
      class={cn(saveStatusRoot({ size, status: effectiveStatus }), className)}
      {...rest}
    >
      <span
        class="inline-flex shrink-0 items-center"
        data-slot="save-status-icon"
        aria-hidden="true"
      >
        {statusIcon(effectiveStatus)}
      </span>
      <span class={saveStatusLabel({ size })} role="status">
        <span data-slot="save-status-text">{labelForStatus(effectiveStatus, labels)}</span>
        {formattedLastSaved && effectiveStatus === "saved" && size === "default" ? (
          <>
            {" "}
            <time dateTime={lastSavedIso} class="text-muted-foreground">
              {labels.lastSaved ? labels.lastSaved(formattedLastSaved) : formattedLastSaved}
            </time>
          </>
        ) : null}
      </span>
      {showErrorMessage ? (
        <span class="text-destructive min-w-0 truncate text-xs" data-slot="save-status-error">
          {errorMessage}
        </span>
      ) : null}
      {showRetry ? (
        <Button type="button" variant="link" size="xs" class="h-auto px-0" onClick={onRetry}>
          {labels.retry ?? "Retry"}
        </Button>
      ) : null}
      {announcement ? (
        <span class="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </span>
      ) : null}
    </div>
  );
};
