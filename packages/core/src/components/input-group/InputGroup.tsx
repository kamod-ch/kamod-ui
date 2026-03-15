import type { ComponentChildren, JSX } from "preact";
import { tv } from "tailwind-variants";

export const inputGroup = tv({
  base: [
    "border-input dark:bg-input/30 group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border transition-colors outline-none",
    "has-[[data-slot=input-group-control]:focus-visible]:border-outline has-[[data-slot=input-group-control]:focus-visible]:ring-outline/50 has-[[data-slot=input-group-control]:focus-visible]:ring-3",
    "has-[[data-slot][aria-invalid=true]]:border-error has-[[data-slot][aria-invalid=true]]:ring-error/40 has-[[data-slot][aria-invalid=true]]:ring-3",
    "has-disabled:bg-input/50 has-disabled:opacity-50",
    "has-[>textarea]:h-auto",
    "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col",
    "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
    "has-[>[data-align=block-end]]:[&>[data-slot=input-group-control]]:pt-3",
    "has-[>[data-align=block-start]]:[&>[data-slot=input-group-control]]:pb-3",
    "has-[>[data-align=inline-end]]:[&>[data-slot=input-group-control]]:pr-1.5",
    "has-[>[data-align=inline-start]]:[&>[data-slot=input-group-control]]:pl-1.5"
  ]
});

export type InputGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const InputGroup = ({ class: className, children, ...rest }: InputGroupProps) => (
  <div role="group" class={inputGroup({ class: className as string | undefined })} data-slot="input-group" {...rest}>
    {children}
  </div>
);

