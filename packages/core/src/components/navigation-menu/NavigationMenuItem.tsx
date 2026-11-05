import type { ComponentChildren, HTMLAttributes } from "preact";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { NavigationMenuItemContext } from "./navigation-menu-context";

export type NavigationMenuItemProps = HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
  /** Stable id for this branch; auto-generated when omitted. */
  value?: string;
};

export const NavigationMenuItem = ({
  class: className,
  children,
  value: valueProp,
  ...rest
}: NavigationMenuItemProps) => {
  const generatedId = useId();
  const value = valueProp ?? `nm-item-${generatedId}`;

  return (
    <NavigationMenuItemContext.Provider value={{ value }}>
      <li data-slot="navigation-menu-item" class={cn("relative", className)} {...rest}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
};
