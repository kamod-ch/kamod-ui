import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

export type DropzoneLoadingIndicatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropzoneLoadingIndicator = ({
  class: className,
  children = "Uploading...",
  ...rest
}: DropzoneLoadingIndicatorProps) => (
  <div data-slot="dropzone-loading-indicator" class={cn("inline-flex items-center gap-2 text-sm", className)} {...rest}>
    <Spinner size="sm" />
    <span>{children}</span>
  </div>
);

