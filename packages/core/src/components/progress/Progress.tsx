import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import "./progress-indeterminate-styles";

export type ProgressProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Set to `null` for an indeterminate bar (Radix-style). Ignored when `indeterminate` is true. */
  value?: number | null;
  max?: number;
  indicatorClass?: string;
  /** When true, shows an animated indeterminate bar regardless of `value`. */
  indeterminate?: boolean;
};

const progressRootClass = [
  "relative h-2.5 w-full overflow-hidden rounded-full bg-muted",
  "ring-1 ring-inset ring-border/55 dark:ring-border/45",
  "shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--foreground)_6%,transparent)]",
  "dark:shadow-[inset_0_1px_2px_color-mix(in_oklab,black_28%,transparent)]"
].join(" ");

const progressIndicatorShared = [
  "rounded-full bg-primary",
  "shadow-[inset_0_-1px_0_color-mix(in_oklab,var(--primary-foreground)_22%,transparent)]"
].join(" ");

const progressIndicatorDeterminateClass = [
  "h-full w-full flex-1",
  "transition-transform duration-300 ease-out motion-reduce:transition-none",
  progressIndicatorShared
].join(" ");

const progressIndicatorIndeterminateClass = ["absolute inset-y-0 left-0 w-[38%]", progressIndicatorShared].join(" ");

export const Progress = ({
  value = 0,
  max = 100,
  class: className,
  indicatorClass,
  indeterminate: indeterminateProp,
  ...rest
}: ProgressProps) => {
  const safeMax = max > 0 ? max : 100;
  const isIndeterminate = indeterminateProp === true || value === null;
  const numericValue = value === null || value === undefined ? 0 : value;
  const current = Math.max(0, Math.min(safeMax, numericValue));
  const percent = Math.max(0, Math.min(100, (current / safeMax) * 100));

  return (
    <div
      role="progressbar"
      data-slot="progress"
      data-state={isIndeterminate ? "indeterminate" : "determinate"}
      {...(!isIndeterminate
        ? {
            "aria-valuemin": 0,
            "aria-valuemax": safeMax,
            "aria-valuenow": current,
            "data-value": current,
            "data-max": safeMax
          }
        : {
            "aria-valuetext": "Indeterminate"
          })}
      class={cn(progressRootClass, className)}
      {...rest}
    >
      {isIndeterminate ? (
        <div data-slot="progress-indicator" class={cn(progressIndicatorIndeterminateClass, indicatorClass)} />
      ) : (
        <div
          data-slot="progress-indicator"
          class={cn(progressIndicatorDeterminateClass, indicatorClass)}
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      )}
    </div>
  );
};
