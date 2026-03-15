import { CommandInput, type CommandInputProps } from "../command/CommandInput";
import { cn } from "../../lib/utils";

export const ComboboxInput = ({ class: className, ...rest }: CommandInputProps) => (
  <CommandInput class={cn(className)} {...rest} />
);

export type { CommandInputProps as ComboboxInputProps };
