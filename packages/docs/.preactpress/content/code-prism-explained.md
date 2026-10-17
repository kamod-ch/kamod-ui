## Code Prism pipeline

**Prism recognizes source; CSS gives the recognized pieces their appearance.** These are independent stages. A TypeScript grammar identifies a declaration, string or punctuation. The selected syntax palette decides how those groups are painted. Your application theme supplies the surrounding surfaces and controls.

Kamod's `Code` keeps those responsibilities separated. It receives a literal source string, resolves a supported language, loads the shared highlighting implementation when needed, and presents highlighted markup. It preserves the original string for Copy even when the displayed imports are folded or the source wraps.

### Follow one line through the reader

```typescript
const message = "Hello";
```

A simplified highlighted result looks like this:

```html
<span class="token keyword">const</span> message <span class="token operator">=</span>
<span class="token string">"Hello"</span><span class="token punctuation">;</span>
```

The classes describe recognized groups. They are not color names, and their existence does not mean a stylesheet has been loaded. A palette can paint `.token.keyword` violet, cyan or a theme-derived tint without changing this markup. Unclassified text inherits the source foreground.

The viewer may add its own safe links and line markup around these tokens. That presentation is still separate from the string copied to the clipboard. A navigation link in displayed code does not insert an HTML anchor into the copied source.

### Know when each stage runs

| Change               | Work that changes                                     | Work that stays reusable                             |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Source string        | Language inference and highlighted source may change. | The surrounding reader composition.                  |
| Language             | The grammar and resulting token classes may change.   | The original string.                                 |
| `syntaxTheme`        | A root attribute and CSS colors.                      | Highlighted token nodes, grammar and clipboard text. |
| App preset or scheme | Inherited semantic values; app-aware syntax colors.   | Recognized source and reader state.                  |
| Import folding       | Which complete import lines are shown.                | Full source and highlighted content.                 |
| Wrapping             | Line layout and native overflow.                      | Source characters and syntax classification.         |

Built-in palettes are shipped with the reader stylesheet. Selecting one is **not a network request for a theme**, and it does not import a second Prism instance. A source grammar can be deferred independently; plain text or `highlight={false}` has no colored token markup to restyle.

Prism's [manual highlighting API](https://prismjs.com/docs/prism#highlight) describes the underlying string-to-markup operation. Kamod owns the reader lifecycle around it. Avoid calling `Prism.highlightAll()` after rendering `Code`: it does not know about the viewer's references, folded source, pending work or ownership of the DOM.

### Keep source display distinct from execution

Neither choosing a grammar nor a palette runs the sample. Syntax highlighting is not validation, formatting, typechecking or a security review. A string containing a broken import can still receive sensible colors. A grammar can also classify an unfamiliar construct differently from what you expected.

