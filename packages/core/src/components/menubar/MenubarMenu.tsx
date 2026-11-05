import type { ComponentChildren, HTMLAttributes } from "preact";
import { useId, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { MenubarMenuContext } from "./menubar-context";

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
  const generatedId = useId();
  const menuId = valueProp ?? `menubar-menu-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <MenubarMenuContext.Provider value={{ menuId, triggerRef }}>
      <div data-slot="menubar-menu" class={cn("relative flex", className)} {...rest}>
        {children}
      </div>
    </MenubarMenuContext.Provider>
  );
};
