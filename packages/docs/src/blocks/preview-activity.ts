import type { RefObject } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { observeViewportActivity } from "../layout/runtime/viewport-activity";

/** Local iframe documents need an explicit offscreen cue; their own viewport stays visible. */
export function setPreviewActivity(frame: HTMLIFrameElement | null, active: boolean) {
  frame?.contentDocument?.documentElement?.toggleAttribute("data-preview-paused", !active);
}

/** Pause inline and framed block motion while preserving the current interactive state. */
export function usePreviewActivity(
  region: RefObject<HTMLElement | null>,
  frame: RefObject<HTMLIFrameElement | null>,
  identity: string,
) {
  const active = useRef(false);
  const apply = () => {
    region.current?.toggleAttribute("data-preview-paused", !active.current);
    setPreviewActivity(frame.current, active.current);
  };
  useLayoutEffect(() => {
    const node = region.current;
    if (node)
      return observeViewportActivity(node, (visible) => {
        active.current = visible;
        apply();
      });
  }, [region, frame, identity]);
  return apply;
}
