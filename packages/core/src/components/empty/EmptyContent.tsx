import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type EmptyContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const EmptyContent = ({ class: className, children, ...rest }: EmptyContentProps) => (
  <div
    class={cn("flex w-full max-w-sm flex-col items-center justify-center gap-2", className)}
    data-slot="empty-content"
    {...rest}
  >
    {children}
  </div>
);
