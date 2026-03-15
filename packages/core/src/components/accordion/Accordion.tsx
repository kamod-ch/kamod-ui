import { signal, type Signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  openValues: Signal<Set<string>>;
  toggleValue: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion subcomponents must be used within Accordion");
  return context;
};

export type AccordionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  /** When `type="single"`, `false` keeps one panel always open (clicking the open trigger does not close it). Default `true` matches common shadcn examples. */
  collapsible?: boolean;
  defaultValue?: string | string[];
  children?: ComponentChildren;
};

export const Accordion = ({
  type = "single",
  collapsible = true,
  defaultValue,
  children,
  ...rest
}: AccordionProps) => {
  const openValues = useMemo(() => {
    const initialSet = new Set<string>(
      defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
    );
    return signal(initialSet);
  }, []);

  const context: AccordionContextValue = {
    type,
    openValues,
    toggleValue: (value) => {
      const next = new Set(openValues.value);
      const isOpen = next.has(value);

      if (type === "single") {
        if (isOpen && !collapsible) {
          return;
        }
        next.clear();
        if (!isOpen) next.add(value);
      } else if (isOpen) {
        next.delete(value);
      } else {
        next.add(value);
      }

      openValues.value = next;
    }
  };

  return (
    <AccordionContext.Provider value={context}>
      <div data-slot="accordion" {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};
