import type { ResizablePanelProps } from "./resizable-types";

/** Marker child — rendered by `ResizablePanelGroup` (not mounted directly). */
export const ResizablePanel = (_props: ResizablePanelProps): null => null;

ResizablePanel.__kamodResizablePanel = true as const;
