import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type ButtonGroupSeparatorProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  orientation?: "horizontal" | "vertical";
};

export const ButtonGroupSeparator = ({ class: className, orientation = "vertical", ...rest }: ButtonGroupSeparatorProps) => (
  <span
    data-slot="button-group-separator"
    data-orientation={orientation}
    class={cn(
      "bg-border relative inline-block shrink-0 self-stretch",
      orientation === "horizontal"
        ? "mx-px h-px min-h-0 w-5 in-data-[slot=button-group]:w-auto"
        : "my-px h-5 min-w-0 w-px in-data-[slot=button-group]:h-auto",
      className
    )}
    {...rest}
  />
);
