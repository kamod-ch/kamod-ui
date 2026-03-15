import { tv } from "tailwind-variants";
import { Input, type InputProps } from "../input/Input";

export const inputGroupInput = tv({
  base: [
    "h-full flex-1 rounded-none border-0 shadow-none ring-0 outline-none focus-visible:ring-0",
    "disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent"
  ]
});

export type InputGroupInputProps = InputProps;

export const InputGroupInput = ({ class: className, ...rest }: InputGroupInputProps) => (
  <Input class={inputGroupInput({ class: className as string | undefined })} data-slot="input-group-control" {...rest} />
);

