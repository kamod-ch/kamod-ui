import {
  type ButtonHTMLAttributes,
  type ComponentChildren,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type TargetedMouseEvent,
  type TargetedPointerEvent,
} from "preact";
import { useDialog } from "./Dialog";

export type DialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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

  const handlePointerDown = (event: TargetedPointerEvent<HTMLElement>) => {
    onPointerDown?.(event as TargetedPointerEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    if (event.button === 0) {
      openDialog();
    }
  };

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    openDialog();
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onClick?: (event: TargetedMouseEvent<HTMLElement>) => void;
      onPointerDown?: (event: TargetedPointerEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "aria-expanded": dialog.open.value,
      "data-slot": dataSlot,
      onPointerDown: (event: TargetedPointerEvent<HTMLElement>) => {
        childProps.onPointerDown?.(event);
        handlePointerDown(event);
      },
      onClick: (event: TargetedMouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      ref: (node: HTMLElement | null) => {
        dialog.triggerRef.current = node;
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      },
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
