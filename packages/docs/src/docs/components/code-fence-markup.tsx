import { type CodeLanguage, CodeSnippetLabel, findCodeImports } from "@kamod-ch/ui/code";
import render from "preact-render-to-string";
import { CodeLanguageLink } from "./CodeLanguageLink";
import { PathDisplay } from "./PathDisplay";

/** Static Markdown fences share snippet metadata without mounting inactive copy/wrap controls. */
export function codeFenceMarkup(
  source: string,
  language: CodeLanguage,
  filePath?: string,
  highlightedHtml?: string,
) {
  const imports = findCodeImports(source, language);
  return render(
    <div class="kamod-code docs-code-wrap docs-code-file" data-syntax-theme="default">
      <div class="docs-code-toolbar">
        {filePath ? (
          <PathDisplay class="docs-code-file-path" path={filePath} file />
        ) : (
          <CodeSnippetLabel
            code={source}
            language={language}
            importsOnly={Boolean(imports && !imports.folded.trim())}
            renderLanguage={CodeLanguageLink}
          />
        )}
      </div>
      <pre class="docs-code" data-language={language} tabIndex={0}>
        {highlightedHtml === undefined ? (
          <code class={`language-${language}`}>{source}</code>
        ) : (
          <code
            class={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        )}
      </pre>
    </div>,
  );
}
