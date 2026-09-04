import type { JSX } from "preact";
import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const cardDescription = tv({
  base: "min-w-0 break-words text-muted-foreground text-sm group-data-[size=sm]/card:text-xs",
});

export type CardDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardDescription = ({ class: className, ...rest }: CardDescriptionProps) => (
  <div class={cn(cardDescription(), className)} data-slot="card-description" {...rest} />
);
