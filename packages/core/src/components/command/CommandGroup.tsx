import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type CommandGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  heading?: string;
  children?: ComponentChildren;
};

export const CommandGroup = ({ heading, class: className, children, ...rest }: CommandGroupProps) => (
  <div
    data-slot="command-group"
    role="presentation"
    class={cn("text-foreground overflow-hidden p-1", className)}
    {...rest}
  >
    {heading ? (
      <div class="text-muted-foreground px-2 py-1.5 text-xs font-medium" data-slot="command-group-heading">
        {heading}
      </div>
    ) : null}
    <div class="space-y-0.5" role="group">
      {children}
    </div>
  </div>
);
