import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useContextMenuRadio } from "./context-menu-radio-context";

export type ContextMenuRadioItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  children?: ComponentChildren;
};

export const ContextMenuRadioItem = ({
  value,
  class: className,
  children,
  onClick,
  ...rest
}: ContextMenuRadioItemProps) => {
  const radio = useContextMenuRadio();
  const selected = radio.value === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      data-slot="context-menu-radio-item"
      aria-checked={selected}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        radio.setValue(value);
      }}
      {...rest}
    >
      <span class="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center" aria-hidden>
        {selected ? <span class="size-2 rounded-full bg-current" /> : null}
      </span>
      {children}
    </button>
  );
};
