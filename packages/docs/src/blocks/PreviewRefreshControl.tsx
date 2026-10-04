import { CheckIcon, RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { useTabs } from "@kamod-ch/ui/tabs";
import type { PreviewRefreshPhase } from "./usePreviewRefresh";

/** Shared loading, completion and cooldown feedback for every showcase reset action. */
export function PreviewRefreshControl({
  phase,
  onRefresh,
  action = "refresh",
}: {
  phase: PreviewRefreshPhase;
  onRefresh: () => boolean;
  action?: "refresh" | "reset";
}) {
  const { setValue } = useTabs();
  const reset = action === "reset";
  const labels = reset
    ? { idle: "Reset", loading: "Resetting…", complete: "Reset" }
    : { idle: "Refresh", loading: "Refreshing…", complete: "Refreshed" };
  const label = labels[phase === "resetting" ? "idle" : phase];
  return (
    <>
      <button
        type="button"
        class="docs-icon-button blocks-showcase-control blocks-showcase-refresh"
        data-refresh-state={phase}
        disabled={phase !== "idle"}
        aria-busy={phase === "loading"}
        aria-label={reset ? "Reset example" : label}
        title={
          reset
            ? "Reset this example to its initial state"
            : "Reload the preview and reset its demo state"
        }
        onClick={() => {
          if (onRefresh()) setValue("preview");
        }}
      >
        <span class="blocks-showcase-refresh-icon" aria-hidden="true">
          <RefreshCwIcon class="blocks-showcase-refresh-spinner" />
          <CheckIcon class="blocks-showcase-refresh-check" />
        </span>
        <span
          class={`blocks-showcase-refresh-label blocks-showcase-control-label${reset ? " component-example-reset-label" : ""}`}
        >
          {label}
        </span>
      </button>
      <span class="sr-only" role="status">
        {phase === "loading"
          ? reset
            ? "Resetting example."
            : "Refreshing preview."
          : phase === "complete"
            ? reset
              ? "Example reset."
              : "Preview refreshed."
            : ""}
      </span>
    </>
  );
}
