import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCombobox } from "./combobox-context";

export type ComboboxClearProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxClear = ({ class: className, onClick, ...rest }: ComboboxClearProps) => {
  const ctx = useCombobox();
  const has = ctx.selectedKeys.length > 0;
  if (!has || !ctx.showClear) return null;

  return (
    <button
      type="button"
      data-slot="combobox-clear"
      aria-label="Clear selection"
      class={cn(
        "text-muted-foreground hover:text-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.clearSelection();
        if (ctx.filterQuery) ctx.filterQuery.value = "";
      }}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
};
