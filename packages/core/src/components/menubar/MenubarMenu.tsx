import type { ComponentChildren, HTMLAttributes } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { createIdFactory } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { MenubarMenuContext } from "./menubar-context";

const nextMenuId = createIdFactory("menubar-menu");

export type MenubarMenuProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** Optional stable id; auto-generated when omitted. */
  value?: string;
};

export const MenubarMenu = ({
  class: className,
  children,
  value: valueProp,
  ...rest
}: MenubarMenuProps) => {
  const menuId = useMemo(() => nextMenuId(valueProp), [valueProp]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <MenubarMenuContext.Provider value={{ menuId, triggerRef }}>
      <div data-slot="menubar-menu" class={cn("relative flex", className)} {...rest}>
        {children}
      </div>
    </MenubarMenuContext.Provider>
  );
};
