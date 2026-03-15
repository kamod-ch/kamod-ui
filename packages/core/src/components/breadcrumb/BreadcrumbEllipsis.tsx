import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbEllipsisProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const BreadcrumbEllipsis = ({ class: className, ...rest }: BreadcrumbEllipsisProps) => (
  <span data-slot="breadcrumb-ellipsis" class={cn("flex size-9 items-center justify-center", className)} {...rest}>
    <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
    <span class="sr-only">More</span>
  </span>
);
