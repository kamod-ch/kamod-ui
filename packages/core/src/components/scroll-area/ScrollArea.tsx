import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ScrollAreaProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ScrollArea = ({ class: className, children, ...rest }: ScrollAreaProps) => (
  <div
    data-slot="scroll-area"
    class={cn(
      "relative overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

