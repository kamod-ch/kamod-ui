import { useLayoutEffect, useRef, useState } from "preact/hooks";

type DownloadPhase = "idle" | "loading" | "complete" | "resetting" | "error";
const feedbackSteps = {
  loading: { next: "complete", delay: 600 },
  complete: { next: "resetting", delay: 1500 },
  resetting: { next: "idle", delay: 200 },
} as const;

/** Create a file only on demand; completion means browser handoff, not a confirmed disk write. */
export function useFileDownload(
  source: string,
  fileName: string,
  mimeType = "text/plain;charset=utf-8",
) {
  const [phase, setPhase] = useState<DownloadPhase>("idle");
  const current = useRef<DownloadPhase>("idle");
  const objectUrl = useRef<string | undefined>(undefined);
  const release = () => {
    const url = objectUrl.current;
    objectUrl.current = undefined;
    if (url) URL.revokeObjectURL(url);
  };
  const transition = (next: DownloadPhase) => {
    current.current = next;
    setPhase(next);
  };
  useLayoutEffect(() => {
    transition("idle");
    return release;
  }, [source, fileName, mimeType]);

  // One cancellable timer; retain the handed-off URL briefly for the browser to consume.
  useLayoutEffect(() => {
    if (current.current !== phase || phase === "idle" || phase === "error") return;
    const step = feedbackSteps[phase];
    const timer = setTimeout(() => {
      if (step.next === "resetting") release();
      transition(step.next);
    }, step.delay);
    return () => clearTimeout(timer);
  }, [phase, source, fileName, mimeType]);

  const download = () => {
    if (current.current !== "idle" && current.current !== "error") return;
    transition("loading");
    const link = document.createElement("a");
    try {
      objectUrl.current = URL.createObjectURL(new Blob([source], { type: mimeType }));
      link.href = objectUrl.current;
      link.download = fileName;
      link.hidden = true;
      document.body.append(link);
      // Initiate synchronously from the user's click to preserve browser activation.
      link.click();
    } catch {
      release();
      transition("error");
    } finally {
      link.remove();
    }
  };
  return { phase, download };
}
