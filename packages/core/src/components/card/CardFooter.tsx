import type { HTMLAttributes } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const cardFooter = tv({
  base: "bg-[var(--card-footer-background,color-mix(in_oklab,var(--muted)_50%,transparent))] flex items-center rounded-b-xl border-t p-(--card-padding) group-data-[size=sm]/card:p-4",
});

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = ({ class: className, ...rest }: CardFooterProps) => (
  <div class={cn(cardFooter(), className)} data-slot="card-footer" {...rest} />
);
