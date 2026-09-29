import type { ComponentChildren, JSX } from "preact";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { descriptionList } from "./description-list-variants";

export type DescriptionListLayout = NonNullable<VariantProps<typeof descriptionList>["layout"]>;

export type DescriptionListColumns = NonNullable<VariantProps<typeof descriptionList>["columns"]>;

export type DescriptionListProps = JSX.HTMLAttributes<HTMLDListElement> &
  VariantProps<typeof descriptionList> & {
    children?: ComponentChildren;
  };

export const DescriptionList = ({
  layout,
  columns,
  bordered,
  class: className,
  children,
  ...rest
}: DescriptionListProps) => {
  const resolvedLayout = layout ?? "stacked";
  const resolvedColumns = columns ?? 1;
  const resolvedBordered = bordered ?? false;

  return (
    <dl
      data-slot="description-list"
      data-layout={resolvedLayout}
      data-columns={String(resolvedColumns)}
      data-bordered={resolvedBordered ? "true" : undefined}
      class={cn(
        descriptionList({
          layout: resolvedLayout,
          columns: resolvedColumns,
          bordered: resolvedBordered,
        }),
        className,
      )}
      {...rest}
    >
      {children}
    </dl>
  );
};
