import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbSeparatorProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const BreadcrumbSeparator = ({ class: className, children, ...rest }: BreadcrumbSeparatorProps) => (
  <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" class={cn("[&>svg]:size-3.5", className)} {...rest}>
    {children ?? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="shrink-0 rtl:rotate-180"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    )}
  </li>
);
