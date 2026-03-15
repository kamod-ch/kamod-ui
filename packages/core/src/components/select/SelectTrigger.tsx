import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useSelect } from "./Select";

export type SelectTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const SelectTrigger = ({ children, onClick, onKeyDown, ref, class: className, ...rest }: SelectTriggerProps) => {
  const select = useSelect();

  const setRefs = (node: HTMLButtonElement | null) => {
    select.setTriggerNode(node);
    if (typeof ref === "function") {
      ref(node);
      return;
    }
    if (ref && typeof ref === "object") {
      ref.current = node;
    }
  };

  return (
    <button
      ref={setRefs}
      type="button"
      data-slot="select-trigger"
      id={select.triggerId}
      aria-haspopup="listbox"
      aria-controls={select.contentId}
      aria-expanded={select.open.value}
      data-state={select.open.value ? "open" : "closed"}
      class={cn(
        "border-input bg-background dark:bg-input/30 placeholder:text-muted-foreground flex h-8 w-full items-center justify-between gap-2 rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
        "hover:border-foreground/15",
        "focus-visible:border-outline focus-visible:ring-3 focus-visible:ring-outline/50",
        "data-[state=open]:border-outline data-[state=open]:ring-3 data-[state=open]:ring-outline/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        select.setOpen(!select.open.value);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            if (!select.open.value) {
              select.openAndFocus("selected");
            } else {
              select.moveActive("next");
              select.focusActiveItem();
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (!select.open.value) {
              select.openAndFocus("last");
            } else {
              select.moveActive("prev");
              select.focusActiveItem();
            }
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            if (!select.open.value) {
              select.openAndFocus("selected");
            }
            break;
          default:
            break;
        }
        onKeyDown?.(event);
      }}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        class="text-muted-foreground pointer-events-none size-4 shrink-0 opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  );
};
