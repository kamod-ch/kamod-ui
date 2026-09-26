import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type FilterBarContextValue = {
  focusFallbackRef: { current: HTMLElement | null };
  registerFocusFallback: (node: HTMLElement | null) => void;
};

export const FilterBarContext = createContext<FilterBarContextValue | null>(null);

export const useFilterBar = () => {
  const context = useContext(FilterBarContext);
  if (!context) {
    throw new Error("FilterBar subcomponents must be used within FilterBar");
  }
  return context;
};
