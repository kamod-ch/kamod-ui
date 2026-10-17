## Code theme tokens

**Let the application palette give source its own voice.** Set `syntaxTheme="theme"` to derive syntax colors from the semantic tokens already supplied by your theme. The preview above starts with Ocean, but its controls can compare **all eight application presets** in both appearances. Its selection is local: it does not change the navigation, your saved preferences or another reader.

```tsx
import { Code } from "@kamod-ch/ui/code";

export function ProductSource({ source }: { source: string }) {
  return <Code code={source} language="tsx" syntaxTheme="theme" />;
}
```

This is an **opt-in syntax palette**, not a second theme manager. The default remains `syntaxTheme="default"`. There is no theme download, new provider or per-reader storage subscription. A preset change updates inherited CSS variables; Prism's existing token elements keep their identities. The reader's frame and controls continue using the same application roles as before.

### Map application roles to syntax roles

The palette uses the primary accent for declarations and the chart family for related syntax distinctions. Chart tokens are useful here because a complete Kamod theme already defines several coordinated hues. They are **inputs to the syntax palette**, not a claim that functions are charts or that every brand color is suitable for small text on its own.

| Source group              | Application input        | What the resulting color helps identify              |
| ------------------------- | ------------------------ | ---------------------------------------------------- |
| `--kamod-code-keyword`    | `--primary`              | Declarations, imports and control flow.              |
| `--kamod-code-function`   | `--chart-1`              | Functions and class names.                           |
| `--kamod-code-string`     | `--chart-2`              | Strings, selectors and attribute names.              |
| `--kamod-code-property`   | `--chart-3`              | Properties, tags, constants and deleted tokens.      |
| `--kamod-code-number`     | `--chart-4`              | Numbers and booleans.                                |
| `--kamod-code-variable`   | `--chart-5`              | Variables, regular expressions and important tokens. |
| `--kamod-code-comment`    | `--muted-foreground`     | Comments and document declarations.                  |
| Punctuation and operators | Existing reader defaults | Delimiters and operators remain visually quieter.    |

