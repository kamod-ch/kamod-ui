import type { JSX } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const cardFooter = tv({
  base: "bg-muted/50 flex items-center rounded-b-xl border-t p-6 group-data-[size=sm]/card:p-4",
});

export type CardFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardFooter = ({ class: className, ...rest }: CardFooterProps) => (
  <div class={cn(cardFooter(), className)} data-slot="card-footer" {...rest} />
);
