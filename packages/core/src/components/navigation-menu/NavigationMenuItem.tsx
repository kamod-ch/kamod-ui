import { useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { createIdFactory } from "../../lib/interactive";
import { NavigationMenuItemContext } from "./navigation-menu-context";

const nextItemValue = createIdFactory("nm-item");

export type NavigationMenuItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
  /** Stable id for this branch; auto-generated when omitted. */
  value?: string;
};

export const NavigationMenuItem = ({ class: className, children, value: valueProp, ...rest }: NavigationMenuItemProps) => {
  const value = useMemo(() => nextItemValue(valueProp), [valueProp]);

  return (
    <NavigationMenuItemContext.Provider value={{ value }}>
      <li data-slot="navigation-menu-item" class={cn("relative", className)} {...rest}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
};
