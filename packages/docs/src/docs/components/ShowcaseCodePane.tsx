import { TextWrapIcon } from "@kamod-ch/icons/lucide";
import { TextWrapDisabledIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { CodeBlock } from "./CodeBlock";
import { CodeFilePath } from "./CodeFilePath";

/** Shared source surface for block files and standalone component/form examples. */
export function ShowcaseCodePane({
  filename,
  filePath,
  code,
  footer,
  children,
}: {
  filename: string;
  filePath: string;
  code?: string;
  footer: ComponentChildren;
  /** Loading/error content supplied by asynchronous source browsers. */
  children?: ComponentChildren;
}) {
  const [wrapped, setWrapped] = useState(false);
  const extension = filename.split(".").at(-1)?.toLowerCase();
  const language = extension === "md" ? "markdown" : extension === "svg" ? "text" : "tsx";
  const lineCount = code === undefined ? 0 : code.trimEnd().split("\n").length;
  const WrapIcon = wrapped ? TextWrapIcon : TextWrapDisabledIcon;
  const renderToolbar = (copyButton?: ComponentChildren) => (
    <div class="docs-code-toolbar blocks-source-file-heading">
      <div class="blocks-source-file-details">
        <CodeFilePath path={filePath} />
        {code !== undefined && (
          <span class="blocks-source-lines">
            <span aria-hidden="true">·</span>
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        )}
      </div>
      {copyButton && (
        <div
          class="blocks-showcase-segmented blocks-source-controls"
          role="group"
          aria-label="Source controls"
        >
          <button
            type="button"
            class="docs-icon-button blocks-source-wrap"
            aria-pressed={wrapped}
            aria-label="Wrap code lines"
            title={`Line wrapping ${wrapped ? "on" : "off"}`}
            onClick={() => setWrapped((value) => !value)}
          >
            <WrapIcon size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>Wrap {wrapped ? "on" : "off"}</span>
          </button>
          {copyButton}
        </div>
      )}
    </div>
  );
  return (
    <div class={`blocks-code-pane ${wrapped ? "is-wrapped" : ""}`}>
      {code !== undefined ? (
        <CodeBlock
          key={filename}
          code={code}
          language={language}
          renderToolbar={renderToolbar}
          className="docs-tab-code"
        />
      ) : (
        <>
          {renderToolbar()}
          {children}
        </>
      )}
      <div class="blocks-source-footer">
        <span>{footer}</span>
        <span>Copy preserves source formatting.</span>
      </div>
    </div>
  );
}
