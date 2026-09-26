import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { fileUploadManager } from "./file-upload-manager-variants";

export type FileUploadManagerProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Layout shell for dropzone + file list composition. Queue logic stays in `useUploadQueue`. */
export const FileUploadManager = ({
  class: className,
  children,
  ...rest
}: FileUploadManagerProps) => (
  <div data-slot="file-upload-manager" class={cn(fileUploadManager(), className)} {...rest}>
    {children}
  </div>
);
