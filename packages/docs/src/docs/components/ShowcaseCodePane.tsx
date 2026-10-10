import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { CodeBlock } from "./CodeBlock";
import { PathDisplay } from "./PathDisplay";

/** Shared source surface for block files and standalone component/form examples. */
export function ShowcaseCodePane({
  filename,
  filePath,
  code,
  footer,
  children,
  loading = false,
}: {
  filename: string;
  filePath: string;
  code?: string;
  /** Omit when the surrounding file browser provides a shared footer row. */
  footer?: ComponentChildren;
  /** Loading/error content supplied by asynchronous source browsers. */
  children?: ComponentChildren;
  loading?: boolean;
}) {
  const pane = useRef<HTMLDivElement>(null);
  const lastHeight = useRef<number | undefined>(undefined);
  // Retain the previous file's footprint while fetching, without observing every scroll/resize.
  useLayoutEffect(() => {
    if (code !== undefined && pane.current)
      lastHeight.current = pane.current.getBoundingClientRect().height;
  }, [code, filename]);
  const lineCount = code === undefined ? 0 : code.trimEnd().split("\n").length;
  const renderToolbar = (copyButton?: ComponentChildren) => (
    <div class="docs-code-toolbar blocks-source-file-heading">
      <div class="blocks-source-file-details">
        <PathDisplay class="docs-code-file-path" path={filePath} file fileTypeTooltip />
        {code !== undefined && (
          <span class="blocks-source-lines">
            <span aria-hidden="true">·</span>
            <span class="blocks-source-line-count">
              <span class="blocks-source-line-total">
                <strong class="blocks-source-count">{lineCount}</strong>{" "}
                {lineCount === 1 ? "line" : "lines"}
              </span>
            </span>
          </span>
        )}
      </div>
      {copyButton && (
        <div class="blocks-source-controls" role="group" aria-label="Source controls">
          {copyButton}
        </div>
      )}
    </div>
  );
  return (
    <div
      ref={pane}
      class="blocks-code-pane"
      data-loading={loading || undefined}
      aria-busy={loading}
      style={loading && lastHeight.current ? { height: lastHeight.current } : undefined}
    >
      {code !== undefined ? (
        <CodeBlock
          key={filename}
          code={code}
          filePath={filePath}
          renderToolbar={renderToolbar}
          className="docs-tab-code"
        />
      ) : (
        <>
          {renderToolbar()}
          {children}
        </>
      )}
      {footer && <ShowcaseCodeFooter>{footer}</ShowcaseCodeFooter>}
    </div>
  );
}

/** Shared footer copy for standalone examples and the block browser's aligned footer row. */
export function ShowcaseCodeFooter({ children }: { children: ComponentChildren }) {
  return (
    <div class="blocks-source-footer">
      <span>{children}</span>
      <span class="blocks-source-copy-note">Copy preserves source formatting.</span>
    </div>
  );
}
