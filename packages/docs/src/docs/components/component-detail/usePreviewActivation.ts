import type { RefObject } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { previewLoadQueue } from "./preview-load-queue";

/** Skip queued previews outside the viewport; let started documents finish and retain their state. */
export function usePreviewActivation(
  frame: RefObject<HTMLIFrameElement | null>,
  onSuspend: () => void,
) {
  const [active, setActive] = useState(false);
  const started = useRef(false);
  const finish = useRef<(() => void) | undefined>(undefined);
  const suspend = useRef(onSuspend);
  suspend.current = onSuspend;

  useLayoutEffect(() => {
    const node = frame.current;
    if (!node) return;
    let stopped = false;
    let settled = false;
    let release: (() => void) | undefined;
    const stop = () => {
      // Aborting a started document can make the browser tear down expensive style/module work.
      if (!release || started.current) return;
      release();
      release = undefined;
      suspend.current();
    };
    const enqueue = () => {
      if (release || stopped) return;
      release = previewLoadQueue.enqueue(() => {
        if (stopped) return;
        started.current = true;
        setActive(true);
      });
    };
    const visibility =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (stopped || settled) return;
              // Fast jumps can deliver hidden and visible entries in the same batch.
              if (entries.at(-1)?.isIntersecting) enqueue();
              else stop();
            },
            { rootMargin: "100px" },
          );
    finish.current = () => {
      if (!started.current || stopped) return;
      settled = true;
      visibility?.disconnect();
      release?.();
      release = undefined;
    };
    if (visibility) visibility.observe(node);
    else enqueue();
    return () => {
      stopped = true;
      started.current = false;
      finish.current = undefined;
      visibility?.disconnect();
      release?.();
    };
  }, [frame]);

  return { active, isActive: () => started.current, complete: () => finish.current?.() };
}
