import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { useBulkActionBar } from "./bulk-action-bar-context";
import { bulkActionBarClear } from "./bulk-action-bar-variants";

export type BulkActionBarClearProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "aria-label"
> & {
  /** Accessible name and default visible label when `children` is omitted. */
  clearLabel: string;
  children?: ComponentChildren;
  /** Optional override; defaults to `BulkActionBar` `onClearSelection`. */
  onClear?: () => void;
};

export const BulkActionBarClear = ({
  clearLabel,
  onClear,
  class: className,
  children,
  disabled,
  onClick,
  ...rest
}: BulkActionBarClearProps) => {
  const { pending, onClearSelection } = useBulkActionBar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="bulk-action-bar-clear"
      class={cn(bulkActionBarClear(), className)}
      aria-label={clearLabel}
      disabled={disabled ?? pending}
      onClick={(event) => {
        const handler = onClear ?? onClearSelection;
        handler?.();
        onClick?.(event);
      }}
      {...rest}
    >
      {children ?? clearLabel}
    </Button>
  );
};
