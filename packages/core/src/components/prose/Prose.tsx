import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ProseProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const Prose = ({ class: className, children, ...rest }: ProseProps) => (
  <div data-slot="prose" class={cn("prose prose-neutral dark:prose-invert max-w-none", className)} {...rest}>
    {children}
  </div>
);

