import {
  type AnchorHTMLAttributes,
  type ComponentChildren,
  type JSX,
  type TargetedMouseEvent,
} from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";
import { useNavigationMenuItemCtx, useNavigationMenuRoot } from "./navigation-menu-context";

export type NavigationMenuLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  children?: ComponentChildren;
  asChild?: boolean;
};

export const NavigationMenuLink = ({
  class: className,
  active = false,
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  ...rest
}: NavigationMenuLinkProps) => {
  const root = useNavigationMenuRoot();
  const { value } = useNavigationMenuItemCtx();
  const open = root.openValue.value === value;

  const linkClass = cn(
    "block select-none rounded-sm px-3 py-2 text-sm no-underline outline-none transition-colors",
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    active ? "bg-accent text-accent-foreground" : "",
    className,
  );

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLAnchorElement>);
    if (event.defaultPrevented) return;
    root.clearTimers();
    root.openValue.value = null;
  };

  const linkRef = (node: HTMLElement | null) => {
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        data-slot="navigation-menu-link"
        data-active={active ? "" : undefined}
        data-state={open ? "open" : "closed"}
        class={linkClass}
        onClick={handleClick}
        ref={linkRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <a
      ref={linkRef}
      data-slot="navigation-menu-link"
      data-active={active ? "" : undefined}
      data-state={open ? "open" : "closed"}
      aria-current={active ? "page" : undefined}
      class={linkClass}
      onClick={(e) => handleClick(e as unknown as TargetedMouseEvent<HTMLElement>)}
      {...(rest as JSX.IntrinsicElements["a"])}
    >
      {children}
    </a>
  );
};
