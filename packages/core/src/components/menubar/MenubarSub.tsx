import { signal } from "@preact/signals";
import { useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { MenubarSubContext } from "./menubar-context";

export type MenubarSubProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarSub = ({ class: className, children, ...rest }: MenubarSubProps) => {
  const open = useMemo(() => signal(false), []);

  const ctx = useMemo(
    () => ({
      open,
      setOpen: (next: boolean) => {
        open.value = next;
      }
    }),
    [open]
  );

  return (
    <MenubarSubContext.Provider value={ctx}>
      <div
        data-slot="menubar-sub"
        class={cn("relative", className)}
        onPointerLeave={() => {
          open.value = false;
        }}
        {...rest}
      >
        {children}
      </div>
    </MenubarSubContext.Provider>
  );
};
