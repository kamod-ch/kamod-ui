import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { Progress } from "../progress/Progress";
import type { FileUploadItemPropsLabels, UploadFileEntry } from "./file-upload-manager-types";
import { formatUploadFileSize } from "./file-upload-manager-utils";
import { fileUploadItem } from "./file-upload-manager-variants";

export type FileUploadItemProps = Omit<
  JSX.HTMLAttributes<HTMLLIElement>,
  "id" | "onCancel" | "onRetry" | "onRemove"
> & {
  entry: UploadFileEntry;
  onRemove?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  labels?: FileUploadItemPropsLabels;
  locale?: string;
};

const defaultStatusLabel: Record<UploadFileEntry["status"], string> = {
  queued: "Queued",
  uploading: "Uploading",
  success: "Uploaded",
  error: "Failed",
  canceled: "Canceled",
};

export const FileUploadItem = ({
  entry,
  onRemove,
  onCancel,
  onRetry,
  labels,
  locale,
  class: className,
  ...rest
}: FileUploadItemProps) => {
  const statusRef = useRef<HTMLDivElement>(null);
  const previousStatus = useRef(entry.status);

  useEffect(() => {
    if (previousStatus.current === entry.status) return;
    previousStatus.current = entry.status;
    if (statusRef.current) {
      statusRef.current.textContent = defaultStatusLabel[entry.status];
    }
  }, [entry.status]);

  const removeLabel = labels?.remove?.(entry) ?? `Remove ${entry.name}`;
  const cancelLabel = labels?.cancel?.(entry) ?? `Cancel upload of ${entry.name}`;
  const retryLabel = labels?.retry?.(entry) ?? `Retry upload of ${entry.name}`;
  const progressLabel = labels?.progressLabel?.(entry) ?? `Upload progress for ${entry.name}`;
  const progressIndeterminate =
    labels?.progressIndeterminate ?? "Upload in progress, progress unknown";

  const showProgress = entry.status === "uploading";
  const isIndeterminate = entry.progress === null || entry.progress === undefined;
  const progressValue = typeof entry.progress === "number" ? entry.progress : null;

  return (
    <li
      data-slot="file-upload-item"
      data-item-id={entry.id}
      data-attempt-id={entry.attemptId}
      data-status={entry.status}
      class={cn(fileUploadItem({ status: entry.status }), className)}
      {...rest}
    >
      <div class="flex items-start gap-3">
        {entry.previewUrl ? (
          <img
            src={entry.previewUrl}
            alt=""
            class="size-10 shrink-0 rounded object-cover"
            data-slot="file-upload-item-preview"
          />
        ) : null}
        <div class="min-w-0 flex-1 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="truncate text-sm font-medium" data-slot="file-upload-item-name">
              {entry.name}
            </p>
            <Badge variant="outline" size="xxs">
              {formatUploadFileSize(entry.size, locale)}
            </Badge>
            <Badge
              variant={
                entry.status === "success"
                  ? "success"
                  : entry.status === "error"
                    ? "destructive"
                    : "secondary"
              }
              size="xxs"
              data-slot="file-upload-item-status"
            >
              {defaultStatusLabel[entry.status]}
            </Badge>
          </div>

          {entry.errorMessage ? (
            <p class="text-destructive text-xs" role="alert" data-slot="file-upload-item-error">
              {entry.errorMessage}
            </p>
          ) : null}

          {showProgress ? (
            <div class="space-y-1">
              <Progress
                value={isIndeterminate ? null : progressValue}
                indeterminate={isIndeterminate}
                aria-label={progressLabel}
                aria-valuetext={
                  isIndeterminate ? progressIndeterminate : `${progressValue ?? 0} percent`
                }
              />
            </div>
          ) : null}

          <div ref={statusRef} aria-live="polite" aria-atomic="true" class="sr-only" />
        </div>

        <div class="flex shrink-0 flex-col gap-1" data-slot="file-upload-item-actions">
          {entry.status === "uploading" || entry.status === "queued" ? (
            onCancel ? (
              <Button type="button" variant="ghost" size="xs" onClick={() => onCancel(entry.id)}>
                {cancelLabel}
              </Button>
            ) : null
          ) : null}
          {entry.status === "error" || entry.status === "canceled" ? (
            onRetry ? (
              <Button type="button" variant="outline" size="xs" onClick={() => onRetry(entry.id)}>
                {retryLabel}
              </Button>
            ) : null
          ) : null}
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={removeLabel}
              onClick={() => onRemove(entry.id)}
            >
              ×
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
};
