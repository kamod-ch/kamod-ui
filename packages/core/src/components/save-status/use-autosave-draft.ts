import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type {
  SaveStatusState,
  UseAutosaveDraftOptions,
  UseAutosaveDraftResult,
} from "./save-status-types";

export const useAutosaveDraft = ({
  adapter,
  initialContent = "",
  debounceMs = 400,
  offline = false,
}: UseAutosaveDraftOptions): UseAutosaveDraftResult => {
  const [content, setContentState] = useState(initialContent);
  const [revision, setRevision] = useState(0);
  const [savedRevision, setSavedRevision] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [phase, setPhase] = useState<"idle" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const latestRevisionRef = useRef(0);
  const latestContentRef = useRef(initialContent);
  const debounceTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inFlightRevisionRef = useRef<number | null>(null);

  const clearDebounce = () => {
    if (debounceTimerRef.current != null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  const hasUnsavedChanges = revision !== savedRevision;

  const resolveStatus = (): SaveStatusState => {
    if (offline) return "offline";
    if (isSaving || inFlightRevisionRef.current != null) return "saving";
    if (phase === "error") return "error";
    if (hasUnsavedChanges) return revision === 0 ? "pristine" : "dirty";
    if (revision === 0) return "pristine";
    return "saved";
  };

  const performSave = useCallback(
    async (targetRevision: number, snapshot: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      inFlightRevisionRef.current = targetRevision;
      setIsSaving(true);
      setPhase("idle");
      setErrorMessage(null);

      try {
        await adapter({
          revision: targetRevision,
          content: snapshot,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setSavedRevision((current) => Math.max(current, targetRevision));

        if (targetRevision === latestRevisionRef.current) {
          setLastSavedAt(new Date());
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (targetRevision < latestRevisionRef.current) return;

        setPhase("error");
        setErrorMessage(error instanceof Error ? error.message : "Save failed");
      } finally {
        if (inFlightRevisionRef.current === targetRevision) {
          inFlightRevisionRef.current = null;
        }
        setIsSaving(false);
      }
    },
    [adapter],
  );

  const scheduleSave = useCallback(
    (targetRevision: number, snapshot: string) => {
      clearDebounce();
      debounceTimerRef.current = window.setTimeout(() => {
        debounceTimerRef.current = null;
        void performSave(targetRevision, snapshot);
      }, debounceMs);
    },
    [debounceMs, performSave],
  );

  const setContent = useCallback(
    (next: string) => {
      setContentState(next);
      latestContentRef.current = next;
      const nextRevision = latestRevisionRef.current + 1;
      latestRevisionRef.current = nextRevision;
      setRevision(nextRevision);
      setPhase("idle");
      setErrorMessage(null);
      scheduleSave(nextRevision, next);
    },
    [scheduleSave],
  );

  const retry = useCallback(() => {
    if (offline) return;
    clearDebounce();
    void performSave(latestRevisionRef.current, latestContentRef.current);
  }, [offline, performSave]);

  useEffect(
    () => () => {
      clearDebounce();
      abortControllerRef.current?.abort();
    },
    [],
  );

  return {
    content,
    setContent,
    revision,
    savedRevision,
    hasUnsavedChanges,
    status: resolveStatus(),
    errorMessage,
    lastSavedAt,
    retry,
  };
};
