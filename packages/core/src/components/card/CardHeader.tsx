import type { JSX } from "preact";
import { tv } from "tailwind-variants";

export const cardHeader = tv({
  base: [
    "@container/card-header grid w-full min-w-0 auto-rows-min items-start gap-1.5 px-6 group-data-[size=sm]/card:px-4",
    // minmax(0,1fr) + min-w-0 on title/description keeps CardAction in the second column inside the card (flex preview children)
    "has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]"
  ]
});

export type CardHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export const CardHeader = ({ class: className, ...rest }: CardHeaderProps) => (
  <div class={cardHeader({ class: className as string | undefined })} data-slot="card-header" {...rest} />
);

