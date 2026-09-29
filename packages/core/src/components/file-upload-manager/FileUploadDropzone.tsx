import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Dropzone, type DropzoneProps } from "../dropzone/Dropzone";
import { DropzoneUploadIndicator } from "../dropzone/DropzoneUploadIndicator";

export type FileUploadDropzoneProps = Omit<DropzoneProps, "onFilesChange"> & {
  onFilesSelected?: (files: File[]) => void;
  /** Accessible label for the file input — enables keyboard file selection. */
  inputLabel?: string;
  hint?: ComponentChildren;
  class?: string;
};

export const FileUploadDropzone = ({
  onFilesSelected,
  inputLabel = "Choose files to upload",
  hint,
  class: className,
  children,
  accept,
  multiple = true,
  ...rest
}: FileUploadDropzoneProps) => (
  <Dropzone
    accept={accept}
    multiple={multiple}
    onFilesChange={onFilesSelected}
    class={cn("w-full", className)}
    aria-label={inputLabel}
    {...rest}
  >
    {children ?? (
      <div class="pointer-events-none flex flex-col items-center gap-2 text-center text-sm">
        <DropzoneUploadIndicator />
        {hint ? <p class="text-muted-foreground">{hint}</p> : null}
      </div>
    )}
  </Dropzone>
);
