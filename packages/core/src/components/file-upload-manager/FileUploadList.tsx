import type { ComponentChildren, JSX } from "preact";
import { toChildArray } from "preact";
import { cn } from "../../lib/utils";
import { fileUploadList } from "./file-upload-manager-variants";

export type FileUploadListProps = JSX.HTMLAttributes<HTMLUListElement> & {
  children?: ComponentChildren;
  empty?: ComponentChildren;
};

export const FileUploadList = ({
  children,
  empty,
  class: className,
  ...rest
}: FileUploadListProps) => {
  const items = toChildArray(children);
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div data-slot="file-upload-list-empty" class={cn(className)}>
        {empty}
      </div>
    );
  }

  return (
    <ul data-slot="file-upload-list" class={cn(fileUploadList(), className)} {...rest}>
      {items}
    </ul>
  );
};
