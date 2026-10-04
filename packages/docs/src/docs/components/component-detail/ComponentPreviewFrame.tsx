import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { withBasePath } from "../../../base-path";
import { applyPreviewAppearance, type PreviewAppearance } from "../../../blocks/preview-appearance";

/** Each example has its own document, including portal content and responsive styles. */
export function ComponentPreviewFrame({
  slug,
  index,
  title,
  appearance,
  previewKey = 0,
  onLoad,
  onCancel,
}: {
  slug: string;
  index: number;
  title: string;
  appearance: PreviewAppearance;
  previewKey?: number;
  onLoad?: (key: number) => void;
  onCancel?: (key: number) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const observer = useRef<ResizeObserver | null>(null);
  const resizeFrame = useRef<number | null>(null);
  const stopWaiting = useRef<(() => void) | null>(null);
  const stopMeasuring = () => {
    stopWaiting.current?.();
    stopWaiting.current = null;
    observer.current?.disconnect();
    observer.current = null;
    if (resizeFrame.current !== null) cancelAnimationFrame(resizeFrame.current);
    resizeFrame.current = null;
  };
  const [height, setHeight] = useState(320);
  const applyAppearance = () => {
    const root = frame.current?.contentDocument?.documentElement;
    if (root) applyPreviewAppearance(root, appearance);
  };
  useLayoutEffect(applyAppearance, [appearance]);
  useLayoutEffect(() => stopMeasuring, []);
  // Leaving Preview cancels loading; stale events are ignored by the shared refresh state machine.
  useEffect(() => () => onCancel?.(previewKey), [previewKey, onCancel]);
  useLayoutEffect(() => {
    const node = frame.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // Native iframe lazy loading can eagerly load several screens of examples at once.
    const visibility = new IntersectionObserver(
      (entries) => {
        // A fast section jump can batch the initial hidden and final visible entries together.
        if (!entries.at(-1)?.isIntersecting) return;
        setVisible(true);
        visibility.disconnect();
      },
      { rootMargin: "100px" },
    );
    visibility.observe(node);
    return () => visibility.disconnect();
  }, []);

  return (
    <iframe
      ref={frame}
      class="component-example-frame"
      data-example-index={index}
      title={`${title} interactive example ${index + 1}`}
      src={
        visible
          ? withBasePath(
              `/component-preview-frame.htm?component=${encodeURIComponent(slug)}&example=${index}`,
            )
          : undefined
      }
      style={{ height }}
      onError={() => onCancel?.(previewKey)}
      onLoad={() => {
        applyAppearance();
        stopMeasuring();
        const root = frame.current?.contentDocument?.getElementById("component-preview-root");
        if (!root) return;
        const ready = () => onLoad?.(previewKey);
        if (root.dataset.previewReady === "true") ready();
        else {
          const document = root.ownerDocument;
          document.addEventListener("kamod:preview-ready", ready, { once: true });
          stopWaiting.current = () => document.removeEventListener("kamod:preview-ready", ready);
        }
        const measure = () => {
          if (resizeFrame.current !== null) cancelAnimationFrame(resizeFrame.current);
          // Write in the next frame so resizing the iframe cannot re-enter its observer delivery.
          resizeFrame.current = requestAnimationFrame(() => {
            resizeFrame.current = null;
            setHeight(Math.max(320, Math.min(720, Math.ceil(root.getBoundingClientRect().height))));
          });
        };
        observer.current = new ResizeObserver(measure);
        observer.current.observe(root);
        measure();
      }}
    />
  );
}
