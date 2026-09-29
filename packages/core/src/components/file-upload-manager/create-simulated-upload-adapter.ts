import type { UploadAdapter, UploadAdapterResult } from "./file-upload-manager-types";

export type SimulatedUploadAdapterOptions = {
  /** Filenames containing this substring fail once before succeeding on retry. */
  failPattern?: string;
  /** Minimum simulated upload duration in ms. */
  minDurationMs?: number;
  /** Report determinate progress. Set false to emit indeterminate (`null`) progress only. */
  determinateProgress?: boolean;
};

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Upload aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(() => resolve(), ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Upload aborted", "AbortError"));
      },
      { once: true },
    );
  });

/**
 * Demo-only adapter — simulates success, failure, abort, and parallel uploads.
 * Inject a real transport adapter in production integrations.
 */
export const createSimulatedUploadAdapter = (
  options: SimulatedUploadAdapterOptions = {},
): UploadAdapter => {
  const { failPattern = "fail", minDurationMs = 400, determinateProgress = true } = options;

  const attemptCounts = new Map<string, number>();

  return async ({ file, signal, onProgress }) => {
    const key = `${file.name}:${file.size}:${file.lastModified}`;
    const attempt = (attemptCounts.get(key) ?? 0) + 1;
    attemptCounts.set(key, attempt);

    const steps = 4;
    for (let step = 0; step < steps; step += 1) {
      await sleep(minDurationMs / steps, signal);
      if (determinateProgress) {
        onProgress?.(Math.round(((step + 1) / steps) * 100));
      } else {
        onProgress?.(null);
      }
    }

    if (file.name.toLowerCase().includes(failPattern.toLowerCase()) && attempt === 1) {
      throw new Error("Simulated upload failure.");
    }

    const result: UploadAdapterResult = {
      key: `simulated://${file.name}`,
      bytes: file.size,
    };
    return result;
  };
};
