import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Collapsible, type CollapsibleProps, useCollapsible } from "../collapsible/Collapsible";
import { CollapsibleContent } from "../collapsible/CollapsibleContent";
import { CollapsibleTrigger } from "../collapsible/CollapsibleTrigger";

/** A reference summary with an optional metadata row and lazily mounted definition content. */
export type TypeDefinitionProps = Omit<CollapsibleProps, "title"> & {
  /** Human-readable heading; may contain a permalink supplied by the application. */
  title: ComponentChildren;
  /** Short, non-interactive context beside the heading, such as a declared field count. */
  titleMetadata?: string;
  /** Exact identifier, displayed as code and included in the disclosure's accessible name. */
  typeName: string;
  /** Summary content. Links and inline code are welcome; use children for the full definition. */
  description?: ComponentChildren;
  /** Required fields, badges or other context below the summary. */
  metadata?: ComponentChildren;
  /** Optional secondary content beside the heading, outside the disclosure button. */
  headerAction?: ComponentChildren;
  /** Stable heading anchor for a document's links; omitted IDs are generated per instance. */
  headingId?: string;
  /** Match the surrounding document hierarchy. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Compact density reduces spacing without shrinking the disclosure's touch target. */
  density?: "default" | "compact";
  /** Localizable labels; the type name is appended for assistive technology. */
  expandLabel?: string;
  collapseLabel?: string;
  /** Secondary disclosure text; never place another interactive control inside the trigger. */
  triggerHint?: string;
  /** Optional utility overrides for the disclosure button and expanded content. */
  triggerClass?: string;
  contentClass?: string;
};

/**
 * A complete definition card composed from Collapsible. Supports controlled `open` or
 * uncontrolled `defaultOpen`; content is unmounted while closed. Supply code rendering,
 * copying and URL navigation as children/slots so core never depends on a parser or router.
 */
export function TypeDefinition({
  open,
  defaultOpen,
  onOpenChange,
  class: className,
  title,
  titleMetadata,
  typeName,
  description,
  metadata,
  headerAction,
  headingId,
  headingLevel = 3,
  density = "default",
  expandLabel = "View Definition",
  collapseLabel = "Hide Definition",
  triggerHint,
  triggerClass,
  contentClass,
  children,
  ...rest
}: TypeDefinitionProps) {
  const generatedId = useId();
  const titleId = headingId ?? `${generatedId}-title`;
  const contentId = `${titleId}-content`;
  const Heading = `h${headingLevel}` as `h${2 | 3 | 4 | 5 | 6}`;
  const compact = density === "compact";
  return (
    <Collapsible
      {...rest}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      class={cn("min-w-0 rounded-xl border border-border bg-background text-foreground", className)}
      data-slot="type-definition"
    >
      <div
        data-slot="type-definition-intro"
        class={compact ? "p-3" : "px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4"}
      >
        <div class="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div class="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            <Heading
              id={titleId}
              tabIndex={-1}
              class="m-0 min-w-0 scroll-mt-4 text-[0.95rem] leading-normal font-semibold [overflow-wrap:anywhere]"
            >
              {title}
            </Heading>
            {titleMetadata && (
              <span
                data-slot="type-definition-title-metadata"
                class="flex items-center gap-2.5 text-[0.6875rem] font-normal text-muted-foreground"
              >
                <span aria-hidden="true">·</span>
                {titleMetadata}
              </span>
            )}
          </div>
          {headerAction}
        </div>
        <code
          data-slot="type-definition-name"
          class="block font-mono text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
        >
          {typeName}
        </code>
        {description && (
          <div
            data-slot="type-definition-description"
            class="mt-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            {description}
          </div>
        )}
        {metadata && (
          <div data-slot="type-definition-metadata" class="mt-3 text-xs">
            {metadata}
          </div>
        )}
      </div>
      <DefinitionDisclosure
        titleId={titleId}
        typeName={typeName}
        compact={compact}
        expandLabel={expandLabel}
        collapseLabel={collapseLabel}
        triggerHint={triggerHint}
        triggerClass={triggerClass}
      />
      <CollapsibleContent
        id={contentId}
        duration="0ms"
        class={cn("min-w-0 p-3", !compact && "sm:p-4", contentClass)}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/** The trigger reads Collapsible state directly, so controlled and local labels cannot diverge. */
function DefinitionDisclosure({
  titleId,
  typeName,
  compact,
  expandLabel,
  collapseLabel,
  triggerHint,
  triggerClass,
}: {
  titleId: string;
  typeName: string;
  compact: boolean;
  expandLabel: string;
  collapseLabel: string;
  triggerHint?: string;
  triggerClass?: string;
}) {
  const { open } = useCollapsible();
  const label = open ? collapseLabel : expandLabel;
  return (
    <CollapsibleTrigger
      id={`${titleId}-trigger`}
      aria-controls={`${titleId}-content`}
      aria-label={`${label}: ${typeName}`}
      data-slot="type-definition-trigger"
      class={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-b-xl border-t border-border bg-muted py-2.5 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_4%,var(--muted))] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:rounded-b-none motion-reduce:transition-none",
        compact ? "px-3" : "px-4 sm:px-5",
        triggerClass,
      )}
    >
      <span class="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          class="shrink-0"
        >
          <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
        </svg>
        <span class="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
          <span>{label}</span>
          {triggerHint && (
            <span
              data-slot="type-definition-trigger-hint"
              class="flex items-center gap-2.5 text-[0.6875rem] text-muted-foreground"
            >
              <span aria-hidden="true">·</span>
              {triggerHint}
            </span>
          )}
        </span>
      </span>
      {/* Decorative button surface inside the single accessible disclosure target. */}
      <span
        data-slot="type-definition-chevron"
        class="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground/[0.02]"
        aria-hidden="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          class={cn("shrink-0", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </CollapsibleTrigger>
  );
}
