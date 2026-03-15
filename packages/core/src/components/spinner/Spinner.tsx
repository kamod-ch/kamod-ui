import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type SpinnerProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: "default" | "muted" | "primary";
  strokeWidth?: number;
};

const sizeClass: Record<NonNullable<SpinnerProps["size"]>, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-10"
};

const toneClass: Record<NonNullable<SpinnerProps["tone"]>, string> = {
  default: "text-current",
  muted: "text-muted-foreground",
  primary: "text-primary"
};

export const Spinner = ({ size = "sm", tone = "default", strokeWidth = 2.5, class: className, ...rest }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Loading"
    data-slot="spinner"
    class={cn("inline-grid shrink-0 place-items-center align-middle", sizeClass[size], toneClass[tone], className)}
    {...rest}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      class="size-full motion-safe:animate-spin motion-reduce:animate-none [animation-duration:0.7s]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" class="opacity-20" />
      <path d="M12 3a9 9 0 1 1-9 9" class="opacity-90" stroke-dasharray="42 16" />
    </svg>
  </span>
);

