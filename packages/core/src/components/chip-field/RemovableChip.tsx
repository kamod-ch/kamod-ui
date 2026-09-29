import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { removableChip } from "./chip-field-variants";

export type RemovableChipProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children?: ComponentChildren;
  removeLabel: string;
  onRemove: () => void;
  disabled?: boolean;
};

export const RemovableChip = ({
  children,
  removeLabel,
  onRemove,
  disabled = false,
  class: className,
  ...rest
}: RemovableChipProps) => (
  <span data-slot="removable-chip" class={cn(removableChip(), className)} {...rest}>
    <span class="min-w-0 truncate">{children}</span>
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      aria-label={removeLabel}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
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
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </span>
);
