import type { RefObject } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { setPreviewActivity } from "../../../blocks/preview-activity";
import { observeViewportActivity } from "../../../layout/runtime/viewport-activity";
import { previewLoadQueue } from "./preview-load-queue";
import { previewRetention } from "./preview-retention";

/** Serialize startup, pause hidden examples, and retain only a small set of recent documents. */
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
    let visible = false;
    let release: (() => void) | undefined;
    let retained: ReturnType<typeof previewRetention.retain> | undefined;
    const syncActivity = () => {
      if (started.current) setPreviewActivity(node, visible);
    };
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
        retained = previewRetention.retain(() => {
          retained = undefined;
          started.current = false;
          setActive(false);
          suspend.current();
        }, visible);
        setActive(true);
      });
    };
    const stopVisibility = observeViewportActivity(node, (active) => {
      if (stopped) return;
      visible = active;
      syncActivity();
      retained?.setVisible(active);
      if (active && !started.current) enqueue();
      else if (!active) stop();
    });
    finish.current = () => {
      if (!started.current || stopped) return;
      release?.();
      release = undefined;
      syncActivity();
      retained?.complete();
    };
    return () => {
      stopped = true;
      started.current = false;
      finish.current = undefined;
      stopVisibility();
      release?.();
      retained?.release();
    };
  }, [frame]);

  return {
    active,
    isActive: () => started.current,
    complete: () => {
      finish.current?.();
      return started.current;
    },
  };
}
