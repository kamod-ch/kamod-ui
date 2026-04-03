import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useDropdown } from "./Dropdown";
import { useDropdownRadio } from "./dropdown-radio-context";

export type DropdownRadioItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  children?: ComponentChildren;
};

export const DropdownRadioItem = ({
  value,
  class: className,
  children,
  onClick,
  ...rest
}: DropdownRadioItemProps) => {
  const dropdown = useDropdown();
  const radio = useDropdownRadio();
  const selected = radio.value.value === value;

  return (
    <button
      type="button"
      role="menuitemradio"
      data-slot="dropdown-radio-item"
      aria-checked={selected}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-1 rounded-sm py-0.5 ps-7 pe-1.5 text-sm outline-none transition-colors duration-100",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        radio.setValue(value);
        dropdown.setOpen(false);
      }}
      {...rest}
    >
      <span class="pointer-events-none absolute start-1.5 flex size-3 items-center justify-center" aria-hidden>
        {selected ? (
          <span class="size-1.5 rounded-full bg-current" />
        ) : null}
      </span>
      {children}
    </button>
  );
};
