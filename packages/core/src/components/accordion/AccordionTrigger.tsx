import type { ComponentChildren, JSX } from "preact";
import { useAccordion } from "./Accordion";
import { useAccordionItem } from "./AccordionItem";
import { cn } from "../../lib/utils";

export type AccordionTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  hideIndicator?: boolean;
  indicator?: ComponentChildren;
  children?: ComponentChildren;
};

const DefaultIndicator = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AccordionTrigger = ({
  hideIndicator = false,
  indicator,
  children,
  class: className,
  onClick,
  ...rest
}: AccordionTriggerProps) => {
  const { toggleValue } = useAccordion();
  const { value, isOpen, disabled } = useAccordionItem();

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      aria-expanded={isOpen}
      disabled={disabled}
      data-state={isOpen ? "open" : "closed"}
      class={cn(
        "flex w-full items-center justify-between gap-2 rounded-md py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        if (disabled) return;
        toggleValue(value);
        onClick?.(event);
      }}
      {...rest}
    >
      <span data-slot="accordion-trigger-label" class="min-w-0 flex-1 text-start">
        {children}
      </span>
      {!hideIndicator ? (
        <span
          data-slot="accordion-trigger-indicator"
          data-state={isOpen ? "open" : "closed"}
          class={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          {indicator ?? <DefaultIndicator />}
        </span>
      ) : null}
    </button>
  );
};
