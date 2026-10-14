import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { withBasePath } from "../../../base-path";
import { applyPreviewAppearance, type PreviewAppearance } from "../../../blocks/preview-appearance";
import { ShowcaseLoading } from "../ShowcaseLoading";
import { usePreviewActivation } from "./usePreviewActivation";

/** Isolated examples share an initialization budget, retaining state once their document is ready. */
export function ComponentPreviewFrame({
  slug,
  index,
  title,
  appearance,
  previewKey = 0,
  onLoad,
  onCancel,
  showLoading = true,
}: {
  slug: string;
  index: number;
  title: string;
  appearance: PreviewAppearance;
  previewKey?: number;
  onLoad?: (key: number) => void;
  onCancel?: (key: number) => void;
  /** Embedded workspaces may own a loading overlay for their entire panel. */
  showLoading?: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
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
  const {
    active: visible,
    isActive,
    complete,
  } = usePreviewActivation(frame, () => {
    stopMeasuring();
    onCancel?.(previewKey);
  });
  const applyAppearance = () => {
    const root = frame.current?.contentDocument?.documentElement;
    if (root) applyPreviewAppearance(root, appearance);
  };
  useLayoutEffect(applyAppearance, [appearance]);
  useLayoutEffect(() => stopMeasuring, []);
  // Leaving Preview cancels loading; stale events are ignored by the shared refresh state machine.
  useEffect(() => () => onCancel?.(previewKey), [previewKey, onCancel]);

  return (
    <div
      class="showcase-preview-surface"
      data-loading={phase === "loading" || undefined}
      data-deferred={!visible || undefined}
      aria-busy={phase === "loading"}
    >
      <iframe
        ref={frame}
        class="component-example-frame"
        data-example-index={index}
        title={`${title} interactive example ${index + 1}`}
        aria-hidden={phase === "loading" || undefined}
        tabIndex={phase === "loading" ? -1 : undefined}
        src={
          // An empty src resolves to this page; deferred previews need an explicit blank URL.
          visible
            ? withBasePath(
                `/component-preview-frame.htm?component=${encodeURIComponent(slug)}&example=${index}`,
              )
            : "about:blank"
        }
        style={{ height }}
        onError={() => {
          if (!isActive()) return;
          complete();
          setPhase("error");
          onCancel?.(previewKey);
        }}
        onLoad={() => {
          if (!isActive()) return;
          applyAppearance();
          stopMeasuring();
          const root = frame.current?.contentDocument?.getElementById("component-preview-root");
          if (!root) {
            // A cancelled or not-yet-navigated frame can still deliver its blank load event.
            if (frame.current?.contentDocument?.URL === "about:blank") return;
            complete();
            setPhase("error");
            onCancel?.(previewKey);
            return;
          }
          const ready = () => {
            complete();
            setPhase("ready");
            onLoad?.(previewKey);
          };
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
              setHeight(
                Math.max(320, Math.min(720, Math.ceil(root.getBoundingClientRect().height))),
              );
            });
          };
          observer.current = new ResizeObserver(measure);
          observer.current.observe(root);
          measure();
        }}
      />
      {showLoading && phase === "loading" && (
        <ShowcaseLoading appearance={appearance} view="preview" />
      )}
      {phase === "error" && (
        <div class="showcase-preview-error" role="alert">
          The example could not load. Use Reset to try again.
        </div>
      )}
    </div>
  );
}
