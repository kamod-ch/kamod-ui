import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";

export function CodeCustomizationGuide() {
  return (
    <>
      <Topic id="code-surfaces" title="Choose a surface before adding custom styles">
        <p>
          Use <code>variant="default"</code> for the familiar framed code surface,{" "}
          <code>subtle</code> when the snippet sits inside another quiet reading area, and{" "}
          <code>outline</code> when the surrounding background should remain visible. The{" "}
          <a href="#appearance">Surface Comparison</a> lets you inspect the same source in each
          variant.
        </p>
        <p>
          Set <code>class</code> on the root for width, placement and layout. Use{" "}
          <code>preClassName</code> for the source area, such as a local height limit.{" "}
          <code>className</code> remains an alias for that source-area class; prefer the more
          explicit prop in new code so it cannot be mistaken for the root class.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  filePath="src/long-example.ts"\n  variant="outline"\n  class="w-full max-w-3xl"\n  preClassName="max-h-96"\n/>'
          }
        />
        <p>
          This expression assumes <code>source</code> is a string. A height limit contains scrolling
          inside the source panel; it does not virtualize or reduce the amount of source rendered.
          For large inputs, follow <a href="#performance">Performance and Delivery</a>.
        </p>
      </Topic>
      <Topic id="code-toolbar-composition" title="Adapt the header, retain the built-in actions">
        <p>
          For a short label or badge beside the existing actions, supply <code>toolbarContent</code>
          . A file path remains the most useful label when the snippet has a real destination. When
          your header needs a different arrangement, use <code>renderToolbar</code> and render the
          supplied <code>actions</code> exactly once.
        </p>
        <p>
          The actions value can contain both wrapping and Copy, depending on the source and controls
          you enabled. It is not always only a copy button. The <a href="#toolbar">Custom Header</a>{" "}
          example hides the wrap switch deliberately, then places the remaining action opposite a
          small contextual label. The separate import row, when present, continues to use the shared
          layout.
        </p>
        <p>
          <code>CodeFileHeader</code> and <code>CodeSnippetLabel</code> are available for more
          involved compositions. Use <code>CodeFileHeader</code> when you need the shared file icon,
          path and optional line count inside a custom header. Do not put its content inside another
          interactive control.
        </p>
        <CodeBlock
          language="tsx"
          code={
            'import { Code, CodeFileHeader } from "@kamod-ch/ui/code";\n\nconst source = \'export const ready = true;\';\n\nexport function NamedExample() {\n  return (\n    <Code\n      code={source}\n      language="typescript"\n      renderToolbar={(actions) => (\n        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">\n          <CodeFileHeader path="src/status.ts" lineCount={1} />\n          {actions}\n        </div>\n      )}\n    />\n  );\n}'
          }
        />
      </Topic>
      <Topic id="code-theme-integration" title="Let the theme carry the visual language">
        <p>
          The component follows the shared semantic surface, foreground and border tokens, with
          syntax colors that remain legible in light and dark modes. Change the site theme to
          compare them in the examples. You do not need a separate code theme provider or a
          hard-coded dark background.
        </p>
        <p>
          To give source tokens a different palette, use <code>syntaxTheme</code>. The{" "}
          <a href="#syntax-themes">Syntax Themes and Typography</a> guide compares the available
          presets and documents local color, font and emphasis overrides. For replacing controls or
          adding content slots, continue to <a href="#modularity">Build Your Own Reader</a>.
        </p>
        <p>
          Use the{" "}
          <a href={withBasePath("/docs/theming/installation#token-overrides")}>Theme Token Guide</a>{" "}
          for application-wide changes, and{" "}
          <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle</a> for an
          appearance control. Keep source text, filename labels, focus rings and disabled states
          readable together; a pleasing surface should still leave the code easy to scan.
        </p>
      </Topic>
    </>
  );
}

