import { InfoIcon } from "@kamod-ch/icons/lucide";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsCallout } from "../../components/DocsCallout";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";
import { CodeLanguagePlayground } from "./code-playgrounds";

export const languageSelectorSnippet = `import { Code, codeLanguages, type CodeLanguage } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

const source = 'export const ready: boolean = true;';

export function LanguageSelector() {
  const [language, setLanguage] = useState<CodeLanguage>("typescript");

  return (
    <section>
      <label>
        Highlighting language
        <select
          value={language}
          onChange={(event) => setLanguage(event.currentTarget.value as CodeLanguage)}
        >
          {codeLanguages.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <Code code={source} language={language} inferLanguage={false} />
    </section>
  );
}`;

const languageRows = [
  ["typescript", "ts, mts, cts", ".ts, .mts, .cts"],
  ["javascript", "js, mjs, cjs", ".js, .mjs, .cjs"],
  ["tsx / jsx", "tsx / jsx", ".tsx / .jsx"],
  ["json", "json, jsonc", ".json, .jsonc"],
  ["yaml", "yaml, yml", ".yaml, .yml"],
  ["css", "css", ".css"],
  ["markup", "html, htm, xml, svg", ".html, .htm, .xml, .svg"],
  ["markdown", "md, markdown", ".md, .markdown"],
  [
    "bash",
    "sh, bash, zsh, shell, shellscript, console, terminal, shellsession",
    ".sh, .bash, .zsh",
  ],
  ["diff", "diff, patch", ".diff, .patch"],
  ["text", "text, txt, plain, plaintext, none, auto", "Unrecognized extensions"],
] as const;

