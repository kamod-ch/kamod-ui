import type { ButtonHTMLAttributes, ComponentChildren, TargetedMouseEvent } from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { useDialog } from "../dialog/Dialog";
import { useConsentContext } from "./useConsent";

export type ConsentManagerTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

/** Reopens the dialog on the settings level. */
export const ConsentManagerTrigger = ({
  asChild = false,
  children,
  onClick,
  ref: outerRef,
  ...rest
}: ConsentManagerTriggerProps) => {
  const dialog = useDialog();
  const { open } = useConsentContext();

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    open();
  };

  const triggerRef = (node: HTMLElement | null) => {
    dialog.triggerRef.current = node;
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        data-slot="consent-manager-trigger"
        aria-expanded={dialog.open.value}
        onClick={handleClick}
        ref={triggerRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      {...rest}
      data-slot="consent-manager-trigger"
      aria-expanded={dialog.open.value}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
