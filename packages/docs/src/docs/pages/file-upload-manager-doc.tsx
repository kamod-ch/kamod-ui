import { createGenericDocPage } from "./create-generic-doc-page";
import { FileUploadManagerDemo } from "./file-upload-manager-demo";

const BASIC_SNIPPET = `import {
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
  FileUploadManager,
  useUploadQueue,
  validationRulesToAcceptAttr,
} from "@/components/kamod-ui/file-upload-manager";

export const Example = ({ adapter }) => {
  const validation = { maxFiles: 5, maxFileSize: 5 * 1024 * 1024, acceptedTypes: ["image/*"] };
  const queue = useUploadQueue({ adapter, concurrency: 2, validation });

  return (
    <FileUploadManager>
      <FileUploadDropzone
        accept={validationRulesToAcceptAttr(validation)}
        onFilesSelected={queue.enqueue}
      />
      <FileUploadList empty={<Empty>No files yet</Empty>}>
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
  );
};`;

export const fileUploadManagerDocPage = createGenericDocPage({
  title: "File Upload Manager",
  slug: "file-upload-manager",
  usageLabel: "File Upload Manager",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/file-upload-manager`. Presentation components compose with `useUploadQueue` and an injected `UploadAdapter` — no built-in fetch/XHR endpoint.",
  usageText:
    "Stable entry ids, attempt ids for retries, configurable concurrency, cancel/retry/remove, and per-file validation. `accept` is a selection hint only. Adapters receive `File`, `AbortSignal`, and an optional progress callback — report real progress values or `null` for indeterminate mode. Object URLs for previews are optional and revoked on remove/unmount.",
  installationExample: {
    code: `import { FileUploadManagerDemo } from "./file-upload-manager-demo";

export const Example = () => <FileUploadManagerDemo />;`,
    renderPreview: () => <FileUploadManagerDemo />,
  },
  exampleSections: [
    {
      id: "simulated-demo",
      title: "Simulated adapter demo",
      text: "Local queue with success, failure, retry, cancel, parallel uploads, and validation errors. Clearly labeled as simulation.",
      code: `import { FileUploadManagerDemo } from "./file-upload-manager-demo";

export const Example = () => <FileUploadManagerDemo />;`,
      renderPreview: () => <FileUploadManagerDemo />,
    },
  ],
  apiRows: [
    { prop: "useUploadQueue", type: "hook", defaultValue: "—" },
    { prop: "adapter", type: "UploadAdapter", defaultValue: "required" },
    { prop: "concurrency", type: "number", defaultValue: "2" },
    {
      prop: "UploadFileEntry.status",
      type: "queued | uploading | success | error | canceled",
      defaultValue: "—",
    },
    { prop: "UploadAdapter", type: "(ctx) => Promise<UploadAdapterResult>", defaultValue: "—" },
    { prop: "createSimulatedUploadAdapter", type: "demo helper", defaultValue: "—" },
  ],
  accessibilityText:
    "FileUploadDropzone wraps Dropzone with an accessible file input label for keyboard selection. Progress bars expose aria-label and aria-valuetext; status changes use a single polite live region per item — not on every progress tick.",
});
