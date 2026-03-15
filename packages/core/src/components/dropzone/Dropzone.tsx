import { signal } from "@preact/signals";
import type { ComponentChildren, JSX, TargetedDragEvent } from "preact";
import { cn } from "../../lib/utils";

export type DropzoneProps = JSX.HTMLAttributes<HTMLDivElement> & {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  children?: ComponentChildren;
};

export const Dropzone = ({
  accept,
  multiple = true,
  onFilesChange,
  class: className,
  children,
  ...rest
}: DropzoneProps) => {
  const isDragging = signal(false);

  const readFiles = (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    onFilesChange?.(files);
  };

  const onDragOver = (event: TargetedDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDragging.value = true;
  };

  const onDragLeave = (event: TargetedDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDragging.value = false;
  };

  const onDrop = (event: TargetedDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDragging.value = false;
    readFiles(event.dataTransfer?.files ?? null);
  };

  return (
    <div
      data-slot="dropzone"
      data-dragging={isDragging.value ? "true" : "false"}
      class={cn(
        "border-input bg-background hover:bg-muted/50 relative rounded-lg border border-dashed p-5 transition-colors",
        isDragging.value && "border-primary bg-primary/5",
        className
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      {...rest}
    >
      <input
        data-slot="dropzone-input"
        type="file"
        accept={accept}
        multiple={multiple}
        class="absolute inset-0 cursor-pointer opacity-0"
        onChange={(event) => readFiles((event.currentTarget as HTMLInputElement).files)}
      />
      {children}
    </div>
  );
};

