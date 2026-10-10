import { Dropzone, DropzoneLoadingIndicator, DropzoneUploadIndicator } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const dropzoneDocPage = createGenericDocPage({
  slug: "dropzone",
  title: "Dropzone",
  usageLabel: "Dropzone enables drag-and-drop file upload interactions.",
  installationText:
    "Import Dropzone and optional indicators from `@/components/kamod-ui/dropzone`.",
  usageText: "Handle onFilesChange to process selected or dropped files.",
  exampleSections: [
    {
      id: "basic-dropzone",
      title: "Basic Dropzone",
      text: "**Keep File Selection Available without Dragging.** Use `Dropzone` to offer both drag-and-drop and a click-to-select file picker. The selected files are inputs to your application; accepting a file into the control is separate from validating or uploading it.\n\nExplain accepted types and size limits, validate files in your application, and distinguish selecting a local file from actually uploading it to a server.",
      code: `import { Dropzone } from "@/components/kamod-ui/dropzone";

export const Example = () => (
  <Dropzone class="w-full max-w-xl">
    <p class="text-sm">Drop files here or click to upload.</p>
  </Dropzone>
);`,
      renderPreview: () => (
        <Dropzone class="w-full max-w-xl">
          <p class="text-sm">Drop files here or click to upload.</p>
        </Dropzone>
      ),
    },
    {
      id: "dropzone-indicators",
      title: "Dropzone Indicators",
      text: "**Communicate Each Stage of the Upload.** Place helper indicators near the dropzone to explain whether files are waiting, uploading or complete. Derive those messages from the actual operation, keeping selection feedback distinct from a confirmed upload result.\n\nKeep retry and removal actions clear, and clean up application-owned object URLs or requests when previews are replaced or the upload is cancelled.",
      code: `import { Dropzone, DropzoneLoadingIndicator, DropzoneUploadIndicator } from "@/components/kamod-ui/dropzone";

export const Example = () => (
  <Dropzone class="w-full max-w-xl">
    <div class="flex items-center gap-2 text-sm">
      <DropzoneUploadIndicator />
      <DropzoneLoadingIndicator />
      <span>Upload files</span>
    </div>
  </Dropzone>
);`,
      renderPreview: () => (
        <Dropzone class="w-full max-w-xl">
          <div class="flex items-center gap-2 text-sm">
            <DropzoneUploadIndicator />
            <DropzoneLoadingIndicator />
            <span>Upload files</span>
          </div>
        </Dropzone>
      ),
    },
  ],
  apiRows: [
    { prop: "accept", type: "string", defaultValue: "undefined" },
    { prop: "multiple", type: "boolean", defaultValue: "true" },
    { prop: "onFilesChange", type: "(files: File[]) => void", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Provide clear accepted file type guidance and ensure upload progress or error feedback is visible.",
});
