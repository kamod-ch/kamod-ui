import { FileDownloadButton } from "../file-download/FileDownloadButton";

/** Markdown keeps its established names and selectors while sharing the generic file action. */
export function MarkdownDownloadButton({
  markdown,
  fileName,
}: {
  markdown: string;
  fileName: string;
}) {
  return (
    <FileDownloadButton
      source={markdown}
      fileName={fileName}
      mimeType="text/markdown;charset=utf-8"
      subject="Markdown"
      slot="markdown-download"
    />
  );
}
