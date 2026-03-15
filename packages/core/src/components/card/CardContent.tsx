import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const cardContent = tv({
  base: "px-6 group-data-[size=sm]/card:px-4"
});

export type CardContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardContent = ({ class: className, ...rest }: CardContentProps) => (
  <div class={cardContent({ class: className as string | undefined })} data-slot="card-content" {...rest} />
);

