import { signal } from "@preact/signals";
import { useEffect, useMemo, useRef } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createDismissableLayer } from "../../lib/interactive";
import { MenubarRootContext } from "./menubar-context";

export type MenubarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  dir?: "ltr" | "rtl";
};

export const Menubar = ({ class: className, children, dir, ...rest }: MenubarProps) => {
  const openMenuId = useMemo(() => signal<string | null>(null), []);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const ctx = useMemo(
    () => ({
      openMenuId,
      setOpenMenuId: (id: string | null) => {
        openMenuId.value = id;
      },
      rootRef
    }),
    [openMenuId]
  );

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => openMenuId.value != null,
      onDismiss: () => {
        openMenuId.value = null;
      }
    });
    return () => layer.dispose();
  }, [openMenuId]);

  return (
    <MenubarRootContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-slot="menubar"
        role="menubar"
        dir={dir}
        class={cn(
          "flex h-9 items-center gap-0 rounded-md border border-border bg-background p-1 shadow-xs",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </MenubarRootContext.Provider>
  );
};
