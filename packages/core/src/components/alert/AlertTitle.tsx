import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AlertTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const AlertTitle = ({ children, class: className, ...rest }: AlertTitleProps) => (
  <h5
    data-slot="alert-title"
    class={cn(
      "flex items-center gap-2 text-sm font-medium leading-snug [&_svg]:size-4 [&_svg]:shrink-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
      className
    )}
    {...rest}
  >
    {children}
  </h5>
);

