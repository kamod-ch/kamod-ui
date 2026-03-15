import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCommand } from "./Command";

export type CommandEmptyProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const CommandEmpty = ({ children, class: className, ...rest }: CommandEmptyProps) => {
  const { query, hasVisibleItems } = useCommand();
  void hasVisibleItems.value;

  if (!(query.value ?? "").trim()) return null;
  if (hasVisibleItems.value) return null;

  return (
    <div data-slot="command-empty" class={cn("p-2 text-sm text-muted-foreground", className)} {...rest}>
      {children}
    </div>
  );
};
