import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCombobox } from "./combobox-context";

export type ComboboxChipProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
  itemKey: string;
  children?: ComponentChildren;
};

export const ComboboxChip = ({ itemKey: chipKey, children, class: className, ...rest }: ComboboxChipProps) => {
  const ctx = useCombobox();
  return (
    <span
      data-slot="combobox-chip"
      class={cn(
        "bg-secondary text-secondary-foreground inline-flex max-w-full items-center gap-0.5 rounded-md px-2 py-0.5 text-xs",
        className
      )}
      {...rest}
    >
      <span class="min-w-0 truncate">{children}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label="Remove"
        onClick={(event) => {
          event.stopPropagation();
          ctx.removeKey(chipKey);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
};
