import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { useDialog } from "./Dialog";

export type DialogTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
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

export const DialogTrigger = ({
  asChild = false,
  children,
  onClick,
  onPointerDown,
  ref: outerRef,
  "data-slot": dataSlot = "dialog-trigger",
  ...rest
}: DialogTriggerProps) => {
  const dialog = useDialog();

  const openDialog = () => {
    dialog.setOpen(true);
  };

  const handlePointerDown = (event: JSX.TargetedPointerEvent<HTMLElement>) => {
    onPointerDown?.(event as JSX.TargetedPointerEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    if (event.button === 0) {
      openDialog();
    }
  };

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    openDialog();
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onClick?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
      onPointerDown?: (event: JSX.TargetedPointerEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "aria-expanded": dialog.open.value,
      "data-slot": dataSlot,
      onPointerDown: (event: JSX.TargetedPointerEvent<HTMLElement>) => {
        childProps.onPointerDown?.(event);
        handlePointerDown(event);
      },
      onClick: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      ref: (node: HTMLElement | null) => {
        dialog.triggerRef.current = node;
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      }
    } as never);
  }

  return (
    <button
      ref={(node) => {
        dialog.triggerRef.current = node;
        callRef(outerRef, node);
      }}
      {...rest}
      type="button"
      data-slot={dataSlot}
      aria-expanded={dialog.open.value}
      onPointerDown={(event) => {
        if (event.button === 0) {
          openDialog();
        }
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        openDialog();
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
};
