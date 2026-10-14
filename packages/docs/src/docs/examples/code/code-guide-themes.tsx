import { PaletteIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsCallout } from "../../components/DocsCallout";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";
import { CodePrismPaletteStudies } from "./CodePrismPaletteStudies";
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
          <strong>Choose from eight palettes with one prop.</strong> Keep the familiar{" "}
          <code>default</code>, <code>dusk</code>, <code>forest</code> or <code>monochrome</code>
          palette, or use <code>okaidia</code>, <code>tomorrow</code>, <code>twilight</code> or{" "}
          <code>solarized-light</code> for a Prism-derived palette. Every preset is included in the
          core stylesheet; no theme download, extra provider or different highlighter is needed. The
          selector below changes the real viewer, not a screenshot.
        </p>
        <CodeBlock
          language="tsx"
          code={'<Code code={source} language="tsx" syntaxTheme="okaidia" />'}
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
          All eight palettes have light and dark adaptations selected by the source area's{" "}
          <code>colorMode</code>. Inverse is the default; the selector can match the interface or
          hold the source in an explicit mode. A palette name never forces light or dark, including{" "}
          <code>solarized-light</code>. Headers and controls keep the surrounding appearance.
          Changing the palette never changes source, clipboard text, grammar or reading preferences.
        </p>
        <CodeBlock code={syntaxThemeSnippet} filePath="src/ThemeReader.tsx" />
        <p>
          <code>codeSyntaxThemes</code> provides the available IDs; <code>CodeSyntaxTheme</code>{" "}
          keeps your own selector typed. Persisting that choice is optional application state. A
          palette switch updates CSS variables only—it does not retokenize the same source.
        </p>
      </Topic>
      <Topic id="code-prism-palettes" title="Four Prism Palettes, One Familiar Reader">
        <p>
          <strong>Compare the same source before choosing its colors.</strong> These studies use
          real Code components with identical tokens. Their palette families come from
          <a href="https://github.com/PrismJS/prism/tree/v1.30.0/themes">
            {" "}
            Prism 1.30's bundled themes
          </a>
          . Kamod keeps their syntax distinctions and color families, with paired light/dark
          adaptations for the selected source mode. Typography, spacing, rounded corners, controls
          and source links remain shared. The GitHub action on each study opens that palette's
          original stylesheet.
        </p>
        <CodePrismPaletteStudies />
        <p>
          The colors are <strong>scoped to an individual reader</strong>, so every palette can
          appear on the same page without overriding another. Token shades are adjusted to remain
          readable on the selected light or dark source surface; they are not fixed copies of a
          stylesheet designed for only one background. Decorative Prism shadows, font changes and
          plugin frames are omitted; the MIT attribution is preserved in the shipped stylesheet.
        </p>
        <DocsCallout title="Choose palette and color mode independently" icon={<PaletteIcon />}>
          <p>
            Use <code>syntaxTheme="okaidia"</code> for its color family and{" "}
            <code>colorMode="dark"</code> to request a dark source area. Omit the latter to keep the
            default inverse behavior. Importing unscoped Prism stylesheets can override the shared{" "}
            <code>.token</code> rules; the bundled presets already keep each reader's palette local
            and adapt its colors to the chosen mode.
          </p>
        </DocsCallout>
      </Topic>
      <Topic id="code-shared-syntax-choice" title="Choose Once for Several Readers">
        <p>
          <strong>Lift the preference to the component that owns the readers.</strong> The selector
          does not need to be repeated in every code header. Store one typed choice in the parent,
          then pass it to each Code instance. A single prop can also fix a palette for an article or
          example. Code has no hidden global preference, storage listener or browser-only theme
          initialization.
        </p>
        <CodeBlock
          filePath="src/CompareSources.tsx"
          code={`import { Code, type CodeSyntaxTheme } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

type Sources = { before: string; after: string };

export function CompareSources({ before, after }: Sources) {
  const [syntaxTheme, setSyntaxTheme] = useState<CodeSyntaxTheme>("tomorrow");
  return (
    <section>
      <button onClick={() => setSyntaxTheme("solarized-light")}>
        Use the Solarized palette
      </button>
      <Code code={before} filePath="before.tsx" syntaxTheme={syntaxTheme} />
      <Code code={after} filePath="after.tsx" syntaxTheme={syntaxTheme} />
    </section>
  );
}`}
        />
        <p>
          If a preference should survive navigation or reloads, own that decision above the page and
          validate a saved ID against <code>codeSyntaxThemes</code>. Follow
          <a href={withBasePath("/docs/signals-package/installation#usage")}>
            {" "}
            Persisted Signals
          </a>{" "}
          for an existing storage pattern. During server rendering, start with a consistent default
          and apply browser-only preferences after hydration. A palette switch changes CSS variables
          and token rules; it does not fetch a theme or run Prism again.
        </p>
      </Topic>
      <Topic id="code-theme-boundaries" title="Keep grammar, palette and appearance independent">
        <p>
          <code>language</code> decides which grammar recognizes the source.{" "}
          <code>syntaxTheme</code> selects the token color family. <code>colorMode</code> chooses
          the source area's light/dark appearance, and <code>variant</code> chooses the panel's
          surface treatment. Your application still owns the surrounding header, controls and
          before/after content. None of these presentation settings rewrites the source.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  language="typescript"\n  syntaxTheme="forest"\n  colorMode="inherit"\n  variant="outline"\n/>'
          }
        />
        <DocsCallout title="Syntax colors are not a page theme" icon={<PaletteIcon />}>
          <p>
            The example uses TypeScript highlighting, Forest token colors and an outlined panel,
            with source appearance matching the nearest interface mode. Its header and controls
            continue to belong to your app. For broader changes, follow{" "}
            <a href={withBasePath("/docs/theming/installation")}>Theming</a>; for only the frame,
            compare <a href="#appearance">Surface Variants</a>.
          </p>
        </DocsCallout>
        <p>
          Plain text has no syntax tokens to recolor, and <code>{"highlight={false}"}</code> skips
          token markup. Both still use the selected source color mode. Prepared{" "}
          <code>renderedContent</code> uses the same content boundary; author its custom colors for
          that mode. A palette cannot add missing grammar support. Start with{" "}
          <a href="#language-detection">Language Selection</a> if recognized source is the part that
          needs changing.
        </p>
      </Topic>
      <Topic id="code-syntax-overrides" title="Tune a few tokens before designing a whole palette">
        <p>
          Put a class on Code and override its <code>--kamod-code-*</code> variables in your
          stylesheet. Keep the class local to the panels you intend to change. The rules below build
          on Dusk; unmodified colors continue to come from that preset. Place your stylesheet after
          the shared theme import. Add <code>-light</code> and <code>-dark</code> to a token
          variable to supply both colors; Code selects the pair using the source's resolved mode,
          including inverse and explicit choices.
        </p>
        <CodeBlock
          language="tsx"
          code={'<Code code={source} language="tsx" syntaxTheme="dusk" class="product-source" />'}
        />
        <CodeBlock
          filePath="src/product-source.css"
          code={
            ".product-source {\n  --kamod-code-keyword-light: #6d28d9;\n  --kamod-code-keyword-dark: #c4b5fd;\n  --kamod-code-string-light: #0f766e;\n  --kamod-code-string-dark: #5eead4;\n  --kamod-code-comment-style: italic;\n  --kamod-code-keyword-weight: 600;\n}"
          }
        />
        <div class="docs-api-table-wrap">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>Token variable base</th>
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
          Every color group in the table accepts the <code>-light</code>/<code>-dark</code> pair. An
          unsuffixed value such as <code>--kamod-code-keyword</code> takes precedence and fixes that
          color in both source modes. Use a pair when the color should adapt; reserve the single
          value for an intentional fixed override.
        </p>
        <p>
          Source-reference dashes use the theme's <code>--primary-light</code>/
          <code>--primary-dark</code> pair automatically. Override{" "}
          <code>--kamod-code-primary-light</code> and <code>--kamod-code-primary-dark</code> on a
          viewer to customize that cue; themes without either pair use neutral defaults. Only the
          reference mark uses the selected endpoint. Syntax text and the application's{" "}
          <code>--primary</code> remain unchanged.
        </p>
        <p>
          Each group also accepts <code>-weight</code> and <code>-style</code> suffixes, such as{" "}
          <code>--kamod-code-comment-style</code>. Grammar-specific bold and italic tokens retain
          their own emphasis. These source colors do not move the import control into the source
          mode; reading controls keep their surrounding interface appearance. A Prism-specific token
          distinction—such as Tomorrow's separate tag color—can be refined with a locally scoped{" "}
          <code>.token.tag</code> rule when needed.
        </p>
        <p>
          Token names describe highlighting groups, not a complete syntax tree. One language may
          emit nested tokens or classify a construct differently from another. Check your actual
          source in both source modes and every surface you use. Choose readable contrasts; a color
          should help recognition without becoming the only way to understand the code.
        </p>
      </Topic>
      <Topic id="code-code-typography" title="Make the reading rhythm your own">
        <p>
          Typography variables affect the source area without enlarging its header or controls. Use{" "}
          <code>--kamod-code-font-family</code>, <code>--kamod-code-font-size</code>,{" "}
          <code>--kamod-code-line-height</code> for the reading rhythm. Set{" "}
          <code>--kamod-code-foreground-light</code>/<code>-dark</code> for the base text, and{" "}
          <code>--kamod-code-source-surface-light</code>/<code>-dark</code> for the source/document
          background. Their unsuffixed equivalents remain fixed overrides. Keep text and tokens
          readable on both backgrounds; a slightly roomier line height often does more for a long
          example than another color.
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
