import type { ComponentChildren } from "preact";

export type CopyFieldTruncate = "middle" | "end" | false;

export type CopyFieldProps = {
  /** Full value copied to the clipboard — never truncated. */
  value: string;
  label?: ComponentChildren;
  description?: ComponentChildren;
  id?: string;
  class?: string;
  /** Visual truncation mode for long values. */
  truncate?: CopyFieldTruncate;
  /** Maximum visible characters before truncation. */
  maxDisplayLength?: number;
  copyLabel?: string;
  copiedLabel?: string;
  errorLabel?: string;
  /** Shown when clipboard APIs fail and the field is selected for manual copy. */
  fallbackHint?: string;
  disabled?: boolean;
  invalid?: boolean;
};
