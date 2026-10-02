import { FileCodeIcon, TextWrapIcon } from "@kamod-ch/icons/lucide";
import { BrandTypescriptIcon, TextWrapDisabledIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { CodeBlock } from "./CodeBlock";

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
  return (
    <div class={`blocks-code-pane ${wrapped ? "is-wrapped" : ""}`}>
      <div class="blocks-source-file-heading">
        <FileCodeIcon size={17} strokeWidth={1.75} aria-hidden="true" />
        <code title={filename}>{filename}</code>
        <span class="blocks-source-extension">
          {(extension === "tsx" || extension === "ts") && (
            <BrandTypescriptIcon size={13} aria-hidden="true" />
          )}
          {extension}
        </span>
        {code !== undefined && (
          <span class="blocks-source-lines">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        )}
      </div>
      {code !== undefined ? (
        <CodeBlock
          key={filename}
          code={code}
          language={language}
          filePath={filePath}
          toolbarContent={
            <>
              <button
                type="button"
                class="blocks-source-wrap"
                aria-pressed={wrapped}
                aria-label="Wrap code lines"
                title={`Line wrapping ${wrapped ? "on" : "off"}`}
                onClick={() => setWrapped((value) => !value)}
              >
                <WrapIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                <span class="blocks-source-wrap-label">Wrap {wrapped ? "on" : "off"}</span>
              </button>
            </>
          }
          className="docs-tab-code"
        />
      ) : (
        children
      )}
      <div class="blocks-source-footer">
        <span>{footer}</span>
        <span>Copy preserves source formatting.</span>
      </div>
    </div>
  );
}
