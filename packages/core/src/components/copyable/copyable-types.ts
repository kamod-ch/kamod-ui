export type CopyStatus = "idle" | "copied" | "error";

export type CopyToClipboardFailureReason = "unsupported" | "denied" | "failed";

export type CopyToClipboardResult =
  | { ok: true; method: "clipboard-api" | "exec-command" }
  | { ok: false; reason: CopyToClipboardFailureReason; message: string };

export type UseCopyToClipboardOptions = {
  /** Reset copied/error feedback after this many ms. */
  resetMs?: number;
  /** Default error message when copy fails. */
  defaultErrorMessage?: string;
};

export type UseCopyToClipboardReturn = {
  status: CopyStatus;
  errorMessage: string | null;
  isCopying: boolean;
  copy: (text: string, fallback?: () => void) => Promise<boolean>;
  reset: () => void;
};
