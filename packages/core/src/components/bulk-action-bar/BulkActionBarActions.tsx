import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useBulkActionBar } from "./bulk-action-bar-context";
import { bulkActionBarActions } from "./bulk-action-bar-variants";

export type BulkActionBarActionsProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  children?: ComponentChildren;
  /** Accessible name for the action button group. */
  "aria-label": string;
};

export const BulkActionBarActions = ({
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: BulkActionBarActionsProps) => {
  const { pending } = useBulkActionBar();

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      inert={pending ? true : undefined}
      data-slot="bulk-action-bar-actions"
      data-pending={pending ? "true" : "false"}
      class={cn(bulkActionBarActions(), className)}
      {...rest}
    >
      {children}
    </div>
  );
};
