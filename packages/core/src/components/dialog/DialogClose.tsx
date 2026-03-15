import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { useDialog } from "./Dialog";

export type DialogCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
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

export const DialogClose = ({
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  "data-slot": dataSlot = "dialog-close",
  ...rest
}: DialogCloseProps) => {
  const dialog = useDialog();

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    dialog.setOpen(false);
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
      ref={(node) => {
        callRef(outerRef, node);
      }}
      type="button"
      data-slot={dataSlot}
      onClick={(event) => handleClick(event as unknown as JSX.TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </button>
  );
};
