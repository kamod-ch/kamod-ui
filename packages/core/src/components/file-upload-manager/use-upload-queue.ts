import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type {
  UploadFileEntry,
  UploadQueueState,
  UseUploadQueueOptions,
} from "./file-upload-manager-types";
import {
  createUploadAttemptId,
  createUploadEntryId,
  shouldCreatePreviewUrl,
  validateUploadFile,
} from "./file-upload-manager-utils";

type InternalRecord = {
  file: File;
  entry: UploadFileEntry;
  abortController: AbortController | null;
};

const toPublicItems = (records: Map<string, InternalRecord>): UploadFileEntry[] =>
  Array.from(records.values()).map((record) => ({ ...record.entry }));

export const useUploadQueue = ({
  adapter,
  concurrency = 2,
  validation,
  createPreviewUrls = false,
  onChange,
}: UseUploadQueueOptions): UploadQueueState => {
  const recordsRef = useRef(new Map<string, InternalRecord>());
  const previewUrlsRef = useRef(new Set<string>());
  const disposedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const adapterRef = useRef(adapter);
  const [items, setItems] = useState<UploadFileEntry[]>([]);

  onChangeRef.current = onChange;
  adapterRef.current = adapter;

  const emitChange = useCallback((nextItems: UploadFileEntry[]) => {
    if (disposedRef.current) return;
    setItems(nextItems);
    onChangeRef.current?.(nextItems);
  }, []);

  const syncItems = useCallback(() => {
    emitChange(toPublicItems(recordsRef.current));
  }, [emitChange]);

  const revokePreview = useCallback((url?: string) => {
    if (!url) return;
    URL.revokeObjectURL(url);
    previewUrlsRef.current.delete(url);
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<UploadFileEntry>) => {
      const record = recordsRef.current.get(id);
      if (!record) return;
      record.entry = { ...record.entry, ...patch };
      syncItems();
    },
    [syncItems],
  );

  const removeRecord = useCallback(
    (id: string) => {
      const record = recordsRef.current.get(id);
      if (!record) return;
      revokePreview(record.entry.previewUrl);
      recordsRef.current.delete(id);
      syncItems();
    },
    [revokePreview, syncItems],
  );

  const pumpQueueRef = useRef<() => void>(() => {});
  const runUploadRef = useRef<(id: string) => Promise<void>>(async () => {});

  runUploadRef.current = async (id: string) => {
    const record = recordsRef.current.get(id);
    if (!record || record.entry.status !== "queued") return;

    const attemptId = record.entry.attemptId;
    const abortController = new AbortController();
    record.abortController = abortController;

    updateEntry(id, { status: "uploading", progress: null, errorMessage: undefined });

    try {
      const result = await adapterRef.current({
        file: record.file,
        signal: abortController.signal,
        onProgress: (progress) => {
          if (disposedRef.current) return;
          const current = recordsRef.current.get(id);
          if (!current || current.entry.attemptId !== attemptId) return;
          if (current.entry.status !== "uploading") return;
          updateEntry(id, { progress });
        },
      });

      if (disposedRef.current) return;
      const current = recordsRef.current.get(id);
      if (!current || current.entry.attemptId !== attemptId) return;

      record.abortController = null;
      updateEntry(id, { status: "success", progress: 100, errorMessage: undefined });
      void result;
    } catch (error) {
      if (disposedRef.current) return;
      const current = recordsRef.current.get(id);
      if (!current || current.entry.attemptId !== attemptId) return;

      record.abortController = null;
      if (abortController.signal.aborted) {
        updateEntry(id, { status: "canceled", progress: undefined, errorMessage: undefined });
        return;
      }

      const message = error instanceof Error ? error.message : "Upload failed.";
      updateEntry(id, { status: "error", progress: undefined, errorMessage: message });
    } finally {
      if (!disposedRef.current) {
        pumpQueueRef.current();
      }
    }
  };

  const pumpQueue = useCallback(() => {
    if (disposedRef.current) return;

    const activeUploads = Array.from(recordsRef.current.values()).filter(
      (record) => record.entry.status === "uploading",
    ).length;

    if (activeUploads >= concurrency) return;

    const slots = concurrency - activeUploads;
    const queued = Array.from(recordsRef.current.values()).filter(
      (record) => record.entry.status === "queued",
    );

    for (const record of queued.slice(0, slots)) {
      void runUploadRef.current(record.entry.id);
    }
  }, [concurrency]);

  pumpQueueRef.current = pumpQueue;

  const enqueue = useCallback(
    (files: File[]) => {
      if (disposedRef.current || files.length === 0) return;

      let currentCount = recordsRef.current.size;

      for (const file of files) {
        const validationResult = validateUploadFile(file, validation, currentCount);
        const id = createUploadEntryId();
        const attemptId = createUploadAttemptId();

        let previewUrl: string | undefined;
        if (createPreviewUrls && shouldCreatePreviewUrl(file)) {
          previewUrl = URL.createObjectURL(file);
          previewUrlsRef.current.add(previewUrl);
        }

        if (!validationResult.valid) {
          recordsRef.current.set(id, {
            file,
            abortController: null,
            entry: {
              id,
              attemptId,
              name: file.name,
              size: file.size,
              status: "error",
              errorMessage: validationResult.message,
              previewUrl,
            },
          });
          currentCount += 1;
          continue;
        }

        recordsRef.current.set(id, {
          file,
          abortController: null,
          entry: {
            id,
            attemptId,
            name: file.name,
            size: file.size,
            status: "queued",
            previewUrl,
          },
        });
        currentCount += 1;
      }

      syncItems();
      pumpQueue();
    },
    [createPreviewUrls, pumpQueue, syncItems, validation],
  );

  const cancel = useCallback(
    (id: string) => {
      const record = recordsRef.current.get(id);
      if (!record) return;

      if (record.entry.status === "queued") {
        updateEntry(id, { status: "canceled", progress: undefined, errorMessage: undefined });
        return;
      }

      if (record.entry.status === "uploading" && record.abortController) {
        record.abortController.abort();
      }
    },
    [updateEntry],
  );

  const retry = useCallback(
    (id: string) => {
      const record = recordsRef.current.get(id);
      if (!record) return;
      if (record.entry.status !== "error" && record.entry.status !== "canceled") return;

      if (record.abortController) {
        record.abortController.abort();
        record.abortController = null;
      }

      record.entry.attemptId = createUploadAttemptId();
      updateEntry(id, {
        attemptId: record.entry.attemptId,
        status: "queued",
        progress: undefined,
        errorMessage: undefined,
      });
      pumpQueue();
    },
    [pumpQueue, updateEntry],
  );

  const remove = useCallback(
    (id: string) => {
      const record = recordsRef.current.get(id);
      if (!record) return;

      if (record.entry.status === "uploading" && record.abortController) {
        record.abortController.abort();
      }

      removeRecord(id);
      pumpQueue();
    },
    [pumpQueue, removeRecord],
  );

  const clearCompleted = useCallback(() => {
    for (const [id, record] of recordsRef.current.entries()) {
      if (record.entry.status === "success") {
        removeRecord(id);
      }
    }
  }, [removeRecord]);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
      for (const record of recordsRef.current.values()) {
        record.abortController?.abort();
      }
      for (const url of previewUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
      previewUrlsRef.current.clear();
      recordsRef.current.clear();
    };
  }, []);

  return {
    items,
    enqueue,
    cancel,
    retry,
    remove,
    clearCompleted,
  };
};
