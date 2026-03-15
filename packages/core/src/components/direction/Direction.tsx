import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DirectionValue = "ltr" | "rtl";

const DirectionContext = createContext<DirectionValue>("ltr");

/** Returns the active text direction from the nearest `DirectionProvider` / `Direction` wrapper (default `ltr`). */
export const useDirection = () => useContext(DirectionContext);

export type DirectionProviderProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "dir"> & {
  /** Text direction for the subtree — matches shadcn `DirectionProvider` (`direction` prop). */
  direction?: DirectionValue;
  children?: ComponentChildren;
  "data-slot"?: string;
};

/**
 * Sets both React context and the HTML `dir` attribute on a wrapping element so logical CSS (`ms-*`, `me-*`, etc.) resolves correctly.
 * For full-document RTL, also set `dir` on `<html>` (see docs).
 */
export const DirectionProvider = ({
  direction = "ltr",
  class: className,
  children,
  "data-slot": dataSlot = "direction-provider",
  ...rest
}: DirectionProviderProps) => (
  <DirectionContext.Provider value={direction}>
    <div dir={direction} data-slot={dataSlot} class={cn(className)} {...rest}>
      {children}
    </div>
  </DirectionContext.Provider>
);

export type DirectionProps = Omit<DirectionProviderProps, "direction"> & {
  /** Kamod legacy prop — same as `direction` on `DirectionProvider`. */
  dir?: DirectionValue;
};

/** Same as `DirectionProvider` but uses prop `dir` instead of `direction` (backwards compatible). */
export const Direction = ({ dir = "ltr", ...rest }: DirectionProps) => (
  <DirectionProvider direction={dir} data-slot="direction" {...rest} />
);
