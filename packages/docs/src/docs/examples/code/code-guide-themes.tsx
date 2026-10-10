import { PaletteIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsCallout } from "../../components/DocsCallout";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";
import { CodeThemePlayground } from "./code-playgrounds";

export const syntaxThemeSnippet = `import { Code, codeSyntaxThemes, type CodeSyntaxTheme } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

export function ThemeReader({ source }: { source: string }) {
  const [syntaxTheme, setSyntaxTheme] = useState<CodeSyntaxTheme>("dusk");
  return (
    <section>
      <label>
        Syntax palette
        <select value={syntaxTheme}
          onChange={(event) => setSyntaxTheme(event.currentTarget.value as CodeSyntaxTheme)}>
          {codeSyntaxThemes.map((theme) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </label>
      <Code code={source} language="tsx" syntaxTheme={syntaxTheme} />
    </section>
  );
}`;

const tokenRows = [
  ["keyword", "Imports, declarations and control-flow keywords"],
  ["string", "Strings, selectors and attribute names"],
  ["function", "Functions and class names"],
  ["property", "Properties, tags, constants and deleted tokens"],
  ["number", "Numbers and booleans"],
  ["variable", "Variables, regular expressions and important tokens"],
  ["comment", "Comments, prologs and document declarations"],
  ["punctuation", "Braces, commas and other delimiters"],
  ["operator", "Operators, entities and URLs"],
] as const;

