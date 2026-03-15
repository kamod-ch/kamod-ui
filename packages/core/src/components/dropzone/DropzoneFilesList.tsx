import type { JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropzoneFilesListProps = JSX.HTMLAttributes<HTMLUListElement> & {
  files: File[];
};

export const DropzoneFilesList = ({ files, class: className, ...rest }: DropzoneFilesListProps) => (
  <ul data-slot="dropzone-files-list" class={cn("text-muted-foreground mt-2 grid gap-1 text-sm", className)} {...rest}>
    {files.map((file) => (
      <li key={file.name}>{file.name}</li>
    ))}
  </ul>
);

