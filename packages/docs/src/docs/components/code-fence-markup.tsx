import {
  CodeFileHeader,
  type CodeLanguage,
  CodeSnippetLabel,
  escapeCodeHtml,
  findCodeImports,
  findCodeReferences,
  linkCodeMarkup,
} from "@kamod-ch/ui/code";
import render from "preact-render-to-string";
import { resolveCodeReference } from "../../references/destinations";
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
  const html = linkCodeMarkup(
    highlightedHtml ?? escapeCodeHtml(source),
    findCodeReferences(source, language, resolveCodeReference, filePath),
  );
  return render(
    <div class="kamod-code docs-code-wrap docs-code-file" data-syntax-theme="default">
      <div class="docs-code-toolbar">
        {filePath ? (
          <CodeFileHeader path={filePath} code={source}>
            <PathDisplay class="docs-code-file-path" path={filePath} file />
          </CodeFileHeader>
        ) : (
          <CodeSnippetLabel
            code={source}
            language={language}
            importsOnly={Boolean(imports && !imports.folded.trim())}
            renderLanguage={CodeLanguageLink}
          />
        )}
      </div>
      <pre class="docs-code kamod-code-source" data-language={language} tabIndex={0}>
        <code class={`language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>,
  );
}
