import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { RefObject } from "preact";

export type ScrollAreaContextValue = {
  viewportRef: RefObject<HTMLDivElement | null>;
};

export const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);

export const useScrollAreaContext = () => {
  const ctx = useContext(ScrollAreaContext);
  if (!ctx) {
    throw new Error("ScrollBar and ScrollAreaCorner must be used within ScrollArea");
  }
  return ctx;
};
