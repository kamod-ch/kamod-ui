import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement> & {
  children?: ComponentChildren;
};

export const BreadcrumbList = ({ class: className, children, ...rest }: BreadcrumbListProps) => (
  <ol
    data-slot="breadcrumb-list"
    class={cn(
      "text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm",
      className,
    )}
    {...(rest as JSX.IntrinsicElements["ol"])}
  >
    {children}
  </ol>
);
