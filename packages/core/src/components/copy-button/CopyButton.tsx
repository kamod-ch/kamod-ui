import { CopyCheckIcon, CopyIcon } from "@kamod-ch/icons/tabler/outline";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import type { CopyButtonProps } from "./copy-button-types";
import { useCopy } from "./use-copy";

/** Shared clipboard action: exact copying, local feedback, and no state updates after unmount. */
export function CopyButton({
  value,
  label = "Copy",
  subject = "text",
  iconOnly = false,
  onCopy,
  onCopyError,
  renderControl,
  statusId: providedStatusId,
  class: className,
  className: aliasClassName,
  disabled,
  onClick,
  "aria-label": accessibleLabel = label,
  "aria-describedby": describedBy,
  ...props
}: CopyButtonProps) {
  const id = useId();
  const statusId = providedStatusId ?? `${id}-copy-status`;
  const { status, copy } = useCopy(value, onCopy, onCopyError);
  const copied = status === "copied";
  const failed = status === "error";
  const Icon = copied ? CopyCheckIcon : CopyIcon;
  const name = subject.charAt(0).toUpperCase() + subject.slice(1);
  const actionLabel = copied
    ? `${name} copied`
    : failed
      ? `Retry copying ${subject}`
      : accessibleLabel;
  const defaultControl = (
    <button
      type="button"
      data-slot="copy-button"
      {...props}
      class={cn(
        "docs-icon-button kamod-copy-button",
        copied && "is-copied",
        className,
        aliasClassName,
      )}
      data-copy-state={status}
      data-icon-only={iconOnly || undefined}
      aria-label={actionLabel}
      aria-describedby={[describedBy, failed && statusId].filter(Boolean).join(" ") || undefined}
      aria-busy={status === "copying" || undefined}
      aria-disabled={status === "copying" ? true : props["aria-disabled"]}
      title={actionLabel}
      disabled={disabled}
      onClick={(event) => {
        // Keep focus while the browser writes; the shared hook also guards concurrent calls.
        if (
          disabled ||
          status === "copying" ||
          props["aria-disabled"] === true ||
          props["aria-disabled"] === "true"
        )
          return;
        onClick?.(event);
        if (!event.defaultPrevented) void copy();
      }}
    >
      <Icon key={copied ? "copied" : "copy"} size={16} strokeWidth={2} aria-hidden="true" />
      {!iconOnly && (
        <span class="kamod-copy-label" aria-hidden="true">
          <span data-copy-label="idle">{label}</span>
          <span data-copy-label="feedback">{failed ? "Retry copy" : "Copied"}</span>
        </span>
      )}
    </button>
  );
  return (
    <>
      {renderControl ? renderControl({ status, statusId, copy, defaultControl }) : defaultControl}
      <span
        class="kamod-copy-status"
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {copied
          ? `${name} copied to clipboard.`
          : failed
            ? `Could not copy ${subject}. Try again, or select and copy the source manually.`
            : ""}
      </span>
    </>
  );
}
