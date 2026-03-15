import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";
import { usePopover } from "./Popover";

export const popoverClose = tv({
  base: [
    "absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-sm opacity-70",
    "hover:opacity-100 focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
    "disabled:pointer-events-none"
  ]
});

export type PopoverCloseProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const PopoverClose = ({ class: className, children, onClick, ...rest }: PopoverCloseProps) => {
  const popover = usePopover();

  return (
    <button
      type="button"
      class={popoverClose({ class: className as string | undefined })}
      data-slot="popover-close"
      aria-label="Close"
      onClick={(event) => {
        popover.setOpen(false);
        popover.triggerRef.current?.focus();
        onClick?.(event);
      }}
      {...rest}
    >
      {children ?? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )}
    </button>
  );
};
