import { signal } from "@preact/signals";
import type { ComponentChildren, HTMLAttributes } from "preact";
import { useMemo } from "preact/hooks";
import { useMenuSubDismissableLayer } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { MenubarSubContext } from "./menubar-context";

export type MenubarSubProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarSub = ({ class: className, children, ...rest }: MenubarSubProps) => {
  const open = useMemo(() => signal(false), []);

  const ctx = useMemo(() => {
    let focusOnOpen = false;
    return {
      open,
      setOpen: (next: boolean) => {
        open.value = next;
        if (!next) focusOnOpen = false;
      },
      markFocusOnOpen: () => {
        focusOnOpen = true;
      },
      consumeFocusOnOpen: () => {
        const next = focusOnOpen;
        focusOnOpen = false;
        return next;
      },
    };
  }, [open]);

  const rootRef = useMenuSubDismissableLayer(ctx);

  return (
    <MenubarSubContext.Provider value={ctx}>
      <div
        ref={rootRef}
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
