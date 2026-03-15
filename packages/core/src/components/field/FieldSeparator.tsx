import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Separator } from "../separator/Separator";

export type FieldSeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FieldSeparator = ({ class: className, children, ...rest }: FieldSeparatorProps) => (
  <div class={cn("flex items-center gap-3 py-2", className)} data-slot="field-separator" {...rest}>
    <Separator class="min-w-0 flex-1 shrink" orientation="horizontal" />
    {children ? (
      <span class="text-muted-foreground shrink-0 text-xs font-medium whitespace-nowrap">{children}</span>
    ) : null}
  </div>
);
