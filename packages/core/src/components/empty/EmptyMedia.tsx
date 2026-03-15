import type { ComponentChildren, JSX } from "preact";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { emptyMedia } from "./empty-variants";

export type EmptyMediaProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyMedia> & {
    children?: ComponentChildren;
  };

export const EmptyMedia = ({
  class: className,
  variant,
  children,
  ...rest
}: EmptyMediaProps) => (
  <div class={cn(emptyMedia({ variant }), className)} data-slot="empty-media" {...rest}>
    {children}
  </div>
);
