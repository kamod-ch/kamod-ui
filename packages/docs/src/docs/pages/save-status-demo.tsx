import { Field, FieldLabel, Textarea } from "@kamod-ch/ui";
import { SaveStatus, useAutosaveDraft } from "@kamod-ch/ui/save-status";
import { useMemo, useState } from "preact/hooks";

const LABELS = {
  pristine: "No changes",
  dirty: "Unsaved changes",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
  offline: "Offline",
  lastSaved: (time: string) => `(last saved ${time})`,
  retry: "Retry",
};

const createSimulatedAdapter = (options?: { failRevision?: number; delayMs?: number }) => {
  const { failRevision, delayMs = 600 } = options ?? {};
  return async ({
    revision,
    signal,
  }: {
    revision: number;
    content: string;
    signal: AbortSignal;
  }) => {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, delayMs);
      signal.addEventListener("abort", () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
    if (signal.aborted) return;
    if (failRevision === revision) {
      throw new Error(`Simulated failure for revision ${revision}`);
    }
  };
};

export const SaveStatusStatesDemo = () => {
  const [status, setStatus] = useState<
    "pristine" | "dirty" | "saving" | "saved" | "error" | "offline"
  >("pristine");

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        {(["pristine", "dirty", "saving", "saved", "error", "offline"] as const).map((value) => (
          <button
            key={value}
            type="button"
            class="border-border rounded-md border px-2 py-1 text-xs"
            onClick={() => setStatus(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <SaveStatus
        status={status}
        labels={LABELS}
        errorMessage={status === "error" ? "Network unavailable" : undefined}
        lastSavedAt={status === "saved" ? "2026-08-14T10:15:00.000Z" : undefined}
        formatOptions={{ locale: "en-US", timeZone: "UTC" }}
        onRetry={() => setStatus("saving")}
      />
      <SaveStatus status="dirty" labels={LABELS} size="compact" />
    </div>
  );
};

/** Simulated autosave — consumer-owned debounce, revisions, and adapter. */
export const AutosaveDraftDemo = () => {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [offline, setOffline] = useState(false);
  const failRevision = useMemo(() => (simulateFailure ? 2 : undefined), [simulateFailure]);
  const adapter = useMemo(
    () => createSimulatedAdapter({ failRevision, delayMs: 700 }),
    [failRevision],
  );

  const draft = useAutosaveDraft({
    adapter,
    debounceMs: 450,
    offline,
    initialContent: "Draft notes…",
  });

  return (
    <div class="grid max-w-xl gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <SaveStatus
          status={draft.status}
          hasUnsavedChanges={draft.hasUnsavedChanges}
          labels={LABELS}
          errorMessage={draft.errorMessage ?? undefined}
          lastSavedAt={draft.lastSavedAt ?? undefined}
          formatOptions={{ locale: "en-US", timeZone: "UTC" }}
          onRetry={draft.retry}
          size="compact"
        />
        <div class="text-muted-foreground text-xs">
          rev {draft.revision} · saved {draft.savedRevision}
        </div>
      </div>
      <Field>
        <FieldLabel htmlFor="autosave-draft">Notes</FieldLabel>
        <Textarea
          id="autosave-draft"
          rows={5}
          value={draft.content}
          onInput={(event) => draft.setContent(event.currentTarget.value)}
        />
      </Field>
      <div class="flex flex-wrap gap-4 text-xs">
        <label>
          <input
            type="checkbox"
            checked={simulateFailure}
            onInput={(event) => setSimulateFailure(event.currentTarget.checked)}
          />{" "}
          Fail revision 2 once
        </label>
        <label>
          <input
            type="checkbox"
            checked={offline}
            onInput={(event) => setOffline(event.currentTarget.checked)}
          />{" "}
          Report offline (consumer flag)
        </label>
      </div>
      <p class="text-muted-foreground text-xs">
        Adapter delay is simulated locally. Edits debounce at the consumer; stale save responses
        never overwrite newer revisions.
      </p>
    </div>
  );
};
