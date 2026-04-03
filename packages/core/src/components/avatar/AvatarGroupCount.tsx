import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AvatarGroupCountProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const AvatarGroupCount = ({ class: className, children, ...rest }: AvatarGroupCountProps) => (
  <div
    data-slot="avatar-group-count"
    class={cn(
      "bg-muted text-muted-foreground relative z-[100] -ms-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-center text-xs font-medium tabular-nums leading-none ring-2 ring-background rtl:-ms-0 rtl:-me-2",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
