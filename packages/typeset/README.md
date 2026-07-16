# @kamod-ch/typeset

Kamod Typeset is a framework-independent CSS foundation for rich HTML and rendered Markdown. It styles content inside `.typeset` only and uses Kamod semantic theme tokens with fallbacks.

```css
@import "tailwindcss";
@import "@kamod-ch/typeset/typeset.css";
```

```html
<article class="typeset typeset-reading">
  <h1>Article</h1>
  <p>Plain HTML or rendered Markdown.</p>
</article>
```

## Presets

- `typeset` default
- `typeset-docs`
- `typeset-reading`
- `typeset-chat`
- `typeset-compact`
- `typeset-large`

Preset metadata and the CSS generator are exported from `@kamod-ch/typeset/presets` and `@kamod-ch/typeset/generator`.

## Opt out

Use `.not-typeset` or `[data-not-typeset]` on embedded components that should not receive content styles.
