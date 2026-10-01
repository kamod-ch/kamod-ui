import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type ProseProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const Prose = ({ class: className, children, ...rest }: ProseProps) => (
  <div
    data-slot="prose"
    class={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
    {...rest}
  >
    {children}
  </div>
);
