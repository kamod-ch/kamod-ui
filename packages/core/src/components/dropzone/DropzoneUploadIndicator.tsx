import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DropzoneUploadIndicatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropzoneUploadIndicator = ({
  class: className,
  children = "Drop files here or click to upload",
  ...rest
}: DropzoneUploadIndicatorProps) => (
  <div data-slot="dropzone-upload-indicator" class={cn("text-muted-foreground text-sm", className)} {...rest}>
    {children}
  </div>
);