Each chart lookup falls back to `--primary` when that chart variable is missing. A minimal theme therefore produces a coordinated accent rather than an invalid color. It still needs valid `--primary`, `--foreground` and `--muted-foreground` values. Use the [Full Theme Foundation](/docs/theming/css-setup#choose-a-theme-entry) for the complete role contract, or define the required inputs yourself.

### Mix for small text, not just brand recognition

**A vivid swatch is not automatically a readable glyph.** The palette blends 30% of each hue with 70% of the current foreground in the `oklab` color space. This keeps a recognizable relationship to the brand while moving thin source text toward the application's readable ink. The comment group instead mixes 40% muted foreground with 60% foreground, so comments remain secondary without fading as far as a large caption might.

```css
/* The keyword rule used by syntaxTheme="theme". */
:where(.kamod-code[data-syntax-theme="theme"]) {
  --kamod-code-keyword: color-mix(in oklab, var(--primary) 30%, var(--foreground));
  --kamod-code-string: color-mix(in oklab, var(--chart-2, var(--primary)) 30%, var(--foreground));
  --kamod-code-comment: color-mix(in oklab, var(--muted-foreground) 40%, var(--foreground));
}
```

These percentages are **color weights**, not opacity. A 30% hue mix does not make the code 30% visible and does not reveal a background through the letters. Its other 70% comes from foreground ink. In light mode that generally pulls bright colors toward darker text; in dark mode it pulls them toward lighter text. The actual result depends on the selected theme's endpoints.

Keep that distinction when tuning a custom palette: lowering an element's `opacity` would also fade its text, decorations and descendants. Changing a syntax variable affects only the assigned token group. If your product uses a colored or translucent code surface, verify the **final composited background** rather than assuming the mix guarantees contrast on every surface.

### Follow the nearest theme boundary

The reader uses **inherited tokens from its closest scope**. A page-wide preset, a nested preview or a dashboard with its own palette can each supply them. The complete theme stylesheet establishes scoped defaults on `data-theme-scope`; the preset attribute supplies the brand, and the local `light` or `dark` class selects its appearance.

```tsx
import { Code } from "@kamod-ch/ui/code";

export function LocalPalette({ source }: { source: string }) {
  return (
    <section data-theme-scope="" data-theme="watson" class="dark">
      <Code code={source} language="typescript" syntaxTheme="theme" />
    </section>
  );
}
```

Load the full theme foundation once before using this boundary. This example owns a local appearance; it does not toggle the document root. Put the boundary on a **wrapper around Code** so its variables are inherited by the reader. If a surrounding overlay uses a portal, place the intended theme boundary where that portal renders too. See [Theme Scope and Inheritance](/docs/theming/token-overrides#follow-inheritance-and-the-cascade) for the general rules.

Because the palette reads the current roles, it works with **Kamod, shadcn, Ocean, Sunset, Cursor warm, Voltage, Watson and Professional** without eight separate syntax implementations. It also follows custom presets that supply the same semantic contract. Selecting a different application theme does not change the Code `language`, its source or the meaning of its token groups.

## Code product palette

**Start with the token palette, then refine the distinctions your source actually needs.** This gives a product its own code coloring without maintaining a parallel copy of every theme. Use a class to keep exceptions local, and leave unmodified groups connected to the application palette.

### Build a small brand recipe

Suppose an API guide needs declarations to feel slightly more prominent and strings to keep a calmer hue. Give that reader a class, retain the semantic palette and override just those roles. The values below are an example recipe; compare them with real snippets before adopting them for your own backgrounds.

```tsx
import { Code } from "@kamod-ch/ui/code";

export function ApiSource({ source }: { source: string }) {
  return <Code code={source} language="typescript" syntaxTheme="theme" class="api-source" />;
}
```

```css
/* Load this after your shared theme and Code styles. */
.api-source {
  --kamod-code-keyword: color-mix(in oklab, var(--primary) 35%, var(--foreground));
  --kamod-code-string: color-mix(in oklab, var(--chart-2, var(--primary)) 25%, var(--foreground));
  --kamod-code-keyword-weight: 600;
  --kamod-code-comment-style: italic;
}
```

This recipe follows both appearances through the same foreground token; no `dark` selector is needed. Use a separate light/dark override only when the intended color relationship genuinely changes. Prefer a **scoped semantic input** when the whole product area should change, and a **Code variable** when only source presentation should change. Avoid changing `--primary` globally just to adjust a keyword.

### Give a product theme a stable contract

A named application preset defines the values; Code consumes their roles. Keep custom values near the rest of that preset rather than embedding brand names in the component. The compact example below shows the relevant inputs, not a complete replacement for every theme token.

```css
/* Extend the installed theme; keep its other semantic roles. */
[data-theme-scope][data-theme="studio"] {
  --primary: oklch(0.48 0.16 275);
  --chart-1: oklch(0.48 0.14 280);
  --chart-2: oklch(0.46 0.1 175);
  --chart-3: oklch(0.48 0.12 335);
  --chart-4: oklch(0.48 0.1 70);
  --chart-5: oklch(0.48 0.13 235);
}

[data-theme-scope][data-theme="studio"].dark {
  --primary: oklch(0.78 0.12 275);
  --chart-1: oklch(0.78 0.1 280);
  --chart-2: oklch(0.78 0.09 175);
  --chart-3: oklch(0.78 0.1 335);
  --chart-4: oklch(0.78 0.1 70);
  --chart-5: oklch(0.78 0.1 235);
}
```

Use `data-theme="studio"` on the wrapper from the previous example to activate these CSS values. This **CSS-only custom name is not automatically registered** with `ThemePresetId`, the theme picker or a persistence API that accepts only the built-in IDs. Register application-level choices in your own model when you need them. The Code API still receives the supported `syntaxTheme="theme"`; it does not need a new syntax ID for every product brand.

### Keep a palette maintainable

Review a change with a short, representative sample: one import, an ordinary function, a property, a string, a number, a boolean and a comment. Add JSX, CSS or Markdown when those are real parts of the product. Check plain source as well as highlighted source: punctuation and unclassified text need readable ink too. A successful theme preserves the **structure of the example** before showcasing its colors.

Use **weight or italics sparingly**. Heavier keywords can help scanning, but making every group bold removes hierarchy and may change the apparent density of a long example. Keep links and dashed reference cues distinguishable without overriding Prism's text colors. The [Reference Layer](/docs/code/installation#source-links) adds navigation separately from syntax classification.

If you need a fixed dark or light editor palette rather than a brand-aware one, use a [Bundled Prism Palette](#code-prism-palettes) or follow the [Stylesheet Porting Guide](#code-prism-stylesheet-ports). If you need a different header, spacing or line treatment, continue with [Typography](#code-code-typography) and [Composition](/docs/code/installation#customization). These choices can be combined, but each should have one clear owner.
