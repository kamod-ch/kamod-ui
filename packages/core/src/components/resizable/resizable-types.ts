import type { ComponentChildren, JSX } from "preact";
import type { DirectionValue } from "../direction/Direction";

/** Public size unit: percentages of the group axis (0–100, sum = 100). */
export type ResizableSizePercent = number;

export type ResizableDirection = "horizontal" | "vertical";

export type ResizablePanelDefinition = {
  id: string;
  minSize: ResizableSizePercent;
  maxSize: ResizableSizePercent;
  children?: ComponentChildren;
  class?: string;
};

export type ResizableHandleDefinition = {
  label?: string;
  disabled?: boolean;
  class?: string;
};

export type ParsedResizableItem =
  | ({ kind: "panel" } & ResizablePanelDefinition)
  | ({ kind: "handle"; handleIndex: number } & ResizableHandleDefinition);

export type ResizablePanelGroupProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
  direction?: ResizableDirection;
  /** Controlled panel sizes in percent — must match panel count and sum to 100. */
  sizes?: ResizableSizePercent[];
  defaultSizes?: ResizableSizePercent[];
  onSizesChange?: (sizes: ResizableSizePercent[]) => void;
  /** Keyboard resize step in percent. */
  keyboardStep?: ResizableSizePercent;
  /** Overrides nearest `DirectionProvider` for horizontal resize mirroring. */
  dir?: DirectionValue;
  children?: ComponentChildren;
};

export type ResizablePanelProps = {
  /** Stable panel id within the group. */
  id: string;
  minSize?: ResizableSizePercent;
  maxSize?: ResizableSizePercent;
  class?: string;
  children?: ComponentChildren;
};

export type ResizableHandleProps = {
  /** Accessible name — defaults to a localized-friendly resize label. */
  label?: string;
  disabled?: boolean;
  class?: string;
};
