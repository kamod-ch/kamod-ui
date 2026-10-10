import { useId, useLayoutEffect, useMemo, useState } from "preact/hooks";
import { CodeCopyAction } from "./CodeCopyAction";
import { CodeFileHeader } from "./CodeFileHeader";
import { CodeSnippetLabel } from "./CodeSnippetLabel";
import { CodeImportControl, CodeWrapControl } from "./code-controls";
import { findCodeImports } from "./code-imports";
import { isCommandCode, normalizeCodeLanguage, resolveCodeLanguage } from "./code-language";
import type { CodeProps } from "./code-types";
import { readableCodeLines } from "./code-wrap";
import { useCodeHighlight } from "./use-code-highlight";

/**
 * Read-only, SSR-safe code with optional deferred highlighting and source-preserving controls.
 * Import folding and wrapping are presentation preferences; copying always uses the input string.
 */
export function Code({
  code,
  language: languageHint,
  inferLanguage = true,
  highlight = true,
  syntaxTheme = "default",
  filePath,
  renderFilePath,
  renderLanguage,
  toolbarContent,
  renderToolbar,
  showToolbar = true,
  renderedContent,
  beforeCode,
  afterCode,
  defaultWrapped = false,
  wrapped: wrappedProp,
  onWrappedChange,
  showWrapControl = true,
  renderWrapControl,
  showImportControl = true,
  renderImportControl,
  defaultImportsCollapsed = false,
  importsCollapsed,
  onImportsCollapsedChange,
  showCopy = true,
  renderCopyAction,
  variant = "default",
  class: rootClass,
  className,
  preClassName,
  onCopy,
  onCopyError,
  ...rest
}: CodeProps) {
  const language = useMemo(
    () =>
      inferLanguage
        ? resolveCodeLanguage(code, languageHint, filePath)
        : normalizeCodeLanguage(languageHint),
    [code, languageHint, filePath, inferLanguage],
  );
  const [internalWrapped, setInternalWrapped] = useState(defaultWrapped);
  const wrapped = wrappedProp ?? internalWrapped;
  const setWrapped = (next: boolean) => {
    if (next === wrapped) return;
    if (wrappedProp === undefined) setInternalWrapped(next);
    onWrappedChange?.(next);
  };
  const rendersCode = renderedContent === undefined;
  const canWrap = useMemo(
    () =>
      rendersCode &&
      showWrapControl &&
      language !== "bash" &&
      !isCommandCode(code, languageHint, filePath) &&
      (Boolean(filePath?.trim()) || (language !== "text" && language !== "markdown")),
    [rendersCode, showWrapControl, language, code, languageHint, filePath],
  );
  const imports = useMemo(
    () => (rendersCode ? findCodeImports(code, language) : null),
    [code, language, rendersCode],
  );
  const importsOnly = imports !== null && !imports.folded.trim();
  const canFoldImports = showImportControl && imports !== null && !importsOnly;
  const [folded, setFolded] = useState({ code, hidden: defaultImportsCollapsed });
  const importsHidden =
    canFoldImports &&
    (importsCollapsed ?? (folded.code === code ? folded.hidden : defaultImportsCollapsed));
  const setImportsHidden = (next: boolean) => {
    if (next === importsHidden) return;
    if (importsCollapsed === undefined) setFolded({ code, hidden: next });
    onImportsCollapsedChange?.(next);
  };
  useLayoutEffect(() => {
    setFolded((current) =>
      current.code === code ? current : { code, hidden: defaultImportsCollapsed },
    );
  }, [code]);
  const displayedCode = importsHidden ? imports!.folded : code;
  const codeId = useId();
  const { element, html } = useCodeHighlight(displayedCode, language, rendersCode, highlight);
  const displayedHtml = useMemo(
    () => (rendersCode && wrapped ? readableCodeLines(html, displayedCode) : html),
    [rendersCode, wrapped, html, displayedCode],
  );
  const defaultWrapControl = (
    <CodeWrapControl wrapped={wrapped} codeId={codeId} onChange={setWrapped} />
  );
  const wrapToggle = canWrap
    ? renderWrapControl
      ? renderWrapControl({
          codeId,
          wrapped,
          onWrappedChange: setWrapped,
          defaultControl: defaultWrapControl,
        })
      : defaultWrapControl
    : null;
  const defaultImportControl = canFoldImports ? (
    <CodeImportControl
      hidden={importsHidden}
      count={imports!.count}
      codeId={codeId}
      onToggle={() => setImportsHidden(!importsHidden)}
    />
  ) : null;
  const importToggle = canFoldImports
    ? renderImportControl
      ? renderImportControl({
          codeId,
          collapsed: importsHidden,
          count: imports!.count,
          onCollapsedChange: setImportsHidden,
          defaultControl: defaultImportControl,
        })
      : defaultImportControl
    : null;
  const wrapInReadingRow = canFoldImports || !showToolbar;
  const readingWrapToggle = wrapInReadingRow ? wrapToggle : null;
  const copyButton = showToolbar && showCopy && (
    <CodeCopyAction
      code={code}
      codeId={codeId}
      onCopy={onCopy}
      onCopyError={onCopyError}
      renderCopyAction={renderCopyAction}
    />
  );
  const toolbarActions =
    wrapInReadingRow || !wrapToggle ? (
      copyButton
    ) : (
      <div class="docs-code-actions">
        {wrapToggle}
        {copyButton}
      </div>
    );
  return (
    <div
      {...rest}
      class={`kamod-code docs-code-wrap${wrapped ? " is-wrapped" : ""}${(filePath || !toolbarContent) && !renderToolbar ? " docs-code-file" : ""}${rootClass ? ` ${rootClass}` : ""}`}
      data-slot="code"
      data-variant={variant}
      data-syntax-theme={syntaxTheme}
    >
      {showToolbar &&
        (renderToolbar ? (
          renderToolbar(toolbarActions)
        ) : (
          <div class="docs-code-toolbar" data-slot="code-toolbar">
            {filePath &&
              (renderFilePath ? renderFilePath(filePath) : <CodeFileHeader path={filePath} />)}
            {!filePath && !toolbarContent && (
              <CodeSnippetLabel
                code={code}
                language={language}
                importsOnly={importsOnly}
                renderLanguage={renderLanguage}
              />
            )}
            {toolbarContent}
            {toolbarActions}
          </div>
        ))}
      {(importToggle || readingWrapToggle) && (
        <div
          class="docs-code-imports-row"
          data-slot="code-imports"
          data-wrap-only={!importToggle || undefined}
        >
          {importToggle}
          {readingWrapToggle}
        </div>
      )}
      {beforeCode}
      {rendersCode ? (
        <pre
          id={codeId}
          class={`docs-code ${preClassName ?? className ?? ""}`.trim()}
          data-slot="code-content"
          data-language={language}
          tabIndex={0}
        >
          <code
            ref={element}
            class={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: displayedHtml }}
          />
        </pre>
      ) : (
        renderedContent
      )}
      {afterCode}
    </div>
  );
}
