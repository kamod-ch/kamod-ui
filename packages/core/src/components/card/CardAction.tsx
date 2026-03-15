import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const cardAction = tv({
  base: "col-start-2 row-span-2 row-start-1 shrink-0 self-start justify-self-end"
});

export type CardActionProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardAction = ({ class: className, ...rest }: CardActionProps) => (
  <div class={cardAction({ class: className as string | undefined })} data-slot="card-action" {...rest} />
);

