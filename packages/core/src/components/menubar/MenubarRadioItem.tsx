import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarRadio } from "./menubar-context";

export type MenubarRadioItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
  value: string;
};

const CircleIcon = ({ filled }: { filled: boolean }) => (
  <span class="flex size-3.5 items-center justify-center" aria-hidden>
    {filled ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-2 fill-current">
        <circle cx="12" cy="12" r="6" />
      </svg>
    ) : (
      <span class="size-2 rounded-full border border-current opacity-60" />
    )}
  </span>
);

export const MenubarRadioItem = ({
  class: className,
  value,
  children,
  disabled,
  onClick,
  ...rest
}: MenubarRadioItemProps) => {
  const radio = useMenubarRadio();
  const current = radio.controlledValue !== undefined ? radio.controlledValue : radio.selected.value;
  const checked = current === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      data-slot="menubar-radio-item"
      aria-checked={checked}
      disabled={disabled}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-start text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        radio.setValue(value);
      }}
      {...rest}
    >
      <span class="absolute start-2 flex size-3.5 items-center justify-center text-foreground">
        <CircleIcon filled={checked} />
      </span>
      {children}
    </button>
  );
};