For a language mismatch, use [Language Selection](#language-detection). For unsafe external HTML, follow [Safe Content Boundaries](#code-safe-content). Changing a keyword color cannot solve either problem.

## Code syntax token groups

**Style the groups your grammar actually emits.** A JavaScript string, a JSX attribute value and a CSS selector can take different paths through Prism, even when a palette intentionally gives them related colors. Inspect a highlighted element in browser tools rather than assuming its class from the word's appearance.

### Map Prism groups to Kamod variables

| Reader variable            | Common recognized groups                                         | What to verify                                                            |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `--kamod-code-keyword`     | `keyword`, `atrule`, `attr-value`                                | Declarations, at-rules and JSX values in your actual languages.           |
| `--kamod-code-string`      | `string`, `char`, `selector`, `attr-name`, `builtin`, `inserted` | Quoted text, CSS selectors, attributes and diff additions.                |
| `--kamod-code-function`    | `function`, `class-name`                                         | Function calls and class/type-like identifiers recognized by the grammar. |
| `--kamod-code-property`    | `property`, `tag`, `constant`, `symbol`, `deleted`               | Object keys, markup tags and removed diff content.                        |
| `--kamod-code-number`      | `number`, `boolean`                                              | Numeric and boolean literals.                                             |
| `--kamod-code-variable`    | `variable`, `regex`, `important`                                 | Regex literals and language-specific special emphasis.                    |
| `--kamod-code-comment`     | `comment`, `prolog`, `doctype`, `cdata`                          | Small supporting text on the actual reading surface.                      |
| `--kamod-code-punctuation` | `punctuation`                                                    | Delimiters that should remain visible without dominating.                 |
| `--kamod-code-operator`    | `operator`, `entity`, `url`; some CSS strings                    | Embedded languages, entities and operator symbols.                        |

These are the reader's standard mappings, not a promise that every grammar emits all groups. The bundled Prism adaptations also retain useful exceptions: Tomorrow separates tags and function-name tokens; Okaidia groups some at-rules with functions; Solarized gives URLs its string treatment. A custom rule can refine one such exception without rewriting the entire viewer.

### Preserve more than keyword color

A one-line `.token.keyword` rule is a useful experiment, but it is not a complete theme. Check ordinary unclassified text, strings, numbers, comments, punctuation, operators, selections, inserted/deleted content and long wrapped lines. A bright keyword can look excellent while the comment below it is unreadable.

```css src/source-colors.css
.product-source {
  --kamod-code-keyword: #6d28d9;
  --kamod-code-string: #0f766e;
  --kamod-code-comment: #526170;
}

.dark .product-source {
  --kamod-code-keyword: #c4b5fd;
  --kamod-code-string: #5eead4;
  --kamod-code-comment: #b5c1ce;
}
```

Put `class="product-source"` on the `Code` instance. These are illustrative starting colors for corresponding light/dark surfaces, not a universal contrast guarantee. The [Theme Tokens palette](#code-theme-tokens) is useful when you want a shared recipe instead of maintaining a second hand-authored pair.

Each standard token group also accepts `-weight` and `-style` suffixes. Use them sparingly. Grammar-specific `bold`, `important` and `italic` classes have their own emphasis; changing all code to semibold is usually less informative than preserving those distinctions.

### Keep linked identifiers readable as code

Source navigation preserves token ink. Its dashed cue communicates that a component or package can be opened; it does not replace the source's syntax color with a normal link color. Check linked imports and their usages when tuning a palette, and retain a visible keyboard focus treatment.

The private documentation tooltips provide extra reference details lazily; that catalog is not part of Prism and does not determine token classification. In an application, the generic [Source Link Resolver](#source-links) supplies navigation destinations independently of your color choices.

## Code CSS ownership

There are three boundaries to understand: **the application's semantic tokens**, **the reader root**, and **the source itself**. An override on the right boundary is easier to maintain than a long selector aimed at a token anywhere in the document.

### Read the reader's structure

```html
<div class="kamod-code" data-syntax-theme="tomorrow">
  <!-- Optional metadata and reading controls use the application theme. -->
  <pre class="docs-code"><code class="language-typescript">…</code></pre>
</div>
```

The loading path can introduce a `.kamod-code-content` container around the source. Do not rely on a fixed child index or style the second `div` as if it were a public component slot. Prefer the documented variables on the `Code` root and use the existing source/header props for composition.

`syntaxTheme` is the supported typed palette selector. The actual root attribute is `data-syntax-theme`; an unrelated `data-code-theme` attribute from a generic Prism tutorial does not select Kamod's built-in palettes. Put an application-specific class on the reader to add a custom recipe without inventing a value outside `CodeSyntaxTheme`.

### Let each instance own its overrides

```tsx
import { Code } from "@kamod-ch/ui/code";

export function ProductSource({ source }: { source: string }) {
  return <Code code={source} language="tsx" class="product-source" />;
}
```

The core defaults reset token variables at each reader boundary. An inherited variable on a distant parent can therefore lose to a value declared on the reader. A class on the actual `Code` root makes the intended scope explicit and avoids recoloring unrelated snippets.

Core defaults use low-specificity `:where(...)` selectors. A focused product class can override them without `!important`. Still inspect cascade layers and the exact selector when another stylesheet wins: later source order only breaks ties between otherwise equally ranked rules.

### Separate source paint from panel controls

| Variable                                                 | Affects                                                |
| -------------------------------------------------------- | ------------------------------------------------------ |
| `--kamod-code-surface`                                   | The reader's shared panel surface.                     |
| `--kamod-code-header`                                    | The metadata/header surface.                           |
| `--kamod-code-source-surface`                            | The source background, including a fixed Prism canvas. |
| `--kamod-code-foreground`                                | Source foreground, before more specific token colors.  |
| `--kamod-code-font-family`, `-font-size`, `-line-height` | Source typography.                                     |

A named Prism palette supplies its own source background and base foreground so its colors remain coherent. It does not recolor the page, change the selected application preset or invert the application's scheme. Do not replace that background alone and assume every pastel token will remain readable.

Custom `renderedContent` is caller-owned markup. The syntax variables style highlighted source; they do not turn arbitrary JSX into a themed Markdown renderer. Ordinary inline code and a displayed Markdown string are also different things: the former is document content, the latter can be tokenized as source.

## Code Prism stylesheet ports

**Use a bundled palette first when it fits.** Okaidia, Tomorrow, Twilight and Solarized Light are already included through the reader stylesheet, so using them requires no extra CSS package or Prism setup:

```tsx
import { Code } from "@kamod-ch/ui/code";

<Code code={'const result = "ready";'} language="typescript" syntaxTheme="tomorrow" />;
```

For more options, start with the [official Prism stylesheets](https://github.com/PrismJS/prism/tree/v1.30.0/themes) or the [Prism Themes collection](https://github.com/PrismJS/prism-themes). Read the theme's actual file and license. Names shared with an editor theme do not guarantee that every port assigns the same color to the same token.

### Understand a direct stylesheet import

A conventional **standalone Prism host** can load a stylesheet from its installed package:

```css
/* Standalone Prism markup, outside Kamod's multi-palette reader. */
@import "prismjs/themes/prism-tomorrow.css";
```

That example assumes the package is installed and your CSS pipeline resolves package imports. The stylesheet contains broad token and source rules. It is not scoped to one Kamod reader, and the theme file can also change fonts, padding, shadows or wrapping.

If you choose an additional collection, install it in the application that owns the CSS build:

```bash
pnpm add -D prism-themes
```

For example, the collection provides `prism-themes/themes/prism-dracula.css`. **Importing multiple raw theme files globally does not create a selector.** Their shared `.token` rules compete in the normal cascade. For Kamod, convert the colors into a reader class, or carefully scope a complete stylesheet before importing the result.

### Port a palette through the reader variables

The following is a compact Dracula-family adaptation, not a new built-in palette ID. The source colors come from the [Prism Themes port](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-dracula.css); the comment is strengthened for small text. Preserve its MIT license and attribution with any distributed adaptation.

```css src/code-dracula.css
/* Dracula-family adaptation of PrismJS/prism-themes (MIT). */
.source-dracula {
  --kamod-code-source-surface: #282a36;
  --kamod-code-foreground: #f8f8f2;
  --kamod-code-comment: #a5b0d3;
  --kamod-code-punctuation: #f8f8f2;
  --kamod-code-keyword: #8be9fd;
  --kamod-code-property: #ff79c6;
  --kamod-code-number: #bd93f9;
  --kamod-code-string: #50fa7b;
  --kamod-code-function: #f1fa8c;
  --kamod-code-operator: #f8f8f2;
  --kamod-code-variable: #ffb86c;
}
```

```tsx
import { Code } from "@kamod-ch/ui/code";

export function DraculaSource({ source }: { source: string }) {
  return <Code code={source} language="tsx" class="source-dracula" />;
}
```

Load that local stylesheet after the chosen foundation and reader styles. The class is enough; `syntaxTheme="dracula"` is not a supported built-in ID. Add individual grammar exceptions only when your content needs them. Keep their selectors within that reader and inspect nested token spans before increasing specificity.

The variable recipe deliberately keeps Kamod's existing token grouping. A pixel-for-pixel upstream port also needs the upstream exceptions for attribute values, variables, URLs, at-rules, selections and emphasis. Decide whether exact historical fidelity is worth that extra policy; a consistent product adaptation is often easier to read and maintain.

### Scope a complete third-party file deliberately

When a full CSS port is necessary, retain a reviewed vendor copy and its license, then scope **every selector in every selector list** to the intended reader. Handle `code`, `pre`, `.token`, `.namespace`, `::selection` and nested language selectors; prefixing only `.token.keyword` leaves the rest global.

```css src/vendor/product-prism.css
/* A small, scoped exception after the variable-based palette. */
.source-dracula > :is(.docs-code, .kamod-code-content) .token.attr-value {
  color: #f1fa8c;
}
```

Do not blindly prefix `@font-face`, `@keyframes` or `@import` as though they were ordinary selectors. Review plugin-specific rules separately, and remove layout declarations you intend Code to own. A CSS parser is safer than a search-and-replace expression when automating a real vendor port.

Pin the chosen package or revision in your normal dependency workflow. Record deliberate contrast changes and retain the [upstream license](https://github.com/PrismJS/prism-themes/blob/master/LICENSE). Updating the highlighter grammar, updating a palette and updating a CSS scoping transform are separate maintenance tasks with different things to verify.

## Code palette verification

Review a palette on **the surfaces and languages where it will actually be used**. A pleasing color wheel or a single JavaScript line cannot reveal every grouping, fallback or layout problem.

### Build a useful verification sample

Include comments, imports, linked package strings, numbers, booleans, punctuation, function calls and unclassified text. Add JSX attributes, CSS selectors/URLs, JSON properties and diff additions/removals if those languages matter to your product. Use long lines and a narrow container as well as a short example.

| Check                    | Why it matters                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Small body text contrast | Ordinary code and comments are usually normal-size text, so aim for at least 4.5:1 against the actual painted surface. |
| Text selection           | Selected source must remain readable even when browser default selection colors differ.                                |
| Plain text and loading   | Unclassified source should be readable before highlighting and when highlighting is disabled.                          |
| Source navigation        | A dashed cue and keyboard focus must remain distinguishable without changing syntax ink.                               |
| Header and controls      | A fixed dark source canvas can sit below light controls; check that deliberate boundary.                               |
| Neighboring readers      | Switching one palette should not recolor another or change its source.                                                 |
| Wrapping and copy        | Typography can change line layout; it must not change the copied string.                                               |
| Zoom and narrow screens  | Color does not compensate for clipped controls or text that cannot scroll.                                             |

### Diagnose the correct layer

If no token spans exist, check the language, `highlight` setting and highlighter readiness. If spans exist but all ink is inherited, check reader CSS loading and winning token declarations. If only one grammar group differs, inspect that group's actual class and a palette-specific exception. If the source surface is correct but the header looks wrong, inspect application tokens and header rules instead of editing Prism.

For a palette change, keep an existing highlighted node reference in a browser test and verify it is reused. Also check original text and Copy. For theme-derived colors, switch app presets and schemes, including a nested theme scope, and inspect the computed colors without expecting another grammar request.

Color is a reading aid. Users must still be able to select source, read it without syntax colors, discover links with a keyboard and copy the complete example. Keep those capabilities in the [accessibility review](#accessibility) when making the palette more expressive.
