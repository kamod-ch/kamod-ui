import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { cn } from "../../lib/utils";

const ResizableDirectionContext = createContext<"horizontal" | "vertical">("horizontal");

export type ResizablePanelGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  direction?: "horizontal" | "vertical";
  children?: ComponentChildren;
};

export const ResizablePanelGroup = ({
  class: className,
  direction = "horizontal",
  children,
  ...rest
}: ResizablePanelGroupProps) => (
  <ResizableDirectionContext.Provider value={direction}>
    <div
      data-slot="resizable-panel-group"
      data-direction={direction}
      aria-orientation={direction === "vertical" ? "vertical" : "horizontal"}
      class={cn(
        "flex w-full overflow-hidden rounded-lg border bg-muted/30 text-sm shadow-sm",
        direction === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  </ResizableDirectionContext.Provider>
);

export type ResizablePanelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  children?: ComponentChildren;
};

const toCssSize = (value?: number | string) => {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}%`;
  return value;
};

export const ResizablePanel = ({
  class: className,
  defaultSize,
  minSize,
  maxSize,
  style,
  children,
  ...rest
}: ResizablePanelProps) => {
  const direction = useContext(ResizableDirectionContext);
  const isHorizontal = direction === "horizontal";
  const styleObject = typeof style === "object" && style !== null ? style : undefined;
  return (
    <div
      data-slot="resizable-panel"
      class={cn("relative min-h-0 min-w-0 flex-1 overflow-hidden bg-background", className)}
      style={{
        flexBasis: toCssSize(defaultSize),
        minWidth: isHorizontal ? toCssSize(minSize) : undefined,
        maxWidth: isHorizontal ? toCssSize(maxSize) : undefined,
        minHeight: isHorizontal ? undefined : toCssSize(minSize),
        maxHeight: isHorizontal ? undefined : toCssSize(maxSize),
        ...styleObject
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export type ResizableHandleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
  orientation?: "horizontal" | "vertical";
};

export const ResizableHandle = ({
  class: className,
  withHandle = false,
  orientation = "vertical",
  ...rest
}: ResizableHandleProps) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      data-slot="resizable-handle"
      role="separator"
      tabIndex={0}
      aria-orientation={orientation}
      class={cn(
        "relative shrink-0 bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isVertical ? "w-px cursor-col-resize" : "h-px cursor-row-resize",
        withHandle
          ? "flex items-center justify-center before:rounded-full before:border before:border-border before:bg-background before:shadow-sm"
          : "",
        withHandle && isVertical ? "before:h-8 before:w-3" : "",
        withHandle && !isVertical ? "before:h-3 before:w-8" : "",
        className
      )}
      {...rest}
    />
  );
};

