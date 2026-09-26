import type { ComponentChildren, JSX } from "preact";
import { useMemo } from "preact/hooks";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { BulkActionBarContext } from "./bulk-action-bar-context";
import { bulkActionBar } from "./bulk-action-bar-variants";

export type BulkActionBarVariant = NonNullable<VariantProps<typeof bulkActionBar>["variant"]>;

export type BulkActionBarProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  children?: ComponentChildren;
  /** Number of selected items — visibility defaults to `selectedCount > 0`. */
  selectedCount: number;
  /** When omitted, the bar is visible when `selectedCount > 0`. */
  open?: boolean;
  /** Disables action interactions while an async bulk action runs. */
  pending?: boolean;
  variant?: BulkActionBarVariant;
  onClearSelection?: () => void;
  /** Required accessible name for the toolbar. */
  "aria-label": string;
};

export const BulkActionBar = ({
  selectedCount,
  open,
  pending = false,
  variant = "default",
  onClearSelection,
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: BulkActionBarProps) => {
  const isOpen = open ?? selectedCount > 0;

  const contextValue = useMemo(
    () => ({
      selectedCount,
      pending,
      onClearSelection,
    }),
    [selectedCount, pending, onClearSelection],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <BulkActionBarContext.Provider value={contextValue}>
      <div
        role="toolbar"
        aria-label={ariaLabel}
        aria-busy={pending ? "true" : undefined}
        data-slot="bulk-action-bar"
        data-variant={variant}
        data-pending={pending ? "true" : "false"}
        class={cn(bulkActionBar({ variant }), className)}
        {...rest}
      >
        {children}
      </div>
    </BulkActionBarContext.Provider>
  );
};
