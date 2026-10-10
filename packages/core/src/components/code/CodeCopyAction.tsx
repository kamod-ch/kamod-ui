import { CopyButton } from "../copy-button";
import type { CodeProps } from "./code-types";

/** Adapt Code's public composition slot to the shared clipboard action. */
export function CodeCopyAction({
  code,
  codeId,
  onCopy,
  onCopyError,
  renderCopyAction,
}: Pick<CodeProps, "code" | "onCopy" | "onCopyError" | "renderCopyAction"> & { codeId: string }) {
  return (
    <CopyButton
      value={code}
      subject="code"
      aria-label="Copy code"
      class="docs-code-action docs-copy-code-button"
      data-slot="code-copy"
      statusId={`${codeId}-copy-status`}
      onCopy={onCopy}
      onCopyError={onCopyError}
      renderControl={renderCopyAction && ((context) => renderCopyAction({ ...context, codeId }))}
    />
  );
}
