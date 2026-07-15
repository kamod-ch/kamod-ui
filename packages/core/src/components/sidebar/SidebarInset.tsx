import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type SidebarInsetProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const SidebarInset = ({ class: className, children, ...rest }: SidebarInsetProps) => (
  <main
    data-slot="sidebar-inset"
    class={cn(
      "relative flex w-full flex-1 flex-col bg-background",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
      className,
    )}
    {...rest}
  >
    {children}
  </main>
);
