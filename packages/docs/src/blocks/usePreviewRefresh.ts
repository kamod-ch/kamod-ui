import { useTimeout } from "@kamod-ch/hooks";
import { useCallback, useRef, useState } from "preact/hooks";

export type PreviewRefreshPhase = "idle" | "loading" | "complete" | "resetting";
type RefreshState = { key: number; phase: PreviewRefreshPhase };

/** Match completion to the requested frame and keep repeat clicks locked through the visual reset. */
export function usePreviewRefresh() {
  const [state, setState] = useState<RefreshState>({ key: 0, phase: "idle" });
  const current = useRef(state);
  const transition = useCallback((next: RefreshState) => {
    current.current = next;
    setState(next);
  }, []);
  const refresh = useCallback(() => {
    if (current.current.phase !== "idle") return false;
    transition({ key: current.current.key + 1, phase: "loading" });
    return true;
  }, [transition]);
  const complete = useCallback(
    (key: number) => {
      if (key === current.current.key && current.current.phase === "loading") {
        transition({ key, phase: "complete" });
      }
    },
    [transition],
  );
  const cancel = useCallback(
    (key: number) => {
      if (key === current.current.key && current.current.phase === "loading") {
        transition({ key, phase: "resetting" });
      }
    },
    [transition],
  );

  useTimeout(
    () => transition({ ...current.current, phase: "resetting" }),
    state.phase === "complete" ? 1100 : undefined,
  );
  // Match the control's 200ms background transition before accepting another refresh.
  useTimeout(
    () => transition({ ...current.current, phase: "idle" }),
    state.phase === "resetting" ? 200 : undefined,
  );
  // A stalled document must not leave the action locked indefinitely.
  useTimeout(() => cancel(state.key), state.phase === "loading" ? 30000 : undefined);

  return { previewKey: state.key, phase: state.phase, refresh, complete, cancel };
}
