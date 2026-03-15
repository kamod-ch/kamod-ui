import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { Separator, type SeparatorProps } from "../separator/Separator";

export const ItemSeparator = ({ class: className, ...rest }: SeparatorProps) => (
  <Separator
    orientation="horizontal"
    class={cn("my-0", className)}
    data-slot="item-separator"
    {...rest}
  />
);