export function CodePerformanceGuide() {
  return (
    <>
      <Topic id="code-lazy-highlighting" title="Start readable, highlight near the viewport">
        <p>
          Code first renders the escaped source, then loads its syntax highlighter near the visible
          area. The highlighter is loaded lazily rather than added to every route’s initial work.
          Language selection uses small bounded checks, and expensive derived display strings are
          reused until their inputs change.
        </p>
        <p>
          The component disconnects visibility observers and ignores stale highlighting results when
          its source changes or it unmounts. Copy-feedback timers are also cleaned up. Avoid
          wrapping it in an effect that repeatedly replaces identical source, and keep your own file
          fetches cancellable so a slower previous selection cannot overwrite the current one.
        </p>
      </Topic>
      <Topic id="code-large-files" title="Keep examples focused and file viewers selective">
        <p>
          <strong>Code is a source viewer, not a virtualized editor.</strong> All displayed source
          is rendered and highlighted; a visual height limit does not change that. Prefer one
          focused excerpt in a guide and load a full file only when the reader opens it. For a file
          tree, mount the selected source rather than dozens of hidden Code instances.
        </p>
        <p>
          For unusually large logs or generated files, consider a plain-text excerpt with{" "}
          <code>{"inferLanguage={false}"}</code>, a download link, or a specialized virtualized
          viewer. Keep the label honest about whether Copy copies the excerpt or the complete file.
          The component always copies exactly the <code>code</code> you pass.
        </p>
      </Topic>
      <Topic id="code-server-rendering" title="Keep the first render deterministic">
        <p>
          Source text and controls can render on the server without clipboard or layout access.
          Highlighting and browser clipboard work happen on the client. Send the same source, file
          metadata and default reading preferences to the server and the first client render to
          avoid an unnecessary content change during hydration.
        </p>
        <p>
          A theme initialization strategy still belongs at your app entry. Follow{" "}
          <a href={withBasePath("/docs/theming/installation#provider-controls")}>
            Appearance Preferences
          </a>{" "}
          to keep the first paint consistent; do not inspect browser storage inside every Code
          panel.
        </p>
      </Topic>
    </>
  );
}

export function CodeTroubleshootingGuide() {
  return (
    <>
      <Topic id="code-missing-colors" title="Why does this snippet look like plain text?">
        <p>
          First check that the shared theme CSS is loaded. Then check the source’s language or
          extension. Inference is intentionally conservative, so a single expression such as{" "}
          <code>workspace.name</code> may need <code>language="typescript"</code>. A language
          outside the supported families remains readable but does not gain a grammar just because
          its name is supplied.
        </p>
        <p>
          If colors appear shortly after the source enters view, that is the lazy highlighter
          arriving. If they never arrive, inspect failed script requests and the selected language.
          A failed highlighter load should leave the complete source visible. See{" "}
          <a href="#code-language-list">Supported Languages</a> and{" "}
          <a href="#code-install-styles">Stylesheet Setup</a>.
        </p>
      </Topic>
      <Topic id="code-missing-controls" title="Why is the import or wrapping control absent?">
        <p>
          Import folding requires recognizable leading static imports and visible content after
          them. A snippet containing only imports, a Bash command or a document view will not get an
          import control. Check <code>showImportControl</code> too. The wrapping switch requires an
          actual filename or path, or a recognized coding language. Bash, terminal, Git and other
          commands always omit it, as do unfiled prose and Markdown prompts. It is also omitted for{" "}
          <code>renderedContent</code> or when <code>{"showWrapControl={false}"}</code>.
        </p>
        <p>
          On very narrow panels, control labels simplify to preserve room for the icons and switch.
          Their accessible names still describe the action. Widen the containing panel to see the
          fuller descriptions.
        </p>
      </Topic>
      <Topic id="code-formatting-questions" title="Why are indentation and copied text unchanged?">
        <p>
          That is intentional.{" "}
          <strong>Syntax highlighting changes presentation; it does not format source.</strong>{" "}
          Format the string before passing it to Code if your product promises formatted output.
          Wrapping and folded imports make reading easier while preserving the copy contract. If you
          need an editor, diagnostics, line selection or virtualized documents, compose a tool
          designed for those responsibilities.
        </p>
        <p>
          For small UI demonstrations, pair Code with a real{" "}
          <a href={withBasePath("/docs/button/installation")}>Button</a>,{" "}
          <a href={withBasePath("/docs/input/installation")}>Input</a> or{" "}
          <a href={withBasePath("/docs/alert/installation")}>Alert</a>. For a complete multi-file
          composition, explore <a href={withBasePath("/blocks")}>Blocks</a>. The most useful example
          is the smallest one that explains the next step.
        </p>
      </Topic>
    </>
  );
}
