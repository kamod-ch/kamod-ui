import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { useCommand } from "./Command";

export type CommandInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const CommandInput = ({ class: className, onInput, onKeyDown, ...rest }: CommandInputProps) => {
  const { query, autoHighlight, moveHighlight, activateHighlighted } = useCommand();
  void query.value;
  return (
    <input
      data-slot="command-input"
      class={cn("h-10 w-full border-b bg-transparent px-3 text-sm outline-none", className)}
      value={query.value}
      onInput={(event) => {
        query.value = event.currentTarget.value;
        onInput?.(event);
      }}
      onKeyDown={(event) => {
        if (autoHighlight) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveHighlight(1);
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveHighlight(-1);
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            activateHighlighted();
            return;
          }
        }
        onKeyDown?.(event);
      }}
      {...rest}
    />
  );
};
