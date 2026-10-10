import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Alert, type AlertProps } from "./Alert";

export type AlertCalloutProps = Omit<AlertProps, "title" | "variant"> & {
  title: ComponentChildren;
  icon?: ComponentChildren;
  /** A short category above the title. */
  eyebrow?: ComponentChildren;
  /** Optional index, badge or source, aligned with the heading. */
  meta?: ComponentChildren;
  footer?: ComponentChildren;
  headingId?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

/** Structured, non-live guidance. Use ordinary Alert variants for urgent status messages. */
export function AlertCallout({
  title,
  icon,
  eyebrow,
  meta,
  footer,
  children,
  headingId,
  headingLevel,
  class: className,
  role = "note",
  ...rest
}: AlertCalloutProps) {
  const generatedId = useId();
  const titleId = headingId ?? generatedId;
  const Heading =
    headingLevel || headingId
      ? (`h${headingLevel ?? 3}` as "h2" | "h3" | "h4" | "h5" | "h6")
      : "div";
  return (
    <Alert
      variant="callout"
      role={role}
      aria-labelledby={titleId}
      class={cn("@container/callout p-0", className)}
      {...rest}
    >
      <div
        data-slot="callout-header"
        class={cn(
          "relative grid items-center gap-x-3 gap-y-2 px-4 pt-4 pb-3 after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-linear-to-r after:from-border after:to-transparent sm:px-5 sm:after:inset-x-5",
          icon
            ? "grid-cols-[auto_minmax(0,1fr)] @sm/callout:grid-cols-[auto_minmax(0,1fr)_auto]"
            : "grid-cols-1 @sm/callout:grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        {icon && (
          <span
            data-slot="callout-icon"
            aria-hidden="true"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-foreground shadow-xs [&>svg]:size-4.5 [&>svg]:stroke-[1.75]"
          >
            {icon}
          </span>
        )}
        <div class="min-w-0 flex-1">
          {eyebrow && (
            <div
              data-slot="callout-eyebrow"
              class="mb-0.5 text-[0.6875rem] font-medium leading-snug text-muted-foreground"
            >
              {eyebrow}
            </div>
          )}
          <Heading
            id={titleId}
            tabIndex={headingId ? -1 : undefined}
            data-slot="alert-title"
            class="m-0 text-sm font-semibold leading-snug tracking-tight text-foreground"
          >
            {title}
          </Heading>
        </div>
        {meta && (
          <div
            data-slot="callout-meta"
            class={cn(
              "min-w-0 text-xs font-medium tabular-nums text-muted-foreground @sm/callout:col-start-auto",
              icon && "col-start-2",
            )}
          >
            {meta}
          </div>
        )}
      </div>
      <div
        data-slot="alert-description"
        class="px-4 pt-3 pb-4 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground sm:px-5 [&_p]:m-0 [&>p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 hover:[&_a]:decoration-current [&_code]:rounded [&_code]:bg-primary/5 [&_code]:px-1 [&_code]:text-[0.92em] [&_code]:text-foreground"
      >
        {children}
      </div>
      {footer && (
        <div
          data-slot="callout-footer"
          class="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 bg-muted/25 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground sm:px-5"
        >
          {footer}
        </div>
      )}
    </Alert>
  );
}
