import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { useCollapsible } from "./Collapsible";

export type CollapsibleTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

const callRef = <T extends HTMLElement>(ref: unknown, node: T | null) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: T | null }).current = node;
  }
};

export const CollapsibleTrigger = ({
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  "data-slot": dataSlot = "collapsible-trigger",
  ...rest
}: CollapsibleTriggerProps) => {
  const { open, setOpen } = useCollapsible();

  const toggle = () => setOpen(!open);

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    toggle();
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onClick?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "aria-expanded": open,
      "data-state": open ? "open" : "closed",
      "data-slot": dataSlot,
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
    <button
      type="button"
      data-slot={dataSlot}
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={(event) => {
        handleClick(event);
      }}
      ref={(node) => {
        callRef(outerRef, node);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
