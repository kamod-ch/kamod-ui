import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const cardDescription = tv({
  base: "min-w-0 break-words text-muted-foreground text-sm group-data-[size=sm]/card:text-xs"
});

export type CardDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardDescription = ({ class: className, ...rest }: CardDescriptionProps) => (
  <div
    class={cardDescription({ class: className as string | undefined })}
    data-slot="card-description"
    {...rest}
  />
);

