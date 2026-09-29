import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  createSimulatedUploadAdapter,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
  FileUploadManager,
  useUploadQueue,
  validationRulesToAcceptAttr,
} from "@kamod-ch/ui";

const VALIDATION = {
  maxFiles: 8,
  maxFileSize: 5 * 1024 * 1024,
  acceptedTypes: ["image/*", ".pdf", ".txt"],
};

const simulatedAdapter = createSimulatedUploadAdapter({
  failPattern: "fail",
  minDurationMs: 900,
  determinateProgress: true,
});

/** Demo-only simulated transport — inject a real adapter in production. */
export const FileUploadManagerDemo = () => {
  const queue = useUploadQueue({
    adapter: simulatedAdapter,
    concurrency: 2,
    validation: VALIDATION,
    createPreviewUrls: true,
  });

  return (
    <div class="space-y-4">
      <Alert>
        <AlertDescription>
          <Badge variant="outline" size="xs" class="me-2">
            Demo simulation
          </Badge>
          Uses `createSimulatedUploadAdapter` only — no API endpoint or backend dependency.
          Server-side validation remains the integrator&apos;s responsibility.
        </AlertDescription>
      </Alert>

      <FileUploadManager class="max-w-2xl">
        <FileUploadDropzone
          accept={validationRulesToAcceptAttr(VALIDATION)}
          inputLabel="Choose files to upload"
          hint="Drop files here or use the keyboard-accessible file picker. Files named with “fail” error once, then succeed on retry."
          onFilesSelected={queue.enqueue}
        />
        <div class="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={queue.clearCompleted}>
            Clear completed
          </Button>
        </div>
        <FileUploadList
          empty={
            <Empty class="min-h-32 border border-dashed">
              <EmptyHeader>
                <EmptyTitle>No files yet</EmptyTitle>
                <EmptyDescription>Add files to start the simulated upload queue.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        >
          {queue.items.map((entry) => (
            <FileUploadItem
              key={entry.id}
              entry={entry}
              onCancel={queue.cancel}
              onRetry={queue.retry}
              onRemove={queue.remove}
            />
          ))}
        </FileUploadList>
      </FileUploadManager>
    </div>
  );
};
