import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";
import { ContextMenuSubProvider, useMemoContextMenuSub } from "./context-menu-sub-context";

export type ContextMenuSubProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ContextMenuSub = ({ class: className, children, ...rest }: ContextMenuSubProps) => {
  const ctx = useMemoContextMenuSub();

  return (
    <ContextMenuSubProvider value={ctx}>
      <div
        data-slot="context-menu-sub"
        class={cn("relative", className)}
        onPointerLeave={() => {
          ctx.setOpen(false);
        }}
        {...rest}
      >
        {children}
      </div>
    </ContextMenuSubProvider>
  );
};
