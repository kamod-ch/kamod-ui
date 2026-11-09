import {
  Code,
  type CodeCopyActionContext,
  type CodeProps,
  CodeReferenceProvider,
} from "@kamod-ch/ui/code";
import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { trackGrowthEvent } from "../analytics/growth-track";
import type { GrowthEventMeta } from "../analytics/growth-types";
import { docsCodeHighlighter } from "../docs/components/code-highlighter";
import { FileDownloadButton } from "../docs/components/file-download/FileDownloadButton";
import { MarkdownDownloadButton } from "../docs/components/markdown-download/MarkdownDownloadButton";
import { notifyCodeCopySuccess } from "../layout/star-invitation/notify";
import { codeDownloadFile } from "./code-download-file";
import { resolveCodeReference } from "./destinations";

export type ReferenceCodeProps = CodeProps & {
  /** Download name independent of the reading format, for example a plain-text Markdown prompt. */
  downloadFileName?: string;
  /** Optional funnel metadata for successful copy events (no code content). */
  growthMeta?: GrowthEventMeta;
};

/** Share source links and exact-source downloads without changing the core reader's public API. */
export function ReferenceCode({
  downloadFileName,
  growthMeta,
  renderCopyAction,
  onCopy,
  onCopyError,
  ...props
}: ReferenceCodeProps) {
  const file = useMemo(
    () => codeDownloadFile(props, downloadFileName),
    [props.code, props.language, props.filePath, props.inferLanguage, downloadFileName],
  );
  const copyAction = (context: CodeCopyActionContext) => {
    const control = renderCopyAction ? renderCopyAction(context) : context.defaultControl;
    // A caller that removes Copy also removes the companion download action.
    if (control == null || typeof control === "boolean") return control;
    return (
      <div class="docs-code-actions docs-code-file-actions">
        {file.mimeType.startsWith("text/markdown") ? (
          <MarkdownDownloadButton markdown={props.code} fileName={file.fileName} />
        ) : (
          <FileDownloadButton source={props.code} {...file} />
        )}
        {control}
      </div>
    );
  };
  return (
    <Code
      {...props}
      highlighter={props.highlighter ?? docsCodeHighlighter}
      renderCopyAction={copyAction}
      onCopy={(code) => {
        onCopy?.(code);
        notifyCodeCopySuccess();
        trackGrowthEvent("code_copy_success", {
          ...growthMeta,
          exampleId: growthMeta?.exampleId ?? props.filePath,
        });
      }}
      onCopyError={onCopyError}
      readingControls={props.readingControls ?? "imports"}
      resolveReference={
        props.resolveReference === undefined ? resolveCodeReference : props.resolveReference
      }
    />
  );
}

/** Share the same resolver with direct core usages and isolated documentation previews. */
export function ReferenceCodeProvider({ children }: { children: ComponentChildren }) {
  return <CodeReferenceProvider resolve={resolveCodeReference}>{children}</CodeReferenceProvider>;
}