export function CodeSyntaxThemeGuide() {
  return (
    <>
      <Topic id="code-syntax-presets" title="Pick a palette, keep the source">
        <p>
          <strong>One prop changes the syntax palette for one Code instance.</strong> Use{" "}
          <code>syntaxTheme="dusk"</code>, <code>"forest"</code> or <code>"monochrome"</code>. Omit
          it—or choose <code>"default"</code>—for the standard palette. The shared stylesheet
          includes every preset: no new provider, theme download or separate highlighter is needed.
        </p>
        <CodeBlock
          language="tsx"
          code={'<Code code={source} language="tsx" syntaxTheme="dusk" />'}
        />
        <CodeThemePlayground />
        <div class="docs-api-table-wrap">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>Palette</th>
                <th>Reading character</th>
                <th>A useful starting point</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>default</code>
                </td>
                <td>Familiar blue keywords and distinct token colors.</td>
                <td>Consistency with the rest of the documentation.</td>
              </tr>
              <tr>
                <td>
                  <code>dusk</code>
                </td>
                <td>Violet declarations, teal strings and warm numeric values.</td>
                <td>Source that needs a different personality without a dark-only surface.</td>
              </tr>
              <tr>
                <td>
                  <code>forest</code>
                </td>
                <td>Green keywords, olive strings and amber functions.</td>
                <td>A warmer, quieter alternative to blue-led syntax.</td>
              </tr>
              <tr>
                <td>
                  <code>monochrome</code>
                </td>
                <td>Neutral tokens, stronger keywords and italic comments.</td>
                <td>Readers who prefer structure and restrained emphasis over many colors.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Use the page’s light/dark control to inspect both schemes. Each preset follows the
          application’s <code>dark</code> class; selecting a syntax palette does not change that
          class. A locally themed preview follows its own document instead. Syntax choices never
          change the source string, copied text, selected language or reading preferences.
        </p>
        <CodeBlock code={syntaxThemeSnippet} filePath="src/ThemeReader.tsx" />
        <p>
          <code>codeSyntaxThemes</code> provides the available IDs; <code>CodeSyntaxTheme</code>{" "}
          keeps your own selector typed. Persisting that choice is optional application state. A
          palette switch updates CSS variables only—it does not retokenize the same source.
        </p>
      </Topic>
      <Topic id="code-theme-boundaries" title="Three choices, three separate responsibilities">
        <p>
          <code>language</code> decides which grammar recognizes the source.{" "}
          <code>syntaxTheme</code> decides how those recognized tokens look. <code>variant</code>{" "}
          decides how much framing the panel uses. Your application theme still owns its semantic
          backgrounds, borders and light/dark scheme. Change one responsibility at a time so the
          result stays predictable.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  language="typescript"\n  syntaxTheme="forest"\n  variant="outline"\n/>'
          }
        />
        <DocsCallout title="Syntax colors are not a page theme" icon={<PaletteIcon />}>
          <p>
            The example uses TypeScript highlighting, Forest token colors and an outlined panel. Its
            header and controls continue to belong to your app. For broader changes, follow{" "}
            <a href={withBasePath("/docs/theming/installation")}>Theming</a>; for only the frame,
            compare <a href="#appearance">Surface Variants</a>.
          </p>
        </DocsCallout>
        <p>
          Plain text has no syntax tokens to recolor. Likewise, <code>{"highlight={false}"}</code>{" "}
          skips token markup, and <code>renderedContent</code> supplies its own presentation. A
          palette cannot add missing grammar support. Start with{" "}
          <a href="#language-detection">Language Selection</a> if recognized source is the part that
          needs changing.
        </p>
      </Topic>
      <Topic id="code-syntax-overrides" title="Tune a few tokens before designing a whole palette">
        <p>
          Put a class on Code and override its <code>--kamod-code-*</code> variables in your
          stylesheet. Keep the class local to the panels you intend to change. The rules below build
          on Dusk; unmodified colors continue to come from that preset. Place your stylesheet after
          the shared theme import.
        </p>
        <CodeBlock
          language="tsx"
          code={'<Code code={source} language="tsx" syntaxTheme="dusk" class="product-source" />'}
        />
        <CodeBlock
          filePath="src/product-source.css"
          code={
            ".product-source {\n  --kamod-code-keyword: #6d28d9;\n  --kamod-code-string: #0f766e;\n  --kamod-code-comment-style: italic;\n  --kamod-code-keyword-weight: 600;\n}\n\n.dark .product-source {\n  --kamod-code-keyword: #c4b5fd;\n  --kamod-code-string: #5eead4;\n}"
          }
        />
        <div class="docs-api-table-wrap">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>Color variable</th>
                <th>Token group</th>
              </tr>
            </thead>
            <tbody>
              {tokenRows.map(([name, description]) => (
                <tr key={name}>
                  <td>
                    <code>{`--kamod-code-${name}`}</code>
                  </td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each group also accepts <code>-weight</code> and <code>-style</code> suffixes, such as{" "}
          <code>--kamod-code-comment-style</code>. Grammar-specific bold and italic tokens retain
          their own emphasis. The import control’s keyword shares <code>--kamod-code-keyword</code>{" "}
          with source keywords. Other labels and buttons retain the application’s standard text
          colors.
        </p>
        <p>
          Token names describe highlighting groups, not a complete syntax tree. One language may
          emit nested tokens or classify a construct differently from another. Check your actual
          source in both schemes and every surface you use. Choose readable contrasts; a color
          should help recognition without becoming the only way to understand the code.
        </p>
      </Topic>
      <Topic id="code-code-typography" title="Make the reading rhythm your own">
        <p>
          Typography variables affect the source area without enlarging its header or controls. Use{" "}
          <code>--kamod-code-font-family</code>, <code>--kamod-code-font-size</code>,{" "}
          <code>--kamod-code-line-height</code> and <code>--kamod-code-foreground</code>. A slightly
          roomier line height often does more for a long example than another color.
        </p>
        <CodeBlock
          filePath="src/reading.css"
          code={
            '.comfortable-source {\n  --kamod-code-font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;\n  --kamod-code-font-size: 0.875rem;\n  --kamod-code-line-height: 1.8;\n  --kamod-code-comment-style: italic;\n}'
          }
        />
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  filePath="src/Welcome.tsx"\n  syntaxTheme="monochrome"\n  class="comfortable-source"\n  defaultWrapped\n/>'
          }
        />
        <p>
          Supply your own font only if it is already available or loaded by your application. Code
          does not fetch fonts. Keep a monospace fallback so indentation and wrapped continuation
          lines remain predictable. Use a regular style for most tokens and reserve italics or
          heavier weight for a few useful distinctions.
        </p>
        <p>
          For a custom surface, the same root accepts <code>--kamod-code-surface</code> and{" "}
          <code>--kamod-code-header</code>. Review text and controls together when changing their
          backgrounds. Continue with <a href="#customization">Composition and Theming</a> for
          layout, or <a href="#accessibility">Accessibility</a> for keyboard and reading checks.
        </p>
      </Topic>
    </>
  );
}
