import type { JSX } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const cardTitle = tv({
  base: "font-heading min-w-0 break-words text-xl leading-snug font-semibold group-data-[size=sm]/card:text-base",
});

export type CardTitleProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardTitle = ({ class: className, ...rest }: CardTitleProps) => (
  <div class={cn(cardTitle(), className)} data-slot="card-title" {...rest} />
);
