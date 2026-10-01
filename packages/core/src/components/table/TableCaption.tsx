import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement> & {
  children?: ComponentChildren;
};

export const TableCaption = ({ class: className, children, ...rest }: TableCaptionProps) => (
  <caption
    data-slot="table-caption"
    class={cn("text-muted-foreground mt-4 text-sm", className)}
    {...(rest as JSX.IntrinsicElements["caption"])}
  >
    {children}
  </caption>
);
