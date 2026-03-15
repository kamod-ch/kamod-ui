import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCommand } from "./Command";

export type CommandItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Used for case-insensitive filtering against the query. */
  value: string;
  children?: ComponentChildren;
  onSelect?: (value: string) => void;
};

export const CommandItem = ({
  class: className,
  value,
  children,
  disabled,
  onClick,
  onSelect,
  ...rest
}: CommandItemProps) => {
  const { query } = useCommand();
  const q = (query.value ?? "").trim().toLowerCase();
  const textMatch = !q || value.toLowerCase().includes(q);

  return (
    <button
      type="button"
      data-slot="command-item"
      data-match={textMatch ? "true" : "false"}
      disabled={disabled}
      class={cn(
        "flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        !textMatch && "hidden",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onSelect?.(value);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
