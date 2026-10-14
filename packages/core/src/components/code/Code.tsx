import { useContext, useId, useLayoutEffect, useMemo, useState } from "preact/hooks";
import { CodeCopyAction } from "./CodeCopyAction";
import { CodeFileHeader } from "./CodeFileHeader";
import { CodeReferenceContext } from "./CodeReferenceProvider";
import { CodeSnippetLabel } from "./CodeSnippetLabel";
import { CodeImportControl, CodeWrapControl } from "./code-controls";
import { findCodeImports } from "./code-imports";
import { isCommandCode, normalizeCodeLanguage, resolveCodeLanguage } from "./code-language";
import { selectCodeMarkup } from "./code-markup";
import { linkCodeMarkup } from "./code-reference-markup";
import { findCodeReferences } from "./code-references";
import type { CodeProps } from "./code-types";
import { readableCodeLines } from "./code-wrap";
import { useCodeHighlight } from "./use-code-highlight";
import { useCodeOverflow } from "./use-code-overflow";

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
  resolveReference: resolveReferenceProp,
  filePath,
  renderFilePath,
  renderLanguage,
  toolbarContent,
  renderToolbar,
  showToolbar = true,
  renderedContent,
  loadingContent,
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
  const wrapEligible = useMemo(
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
  const inheritedResolver = useContext(CodeReferenceContext);
  const resolveReference =
    resolveReferenceProp === undefined ? inheritedResolver : resolveReferenceProp;
  const references = useMemo(
    () =>
      rendersCode && resolveReference
        ? findCodeReferences(code, language, resolveReference, filePath)
        : [],
    [code, language, resolveReference, filePath, rendersCode],
  );
  const codeId = useId();
  const { element, html, pending } = useCodeHighlight(code, language, rendersCode, highlight);
  const linkedHtml = useMemo(() => linkCodeMarkup(html, references), [html, references]);
  const showLoading = Boolean(loadingContent) && pending;
  const sourceMarkup = useMemo(() => {
    // Folding selects existing tokens; clicks never load grammars or recolor the source.
    const foldedHtml = canFoldImports ? selectCodeMarkup(linkedHtml, imports!.parts) : linkedHtml;
    return rendersCode && wrapped
      ? {
          full: readableCodeLines(linkedHtml, code),
          folded: canFoldImports ? readableCodeLines(foldedHtml, imports!.folded) : linkedHtml,
        }
      : { full: linkedHtml, folded: foldedHtml };
  }, [rendersCode, wrapped, linkedHtml, code, imports, canFoldImports]);
  const displayedHtml = importsHidden ? sourceMarkup.folded : sourceMarkup.full;
  const showReadingControls = useCodeOverflow(
    element,
    wrapEligible || canFoldImports,
    html,
    wrapped,
    importsHidden,
    syntaxTheme,
  );
  const canWrap = wrapEligible && showReadingControls;
  const showImports = canFoldImports && showReadingControls;
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
  const defaultImportControl = showImports ? (
    <CodeImportControl
      hidden={importsHidden}
      count={imports!.count}
      codeId={codeId}
      onToggle={() => setImportsHidden(!importsHidden)}
    />
  ) : null;
  const importToggle = showImports
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
  const source = rendersCode && (
    <pre
      id={codeId}
      class={`docs-code ${preClassName ?? className ?? ""}`.trim()}
      data-slot="code-content"
      data-language={language}
      tabIndex={showLoading ? -1 : 0}
      aria-hidden={showLoading || undefined}
      style={showLoading ? { visibility: "hidden" } : undefined}
    >
      <code
        ref={element}
        class={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: displayedHtml }}
      />
    </pre>
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
            {filePath && (
              <CodeFileHeader path={filePath} code={code}>
                {renderFilePath ? renderFilePath(filePath) : undefined}
              </CodeFileHeader>
            )}
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
        loadingContent ? (
          <div class="kamod-code-content" data-loading={showLoading || undefined}>
            {source}
            {showLoading && <div class="kamod-code-loading">{loadingContent}</div>}
          </div>
        ) : (
          source
        )
      ) : (
        renderedContent
      )}
      {afterCode}
    </div>
  );
}