export function CodeLanguageGuide() {
  return (
    <>
      <Topic id="code-language-order" title="Choose a language with the metadata you trust">
        <p>
          Pass <code>language</code> when you know what the source contains. A file browser can use
          its file type, a Markdown renderer can pass the fence label, and a settings screen can
          declare <code>json</code> directly. This selects <strong>syntax highlighting</strong>; it
          does not translate, validate or format the string.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code code={componentSource} language="tsx" />\n<Code code={responseSource} language="json" />\n<Code code="pnpm build" language="bash" />'
          }
        />
        <p>
          These independent expressions assume your app supplies <code>componentSource</code> and{" "}
          <code>responseSource</code> as strings. With inference enabled, a recognized explicit
          language takes precedence over the extension in <code>filePath</code>. If neither gives a
          useful hint, bounded syntax checks look for common source patterns. JavaScript and
          TypeScript hints can be promoted to JSX and TSX when recognizable JSX is present.
        </p>
        <p>
          For a <strong>strict override</strong>, set <code>{"inferLanguage={false}"}</code>. Code
          then uses only the normalized <code>language</code> value: file metadata, content guessing
          and JSX promotion are skipped. Your explicit selector can therefore choose TypeScript, JSX
          or plain text without another hint overriding that choice.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  filePath="src/example.tsx"\n  language="javascript"\n  inferLanguage={false}\n/>'
          }
        />
        <DocsCallout title="Highlighting leaves the source alone" icon={<InfoIcon />}>
          <p>
            Selecting JSON does not serialize an object. Selecting TypeScript does not add types.
            Indentation, newlines, import order and copied text still come from <code>code</code>.
            If your app needs formatted source, prepare it before passing the string to Code.
          </p>
        </DocsCallout>
      </Topic>
      <Topic id="code-language-switcher" title="Change the language at runtime">
        <p>
          Choose any grammar below to inspect the same TSX source. The selector treats named
          languages as strict choices. Its Automatic option restores inference from the filename and
          source. Try <code>text</code>, then <code>tsx</code>, and copy either view: both produce
          the same complete component.
        </p>
        <CodeLanguagePlayground />
        <p>
          Use the exported <code>codeLanguages</code> catalog to build a selector without
          maintaining a second list. Its values are the supported canonical grammar names, including{" "}
          <code>text</code>. The matching <code>CodeLanguage</code> type is useful for application
          state; the public <code>language</code> prop also accepts aliases and file hints as
          strings.
        </p>
        <CodeBlock code={languageSelectorSnippet} filePath="src/LanguageSelector.tsx" />
        <p>
          Keep the source string stable while changing the preference. Code updates highlighting
          when <code>language</code> changes and ignores results from an older highlighting request.
          A selector can change presentation immediately without fetching or rebuilding the source.
          Changing the grammar can also change which import or wrapping controls are eligible; those
          follow the <a href="#reading-behavior">reading rules</a>.
        </p>
      </Topic>
      <Topic id="code-language-list" title="Supported languages, aliases and file hints">
        <p>
          The built-in catalog covers these families. Canonical names and aliases are
          case-insensitive; labels such as <code>language-tsx</code> and path hints such as{" "}
          <code>src/Welcome.tsx</code> are normalized too. JSONC uses the JSON grammar and Zsh uses
          Bash highlighting; an alias is not an additional parser.
        </p>
        <div class="docs-api-table-wrap">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>Canonical language</th>
                <th>Accepted short names and aliases</th>
                <th>Filename hints</th>
              </tr>
            </thead>
            <tbody>
              {languageRows.map(([language, aliases, files]) => (
                <tr key={language}>
                  <td>
                    <code>{language}</code>
                  </td>
                  <td>{aliases}</td>
                  <td>{files}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Inference inspects a bounded part of the source rather than trying every grammar. Short
          expressions and ambiguous text can remain plain. An unsupported label, such as{" "}
          <code>python</code> or <code>sql</code>, does not load a new grammar; with inference
          enabled, another file or content hint can still be used. Choose literal mode when that
          would be misleading.
        </p>
      </Topic>
      <Topic id="code-literal-mode" title="Keep plain source deliberately plain">
        <p>
          Generic labels such as <code>text</code>, <code>plain</code> and <code>auto</code>
          normalize to plain text, but still allow inference by default. Pair{" "}
          <code>language="text"</code> with <code>{"inferLanguage={false}"}</code> to make a log,
          unknown language or report literal even when its contents look like code.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code="SELECT name FROM workspaces;"\n  language="text"\n  inferLanguage={false}\n/>'
          }
        />
        <p>
          To keep known language metadata and eligible reading controls while disabling colors, use{" "}
          <code>{"highlight={false}"}</code> instead. This skips the highlighter for that instance.
          Both approaches preserve selection and exact copying; neither removes source characters or
          applies formatting.
        </p>
        <CodeBlock
          language="tsx"
          code={'<Code code={source} language="tsx" highlight={false} />'}
        />
      </Topic>
      <Topic id="code-language-helpers" title="Reuse language decisions outside the viewer">
        <p>
          Code resolves its own language. Use the exported helpers only when surrounding UI needs
          the same metadata, such as a file inventory or language badge. Each returns a canonical
          <code> CodeLanguage</code> value and leaves source handling to your app.
        </p>
        <CodeBlock
          language="typescript"
          code={
            'import {\n  codeLanguageForFile,\n  normalizeCodeLanguage,\n  resolveCodeLanguage,\n} from "@kamod-ch/ui/code";\n\ncodeLanguageForFile("src/Welcome.tsx"); // "tsx"\nnormalizeCodeLanguage("language-yml"); // "yaml"\nresolveCodeLanguage("export const ready = true;", undefined, "src/status.ts"); // "typescript"'
          }
        />
        <p>
          <code>normalizeCodeLanguage</code> normalizes one label without inspecting source.
          <code> codeLanguageForFile</code> uses the final extension, ignoring query, hash and
          source-position suffixes. <code>resolveCodeLanguage</code> applies the inference order
          above; it does not implement strict mode. For a strict external selection, normalize the
          chosen label directly.
        </p>
      </Topic>
    </>
  );
}
