import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ItemDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const ItemDescription = ({ class: className, children, ...rest }: ItemDescriptionProps) => (
  <p
    data-slot="item-description"
    class={cn(
      "text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      className,
    )}
    {...rest}
  >
    {children}
  </p>
);
