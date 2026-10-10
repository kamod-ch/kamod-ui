import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";

const resetExample = `import { Code } from "@kamod-ch/ui/code";

type SourceFile = { path: string; source: string };

export function SelectedFile({ file }: { file: SourceFile }) {
  return (
    <Code
      key={file.path}
      code={file.source}
      filePath={file.path}
      defaultImportsCollapsed
      defaultWrapped
    />
  );
}`;

const copyFeedback = `import { Code } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

export function CopyableCommand() {
  const [message, setMessage] = useState("");
  return (
    <section>
      <Code
        code="pnpm build"
        language="bash"
        onCopy={() => setMessage("Command copied. Run it in your project.")}
        onCopyError={() => setMessage("Copy was blocked. Select the command and copy it manually.")}
      />
      <p class="mt-2 text-sm text-muted-foreground">{message}</p>
    </section>
  );
}`;

export function CodeReadingGuide() {
  return (
    <>
      <Topic id="code-folding-rules" title="Collapse declarations, keep the explanation">
        <p>
          The import control counts <strong>statements, not imported names or lines</strong>. One
          multiline <code>import</code> with six names is one statement. Leading static JavaScript
          and TypeScript imports can be folded, including type-only imports. Comments and directives
          remain visible; dynamic <code>import()</code> calls and imports after executable code are
          not folded.
        </p>
        <p>
          Folding removes the declarations from the displayed source and closes the whitespace at
          those joins. It does not leave an empty box for each hidden line. If the entire snippet
          only contains imports, a collapse control would hide the useful example, so it is omitted.
          Use <code>{"showImportControl={false}"}</code> when every declaration should stay visible.
        </p>
      </Topic>
      <Topic id="code-wrapping-rules" title="Wrap for reading, preserve the real line">
        <p>
          Wrapping operates on the presentation of each source line. Continuations receive readable
          indentation, and very deep indentation is constrained when space becomes scarce. A line
          that already fits should retain its original alignment. On narrow panels, long content can
          break rather than force the whole page to scroll sideways.
        </p>
        <p>
          <strong>A wrapped continuation is not a new source line.</strong> Copy still returns the
          original line, not the visual layout. Use <code>defaultWrapped</code> for prose-like
          prompts and long attributes; leave it off when exact columns matter, such as an aligned
          text report. The switch appears for snippets with an actual filename or path, or a
          recognized coding language. Commands never show it; prose and Markdown prompts without a
          file keep their default wrapping without a switch. Use{" "}
          <code>{"showWrapControl={false}"}</code> to hide it for eligible source too.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  language="tsx"\n  defaultWrapped\n  showWrapControl={false}\n/>'
          }
        />
        <p>
          Here, <code>source</code> is your source string. This composition starts wrapped and
          removes the control, which is useful when a containing layout has one fixed reading mode.
        </p>
      </Topic>
      <Topic id="code-reading-state" title="Choose what resets when the file changes">
        <p>
          By default, the import and wrap controls own their state. The <code>defaultWrapped</code>{" "}
          and <code>defaultImportsCollapsed</code> props choose initial behavior; they are not
          controlled-state props. Changing the source resets import folding to its default. Wrap
          preference remains with the mounted instance so a reader can carry it across files.
        </p>
        <p>
          For preferences shared across panels, supply <code>wrapped</code> and{" "}
          <code>importsCollapsed</code> with their change callbacks instead. Controlled values
          remain owned by your app when the file changes. See{" "}
          <a href="#code-controlled-preferences">Own the Reading State</a> for a live example.
        </p>
        <p>
          When each file should start fresh, give Code a stable <code>key</code> based on the
          selected path. When the reader’s wrapping preference should carry over, leave that key
          off. File navigation itself belongs to your surrounding UI, using a{" "}
          <a href={withBasePath("/docs/tree/installation")}>Tree</a>,{" "}
          <a href={withBasePath("/docs/tabs/installation")}>Tabs</a> or your own simple list.
        </p>
        <CodeBlock code={resetExample} filePath="src/SelectedFile.tsx" />
      </Topic>
    </>
  );
}

export function CodeCopyGuide() {
  return (
    <>
      <Topic id="code-copy-fidelity" title="Copy the source the reader expects">
        <p>
          Copy writes the exact <code>code</code> string to the clipboard. File labels, custom
          headers, syntax tokens and line-wrap controls are excluded. Hidden imports are included.
          In document mode, the visible JSX can be a friendly rendering while Copy still provides
          the original Markdown.
        </p>
        <p>
          <strong>Author source that can stand on its own.</strong> Use real imports, include
          required setup nearby and avoid a copied command that contains a decorative prompt
          character. If your example needs a secret or account-specific identifier, pass an explicit
          placeholder rather than a real credential.
        </p>
      </Topic>
      <Topic id="code-copy-feedback" title="React to success and recover from failure">
        <p>
          The built-in button reports successful copying and announces its status.{" "}
          <code>onCopy</code> receives the original string after the clipboard write succeeds.{" "}
          <code>onCopyError</code> lets your app provide a helpful next step if clipboard access is
          unavailable or denied. Do not report success before the browser confirms it.
        </p>
        <CodeBlock code={copyFeedback} filePath="src/CopyableCommand.tsx" />
        <p>
          <strong>Use the same action outside a code panel.</strong> Import <code>CopyButton</code>
          from <code>@kamod-ch/ui/copy-button</code> and pass the exact <code>value</code> to copy.
          Set <code>label</code> for visible text, <code>subject</code> for status announcements, or{" "}
          <code>iconOnly</code> for a compact action with an accessible name. The shared button uses
          the theme’s success color, keeps its width stable during feedback, and respects reduced
          motion. Pending results and feedback timers are discarded when the value changes or the
          action unmounts.
        </p>
        <CodeBlock
          code={
            'import { CopyButton } from "@kamod-ch/ui/copy-button";\n\nexport const InstallAction = () => (\n  <CopyButton\n    value="pnpm add @kamod-ch/ui"\n    label="Copy command"\n    subject="install command"\n  />\n);'
          }
          filePath="src/InstallAction.tsx"
        />
        <p>
          The paragraph adds persistent guidance; the component already owns the live announcement.
          Clipboard writing depends on browser permission and a secure context. When it fails, the
          source remains selectable. A legacy browser fallback cleans up its temporary field and
          restores focus; every copy action shares the same lifecycle.
        </p>
      </Topic>
      <Topic id="code-safe-content" title="Treat rendered content as application content">
        <p>
          Source supplied through <code>code</code> is displayed as text before highlighting;
          markup-like source does not become a live element. The optional{" "}
          <code>renderedContent</code> prop accepts Preact children that{" "}
          <strong>your application has already prepared</strong>. Code does not parse Markdown or
          sanitize arbitrary HTML for that slot.
        </p>
        <p>
          For content from an untrusted source, keep it as the source string or use your
          application’s reviewed Markdown and sanitization pipeline before rendering. For a
          hand-authored guide, normal JSX elements are a straightforward way to build the document
          view shown in <a href="#document">Rendered Document</a>.
        </p>
      </Topic>
    </>
  );
}
