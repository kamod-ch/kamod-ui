import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type AvatarGroupCountProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const AvatarGroupCount = ({ class: className, children, ...rest }: AvatarGroupCountProps) => (
  <div
    data-slot="avatar-group-count"
    class={cn(
      "bg-muted text-muted-foreground relative -ms-2 flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-medium ring-2 ring-background rtl:-ms-0 rtl:-me-2",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
