import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useBulkActionBar } from "./bulk-action-bar-context";
import { bulkActionBarCount } from "./bulk-action-bar-variants";

export type BulkActionBarCountProps = Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "children"> & {
  /** Override the count from context when composing outside the provider tree. */
  selectedCount?: number;
  /** Localized singular/plural label, e.g. `(count) => count === 1 ? '1 row' : \`${count} rows\``. */
  formatCount?: (count: number) => ComponentChildren;
  children?: ComponentChildren;
};

export const BulkActionBarCount = ({
  selectedCount: selectedCountProp,
  formatCount,
  class: className,
  children,
  ...rest
}: BulkActionBarCountProps) => {
  const { selectedCount: contextCount } = useBulkActionBar();
  const count = selectedCountProp ?? contextCount;
  const content = formatCount ? formatCount(count) : children;

  return (
    <p
      data-slot="bulk-action-bar-count"
      class={cn(bulkActionBarCount(), className)}
      aria-live="polite"
      aria-atomic="true"
      {...rest}
    >
      {content}
    </p>
  );
};
