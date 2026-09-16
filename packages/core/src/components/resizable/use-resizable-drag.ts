import { useEffect, useRef } from "preact/hooks";
import type { ResizableDirection } from "./resizable-types";
import { pixelDeltaToPercent } from "./resizable-utils";

type DragSession = {
  pointerId: number;
  handleIndex: number;
  startCoord: number;
  startSizes: number[];
  previousUserSelect: string;
  previousCursor: string;
};

export const useResizableDrag = ({
  direction,
  containerRef,
  onDrag,
  onDragEnd,
}: {
  direction: ResizableDirection;
  containerRef: { current: HTMLDivElement | null };
  onDrag: (handleIndex: number, deltaPercent: number, startSizes: number[]) => void;
  onDragEnd?: () => void;
}) => {
  const sessionRef = useRef<DragSession | null>(null);

  useEffect(() => {
    return () => {
      const session = sessionRef.current;
      if (!session) return;
      document.body.style.userSelect = session.previousUserSelect;
      document.body.style.cursor = session.previousCursor;
      sessionRef.current = null;
    };
  }, []);

  const endSession = (target: HTMLElement | null, pointerId: number) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== pointerId) return;

    try {
      target?.releasePointerCapture(pointerId);
    } catch {
      // Ignore release failures during unmount or lost capture.
    }

    document.body.style.userSelect = session.previousUserSelect;
    document.body.style.cursor = session.previousCursor;
    sessionRef.current = null;
    onDragEnd?.();
  };

  const getCoord = (event: PointerEvent): number =>
    direction === "horizontal" ? event.clientX : event.clientY;

  const getContainerSize = (): number => {
    const container = containerRef.current;
    if (!container) return 0;
    return direction === "horizontal" ? container.clientWidth : container.clientHeight;
  };

  const onPointerDown = (handleIndex: number, event: PointerEvent, startSizes: number[]) => {
    if (event.button !== 0) return;
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    event.preventDefault();
    target.setPointerCapture(event.pointerId);

    sessionRef.current = {
      pointerId: event.pointerId,
      handleIndex,
      startCoord: getCoord(event),
      startSizes: [...startSizes],
      previousUserSelect: document.body.style.userSelect,
      previousCursor: document.body.style.cursor,
    };
    document.body.style.userSelect = "none";
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
  };

  const onPointerMove = (event: PointerEvent) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;

    const deltaPixels = getCoord(event) - session.startCoord;
    const deltaPercent = pixelDeltaToPercent(deltaPixels, getContainerSize());
    onDrag(session.handleIndex, deltaPercent, session.startSizes);
  };

  const onPointerUp = (event: PointerEvent) => {
    endSession(event.currentTarget as HTMLElement | null, event.pointerId);
  };

  const onPointerCancel = (event: PointerEvent) => {
    endSession(event.currentTarget as HTMLElement | null, event.pointerId);
  };

  const onLostPointerCapture = (event: PointerEvent) => {
    endSession(event.currentTarget as HTMLElement | null, event.pointerId);
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
  };
};
