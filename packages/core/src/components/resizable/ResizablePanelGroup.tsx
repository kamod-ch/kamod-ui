import { toChildArray } from "preact";
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useDirection } from "../direction/Direction";
import { ResizableHandleControl } from "./ResizableHandleControl";
import { ResizableContext } from "./resizable-context";
import type { ResizablePanelGroupProps, ResizableSizePercent } from "./resizable-types";
import {
  createEvenSizes,
  normalizeResizableSizes,
  parseResizableChildren,
  sizesApproximatelyEqual,
} from "./resizable-utils";
import { resizablePanel, resizablePanelGroup } from "./resizable-variants";

export const ResizablePanelGroup = ({
  direction = "horizontal",
  sizes: sizesProp,
  defaultSizes,
  onSizesChange,
  keyboardStep = 1,
  dir,
  class: className,
  children,
  ...rest
}: ResizablePanelGroupProps) => {
  const inheritedDirection = useDirection();
  const rtl = (dir ?? inheritedDirection) === "rtl";
  const containerRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => parseResizableChildren(toChildArray(children)), [children]);
  const panels = useMemo(() => layout.filter((item) => item.kind === "panel"), [layout]);

  const panelCount = panels.length;
  const initialSizes = useMemo(() => {
    const source = sizesProp ?? defaultSizes ?? createEvenSizes(panelCount);
    return normalizeResizableSizes(source, panelCount);
  }, [defaultSizes, panelCount, sizesProp]);

  const isControlled = sizesProp !== undefined;
  const [internalSizes, setInternalSizes] = useState<ResizableSizePercent[]>(initialSizes);
  const sizes = isControlled ? normalizeResizableSizes(sizesProp, panelCount) : internalSizes;

  if (isControlled && sizesProp && !sizesApproximatelyEqual(sizesProp)) {
    console.warn(
      "ResizablePanelGroup: controlled sizes should sum to 100 (%). Values were normalized.",
    );
  }

  useLayoutEffect(() => {
    if (!isControlled) {
      setInternalSizes(initialSizes);
    }
  }, [initialSizes, isControlled]);

  const setSizes = (next: ResizableSizePercent[]) => {
    const normalized = normalizeResizableSizes(next, panelCount);
    if (!isControlled) {
      setInternalSizes(normalized);
    }
    onSizesChange?.(normalized);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      // Percent sizes stay stable relative to the observed container — no state update required.
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const contextValue = useMemo(
    () => ({
      direction,
      panels,
      sizes,
      setSizes,
      keyboardStep,
      containerRef,
      rtl,
    }),
    [direction, keyboardStep, panels, rtl, sizes],
  );

  return (
    <ResizableContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        data-slot="resizable-panel-group"
        data-direction={direction}
        class={cn(resizablePanelGroup({ direction }), className)}
        {...rest}
      >
        {layout.map((item, index) => {
          if (item.kind === "panel") {
            const panelIndex = panels.findIndex((panel) => panel.id === item.id);
            const size = sizes[panelIndex] ?? 0;
            return (
              <div
                key={item.id}
                id={item.id}
                data-slot="resizable-panel"
                data-panel-id={item.id}
                data-panel-size={size}
                class={cn(resizablePanel(), item.class)}
                style={{
                  flexGrow: size,
                  flexShrink: 0,
                  flexBasis: 0,
                  minWidth: direction === "horizontal" ? `${item.minSize}%` : undefined,
                  maxWidth: direction === "horizontal" ? `${item.maxSize}%` : undefined,
                  minHeight: direction === "vertical" ? `${item.minSize}%` : undefined,
                  maxHeight: direction === "vertical" ? `${item.maxSize}%` : undefined,
                }}
              >
                {item.children}
              </div>
            );
          }

          return (
            <ResizableHandleControl
              key={`handle-${item.handleIndex}-${index}`}
              handleIndex={item.handleIndex}
              label={item.label}
              disabled={item.disabled}
              class={item.class}
            />
          );
        })}
      </div>
    </ResizableContext.Provider>
  );
};
