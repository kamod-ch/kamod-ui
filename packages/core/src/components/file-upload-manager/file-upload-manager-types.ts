import type { ComponentChildren } from "preact";

export type UploadStatus = "queued" | "uploading" | "success" | "error" | "canceled";

/** Presentational upload entry — does not embed serializable `File` data. */
export type UploadFileEntry = {
  id: string;
  attemptId: string;
  name: string;
  size: number;
  status: UploadStatus;
  /** 0–100 when adapter reports determinate progress; `null` = indeterminate. */
  progress?: number | null;
  errorMessage?: string;
  /** Optional preview URL — revoke via queue/hook ownership, not part of serialized state. */
  previewUrl?: string;
};

export type UploadAdapterResult = {
  /** Adapter-specific payload — opaque to the queue UI. */
  key?: string;
  [key: string]: unknown;
};

export type UploadProgressUpdate = number | null;

export type UploadAdapterContext = {
  file: File;
  signal: AbortSignal;
  onProgress?: (progress: UploadProgressUpdate) => void;
};

export type UploadAdapter = (context: UploadAdapterContext) => Promise<UploadAdapterResult>;

export type UploadValidationRules = {
  maxFiles?: number;
  maxFileSize?: number;
  /** MIME types and/or extensions, e.g. `image/png`, `.pdf`. Selection hint only — not a security guarantee. */
  acceptedTypes?: string[];
};

export type UploadValidationErrorCode = "max-files" | "max-size" | "file-type" | "duplicate-batch";

export type UploadQueueLabels = {
  dropzone?: string;
  remove?: (entry: UploadFileEntry) => string;
  cancel?: (entry: UploadFileEntry) => string;
  retry?: (entry: UploadFileEntry) => string;
  statusQueued?: string;
  statusUploading?: string;
  statusSuccess?: string;
  statusError?: string;
  statusCanceled?: string;
  progressLabel?: (entry: UploadFileEntry) => string;
  progressIndeterminate?: string;
};

export type FileUploadItemPropsLabels = Pick<
  UploadQueueLabels,
  "remove" | "cancel" | "retry" | "progressLabel" | "progressIndeterminate"
>;

export type UploadQueueState = {
  items: UploadFileEntry[];
  enqueue: (files: File[]) => void;
  cancel: (id: string) => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
};

export type UseUploadQueueOptions = {
  adapter: UploadAdapter;
  concurrency?: number;
  validation?: UploadValidationRules;
  /** Create object URLs for image previews — revoked on remove/unmount. */
  createPreviewUrls?: boolean;
  onChange?: (items: UploadFileEntry[]) => void;
};

export type FileUploadListProps = {
  children?: ComponentChildren;
  empty?: ComponentChildren;
  class?: string;
};
