import { Dropzone, DropzoneLoadingIndicator, DropzoneUploadIndicator } from "@kamod-ui/core";
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
      text: "Drop files or click to open the file picker.",
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
      text: "Use helper indicators to communicate upload state.",
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
