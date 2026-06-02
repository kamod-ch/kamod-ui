import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type ContextMenuRadioContextValue = {
  value: string;
  setValue: (next: string) => void;
};

const ContextMenuRadioContext = createContext<ContextMenuRadioContextValue | null>(null);

export const ContextMenuRadioProvider = ({
  children,
  value,
}: {
  children: ComponentChildren;
  value: ContextMenuRadioContextValue;
}) => <ContextMenuRadioContext.Provider value={value}>{children}</ContextMenuRadioContext.Provider>;

export const useContextMenuRadio = () => {
  const ctx = useContext(ContextMenuRadioContext);
  if (!ctx) throw new Error("ContextMenuRadioItem must be used within ContextMenuRadioGroup");
  return ctx;
};
