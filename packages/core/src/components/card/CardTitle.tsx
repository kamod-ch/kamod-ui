import type { HTMLAttributes } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const cardTitle = tv({
  base: "font-heading min-w-0 break-words text-(length:--card-title-size) leading-(--card-title-line-height) font-(weight:--card-title-weight) group-data-[size=sm]/card:text-base",
});

export type CardTitleProps = HTMLAttributes<HTMLDivElement>;

export const CardTitle = ({ class: className, ...rest }: CardTitleProps) => (
  <div class={cn(cardTitle(), className)} data-slot="card-title" {...rest} />
);
