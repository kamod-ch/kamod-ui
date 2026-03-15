import { tv } from "tailwind-variants";
import { Textarea, type TextareaProps } from "../textarea/Textarea";

export const inputGroupTextarea = tv({
  base: [
    "h-full flex-1 resize-none rounded-none border-0 shadow-none ring-0 outline-none focus-visible:ring-0",
    "disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent"
  ]
});

export type InputGroupTextareaProps = TextareaProps;

export const InputGroupTextarea = ({ class: className, ...rest }: InputGroupTextareaProps) => (
  <Textarea
    class={inputGroupTextarea({ class: className as string | undefined })}
    data-slot="input-group-control"
    {...rest}
  />
);

