import type { ResizableHandleProps } from "./resizable-types";

/** Marker child — rendered by `ResizablePanelGroup` (not mounted directly). */
export const ResizableHandle = (_props: ResizableHandleProps): null => null;

ResizableHandle.__kamodResizableHandle = true as const;
