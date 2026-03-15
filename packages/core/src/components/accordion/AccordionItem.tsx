import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { useAccordion } from "./Accordion";

type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  disabled: boolean;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("Accordion item subcomponents must be used within AccordionItem");
  return context;
};

export type AccordionItemProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  children?: ComponentChildren;
};

export const AccordionItem = ({ value, disabled = false, children, ...rest }: AccordionItemProps) => {
  const { openValues } = useAccordion();
  const isOpen = openValues.value.has(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled }}>
      <div
        data-slot="accordion-item"
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...rest}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

