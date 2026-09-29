import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type {
  ResizableDirection,
  ResizablePanelDefinition,
  ResizableSizePercent,
} from "./resizable-types";

export type ResizableContextValue = {
  direction: ResizableDirection;
  panels: readonly ResizablePanelDefinition[];
  sizes: ResizableSizePercent[];
  setSizes: (next: ResizableSizePercent[]) => void;
  keyboardStep: number;
  containerRef: { current: HTMLDivElement | null };
  rtl: boolean;
};

export const ResizableContext = createContext<ResizableContextValue | null>(null);

export const useResizableContext = (): ResizableContextValue => {
  const context = useContext(ResizableContext);
  if (!context) {
    throw new Error("Resizable components must be used within ResizablePanelGroup.");
  }
  return context;
};
