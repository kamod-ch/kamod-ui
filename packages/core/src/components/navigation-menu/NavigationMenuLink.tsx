import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { cn } from "../../lib/utils";
import { useNavigationMenuItemCtx, useNavigationMenuRoot } from "./navigation-menu-context";

export type NavigationMenuLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  children?: ComponentChildren;
  asChild?: boolean;
};

const callRef = <T extends HTMLElement>(ref: unknown, node: T | null) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: T | null }).current = node;
  }
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
    className
  );

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLAnchorElement>);
    if (event.defaultPrevented) return;
    root.clearTimers();
    root.openValue.value = null;
  };

  if (asChild) {
    if (!isValidElement(children)) return null;
    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onClick?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
      class?: string;
      className?: string;
    };
    const mergedClass = cn(linkClass, childProps.class, childProps.className);
    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "data-slot": "navigation-menu-link",
      "data-active": active ? "" : undefined,
      "data-state": open ? "open" : "closed",
      class: mergedClass,
      onClick: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      ref: (node: HTMLElement | null) => {
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      }
    } as never);
  }

  return (
    <a
      ref={(node) => callRef(outerRef, node)}
      data-slot="navigation-menu-link"
      data-active={active ? "" : undefined}
      data-state={open ? "open" : "closed"}
      aria-current={active ? "page" : undefined}
      class={linkClass}
      onClick={(e) => handleClick(e as unknown as JSX.TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </a>
  );
};
