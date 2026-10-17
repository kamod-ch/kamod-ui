# Saved Prism theme sources

These files are local, unmodified snapshots from the official Prism repositories.
They are loaded as text, never imported as global CSS or fetched at runtime. The
`.css.txt` suffix prevents documentation tooling from formatting or globally
applying the original stylesheets. `SOURCES.json` records each file's original
repository, immutable revision, path, byte length and SHA-256 digest.

- Prism core: [PrismJS/prism v1.30.0](https://github.com/PrismJS/prism/tree/v1.30.0/themes).
  Eight themes; MIT, Copyright (c) 2012 Lea Verou.
  See `LICENSE.prism.txt`.
- Prism community: [PrismJS/prism-themes at 447479fc7b2be2051fe27e561aceed7cc87a589f](https://github.com/PrismJS/prism-themes/tree/447479fc7b2be2051fe27e561aceed7cc87a589f/themes).
  Sixteen themes; MIT, Copyright (c) 2015 PrismJS.
  See `LICENSE.prism-themes.txt`. The saved upstream README records theme authors
  and ports; original theme headers remain intact. Night Owl also retains its
  source's MIT notice, Copyright (c) 2018 Sarah Drasner.

`prism-theme-catalog.ts` records theme-specific authors, exact source and license
links, usage notes, and the distinction between these original palettes and
Kamod's existing contrast-adjusted syntax adaptations.

## Documentation adapter

`prism-theme-sources.ts` derives a scoped color adapter from each saved file.
Every selector stays below its own `[data-prism-theme="…"]` boundary. Original
source colors, token rules, language-specific exceptions, selection paint, text
shadows, font emphasis and self-contained background patterns are preserved.
Source media and support conditions remain conditional. Synthwave '84 retains
its actual gradient canvas; the adapter does not invent a solid replacement.

Kamod Code continues to own layout, font family and scale, spacing, borders,
scrolling and controls. Upstream plugin chrome and layout rules are omitted from
the adapter. No external resource URLs are emitted. Original complete source
files remain available through their pinned links. Each downloadable scoped
adapter includes the applicable full MIT license and original source header.

These are original upstream theme designs, not a claim of universal contrast
compliance. The reader's contrast hints compare supported literal sRGB colors;
they do not certify gradients, nested backgrounds, text effects or every Prism
grammar token.
