import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AlertDescriptionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const AlertDescription = ({ children, class: className, ...rest }: AlertDescriptionProps) => (
  <div
    data-slot="alert-description"
    class={cn(
      "text-sm leading-relaxed text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

