import type { ComponentChildren, JSX } from "preact";

export type SaveStatusState = "pristine" | "dirty" | "saving" | "saved" | "error" | "offline";

export type SaveStatusFormatOptions = {
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

export type SaveStatusLabels = {
  pristine: ComponentChildren;
  dirty: ComponentChildren;
  saving: ComponentChildren;
  saved: ComponentChildren;
  error: ComponentChildren;
  offline: ComponentChildren;
  /** Optional suffix when `lastSavedAt` is set — receives formatted absolute time. */
  lastSaved?: (formattedTime: string) => ComponentChildren;
  retry?: ComponentChildren;
};

export type SaveStatusProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
  status: SaveStatusState;
  labels: SaveStatusLabels;
  /** When true, never present as pristine/saved even if `status` says so. */
  hasUnsavedChanges?: boolean;
  errorMessage?: ComponentChildren;
  lastSavedAt?: Date | string;
  formatOptions?: SaveStatusFormatOptions;
  onRetry?: () => void;
  size?: "default" | "compact";
};

export type AutosaveAdapter = (context: {
  revision: number;
  content: string;
  signal: AbortSignal;
}) => Promise<void>;

export type UseAutosaveDraftOptions = {
  adapter: AutosaveAdapter;
  initialContent?: string;
  debounceMs?: number;
  offline?: boolean;
};

export type UseAutosaveDraftResult = {
  content: string;
  setContent: (next: string) => void;
  revision: number;
  savedRevision: number;
  hasUnsavedChanges: boolean;
  status: SaveStatusState;
  errorMessage: string | null;
  lastSavedAt: Date | null;
  retry: () => void;
};
