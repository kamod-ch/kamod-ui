import { Code, type CodeColorMode } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";
import { CodeBlock } from "../../components/CodeBlock";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";

const modes = [
  {
    value: "inverse",
    label: "Inverse (default)",
    detail: "Dark source on a light interface; light source on a dark interface.",
  },
  {
    value: "inherit",
    label: "Inherit",
    detail: "Source follows the nearest interface color mode.",
  },
  {
    value: "light",
    label: "Light",
    detail: "Source stays light when the surrounding interface changes.",
  },
  {
    value: "dark",
    label: "Dark",
    detail: "Source stays dark when the surrounding interface changes.",
  },
] as const;

export const colorModeSnippet = `import { Code, type CodeColorMode } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

const source = 'const greeting = "Hello";';

export function SourceAppearance() {
  const [colorMode, setColorMode] = useState<CodeColorMode>("inverse");
  return (
    <section>
      <label>
        Source color mode
        <select value={colorMode}
          onChange={(event) => setColorMode(event.currentTarget.value as CodeColorMode)}>
          <option value="inverse">Inverse (default)</option>
          <option value="inherit">Inherit</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <Code code={source} language="typescript" colorMode={colorMode}
        showToolbar={false} showWrapControl={false} />
    </section>
  );
}`;

export function CodeColorModePlayground() {
  const [colorMode, setColorMode] = useState<CodeColorMode>("inverse");
  return (
    <div class="my-5 min-w-0 space-y-4" data-code-demo="color-mode">
      <label class="grid max-w-sm gap-2 text-sm font-medium">
        Source color mode
        <select
          class="min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          value={colorMode}
          onChange={(event) => setColorMode(event.currentTarget.value as CodeColorMode)}
        >
          {modes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </label>
      <Code
        code={'const greeting = "Hello";\nconsole.log(greeting);'}
        language="typescript"
        colorMode={colorMode}
        showToolbar={false}
        showWrapControl={false}
      />
      <p class="text-sm text-muted-foreground" aria-live="polite">
        {modes.find((mode) => mode.value === colorMode)?.detail}
      </p>
    </div>
  );
}

export function CodeColorModeGuide() {
  return (
    <>
      <Topic id="code-inverse-mode" title="Start with the opposite source appearance">
        <p>
          Code uses <code>colorMode="inverse"</code> by default. Its reading area is dark inside a
          light interface and light inside a dark interface. You can leave the prop out for this
          behavior; a language and source string are still enough to get started.
        </p>
        <p>
          Choose <code>inherit</code> when source should match its surroundings, or choose{" "}
          <code>light</code> or <code>dark</code> to keep that reader in one mode. Try each option
          below, then switch the site appearance to compare. The source and grammar stay the same.
        </p>
        <CodeColorModePlayground />
        <CodeBlock
          language="tsx"
          code={
            '<Code code={source} /> // inverse by default\n<Code code={source} colorMode="inherit" />\n<Code code={source} colorMode="light" />\n<Code code={source} colorMode="dark" />'
          }
        />
        <p>
          These are alternative expressions using a source string from your app. A source color mode
          works for highlighted code, plain text and prepared document content. It never changes
          source characters, selected language, wrapping, import folding or copied text.
        </p>
      </Topic>
      <Topic id="code-color-mode-scope" title="Keep the surrounding interface in its own mode">
        <p>
          The choice belongs to the <strong>source or document area</strong>. The filename header,
          Copy action, reading controls and <code>beforeCode</code>/<code>afterCode</code> content
          keep the surrounding interface appearance. This lets a dark reading area sit inside a
          light card without turning its buttons and explanations dark too.
        </p>
        <p>
          Inverse and inherited modes use the nearest appearance scope. Inside a locally themed
          preview or showcase, that local light/dark setting determines the source appearance, even
          when the outer page uses a different mode. Ordinary app scopes use the theme's{" "}
          <code>.light</code>/<code>.dark</code> boundaries. Code does not read browser storage or
          change the page theme.
        </p>
        <p>
          Use <code>syntaxTheme</code> to choose token colors separately: all eight palettes adapt
          to the source area's light or dark mode, including the Prism-derived palettes. The{" "}
          <code>solarized-light</code> name identifies a palette, not a forced light mode. See{" "}
          <a href="#syntax-themes">Syntax Themes and Typography</a> to compare them, or{" "}
          <a href="#source-file">Optional File Header</a> to add surrounding context later.
        </p>
        <CodeBlock code={colorModeSnippet} filePath="src/SourceAppearance.tsx" />
      </Topic>
    </>
  );
}
