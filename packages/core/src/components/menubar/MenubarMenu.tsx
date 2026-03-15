import { useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createIdFactory } from "../../lib/interactive";
import { MenubarMenuContext } from "./menubar-context";

const nextMenuId = createIdFactory("menubar-menu");

export type MenubarMenuProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** Optional stable id; auto-generated when omitted. */
  value?: string;
};

export const MenubarMenu = ({ class: className, children, value: valueProp, ...rest }: MenubarMenuProps) => {
  const menuId = useMemo(() => nextMenuId(valueProp), [valueProp]);

  return (
    <MenubarMenuContext.Provider value={{ menuId }}>
      <div data-slot="menubar-menu" class={cn("relative flex", className)} {...rest}>
        {children}
      </div>
    </MenubarMenuContext.Provider>
  );
};
