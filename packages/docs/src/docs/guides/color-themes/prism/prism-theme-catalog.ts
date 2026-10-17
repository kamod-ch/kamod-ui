import type { CodeSyntaxTheme } from "@kamod-ch/ui/code";
import {
  type PrismColorToken,
  prismLicenseNotices,
  prismSourceColors,
  prismSourceCss,
  prismSourceRepositories,
  scopedPrismCss,
} from "./prism-theme-sources";

export type { PrismColorToken } from "./prism-theme-sources";
export {
  PRISM_COMMUNITY_REVISION,
  PRISM_CORE_REVISION,
  PRISM_CORE_VERSION,
  prismLicenseNotices,
  prismSourceRepositories,
} from "./prism-theme-sources";

export type PrismThemeDefinition = {
  id: string;
  label: string;
  canvas: "light" | "dark";
  mode: "light" | "dark";
  origin: "Prism core" | "Prism community";
  author: string;
  direction: string;
  usage: string;
  notes: readonly { title: string; text: string }[];
  sourceUrl: string;
  licenseUrl: string;
  license: "MIT";
  source: {
    repository: string;
    revision: string;
    path: string;
    url: string;
    licenseUrl: string;
    snapshot: string;
  };
  scope: string;
  sourceCss: string;
  css: string;
  colors: PrismColorToken[];
  /** Existing Code offers a readable adaptation, not this exact upstream CSS. */
  builtIn?: CodeSyntaxTheme;
  builtInNotes?: string;
};

type Entry = {
  id: string;
  label: string;
  canvas: "light" | "dark";
  collection: "core" | "community";
  file?: string;
  author: string;
  direction: string;
  usage: string;
  notes: readonly [readonly [string, string], readonly [string, string]];
  builtIn?: CodeSyntaxTheme;
};

const entries: readonly Entry[] = [
  {
    id: "default",
    label: "Prism Default",
    canvas: "light",
    collection: "core",
    file: "prism.css",
    author: "Lea Verou; inspired by dabblet",
    direction: "A warm, light canvas with the familiar original Prism vocabulary.",
    usage:
      "Start here when comparing another palette. Green strings, blue keywords and warm operators make a useful visual reference without changing the surrounding application theme.",
    notes: [
      [
        "A reference, not the app default",
        "This is Prism's original CSS palette. Kamod Code's default palette is separate and follows the application's appearance; the two default names do not imply identical colors.",
      ],
      [
        "Keep quiet syntax visible",
        "The original gray comments and warm operators are intentionally softer than plain source. Review them at the source size and display brightness your readers will actually use.",
      ],
    ],
  },
  {
    id: "coy",
    label: "Coy",
    canvas: "light",
    collection: "core",
    author: "Tim Shedor; based on his Workshop theme",
    direction: "Paper-like source, vivid red and green tokens, and a cooler blue keyword.",
    usage:
      "Try Coy beside longer prose where a bright reading surface feels natural. Its direct token colors distinguish literals and language structure with little extra decoration.",
    notes: [
      [
        "Source character, shared layout",
        "The upstream file also includes a blue edge, paper shadows and line-number plugin layout. This gallery preserves its source paint while Kamod owns spacing, borders, fonts and controls.",
      ],
      [
        "Watch warm operators",
        "The original brown operators and gray comments are quieter than red properties or blue keywords. Compare a real expression as well as a row of isolated color samples.",
      ],
    ],
  },
  {
    id: "dark",
    label: "Prism Dark",
    canvas: "dark",
    collection: "core",
    author: "Lea Verou; based on her Reg(exp)²lained slides",
    direction: "A warm brown-dark canvas with pale source and restrained pastel syntax.",
    usage:
      "Compare this older Prism palette with a modern charcoal theme. Its warm base makes the entire reading surface part of the design rather than treating darkness as neutral black.",
    notes: [
      [
        "Warmth is structural",
        "The background is a warm HSL color. Keep it with its source foreground and token colors rather than placing the same tokens on an unrelated dark application surface.",
      ],
      [
        "Original presentation",
        "Upstream text-shadow and token emphasis are retained as paint. The source file's font and layout choices remain available in the archived CSS, not imposed on the shared reader.",
      ],
    ],
  },
  {
    id: "funky",
    label: "Funky",
    canvas: "dark",
    collection: "core",
    author: "Lea Verou; based on her Polyfilling the Gaps slides",
    direction: "Black source, bright accents and an intentionally expressive presentation.",
    usage:
      "Use this as a presentation-oriented contrast to quieter reading palettes. Check a complete snippet before choosing it for long documentation or dense source browsing.",
    notes: [
      [
        "Expressive by design",
        "Funky keeps the upstream bright token colors and text-shadow. Its in-file SVG background is self-contained; the preview does not contact an image host.",
      ],
      [
        "A distinct source surface",
        "The upstream code background is black even when its enclosing pre has a pattern. Canvas in the reference describes the surface directly behind source text.",
      ],
    ],
  },
  {
    id: "okaidia",
    label: "Okaidia",
    canvas: "dark",
    collection: "core",
    author: "ocodia; loosely based on Monokai",
    direction: "An olive-charcoal canvas with pink, lime, violet and cyan syntax.",
    usage:
      "Try a mixed TSX or CSS snippet to see its sharp separation between strings, numbers, properties and keywords. The palette remains fixed when the application appearance changes.",
    notes: [
      [
        "Pairs have different jobs",
        "Lime strings, violet numbers and cyan keywords form separate visual groups. Tags, attributes and variables still follow the exact upstream selectors rather than one broad category color.",
      ],
      [
        "Original versus bundled",
        "Kamod's built-in Okaidia adaptation adjusts selected colors for small source text. This reference displays the original pinned Prism source, so some swatches deliberately differ.",
      ],
    ],
    builtIn: "okaidia",
  },
  {
    id: "solarized-light",
    label: "Solarized Light",
    canvas: "light",
    collection: "core",
    file: "prism-solarizedlight.css",
    author: "Ethan Schoonover; Prism port by Hector Matos",
    direction: "A warm cream canvas, blue-gray source and the Solarized accent family.",
    usage:
      "Compare it against a white palette when your documentation needs a softer source surface. Treat the background and muted base tones as a single system.",
    notes: [
      [
        "A complete light palette",
        "Solarized uses a deliberate warm background and cooler base ink. Copy the scoped palette together rather than borrowing a single accent for an arbitrary canvas.",
      ],
      [
        "Keep the original distinction",
        "This preview uses Prism's original Solarized Light values. Kamod also ships a contrast-adjusted adaptation under solarized-light; that API identity does not make the two color sets identical.",
      ],
    ],
    builtIn: "solarized-light",
  },
  {
    id: "tomorrow",
    label: "Tomorrow Night Eighties",
    canvas: "dark",
    collection: "core",
    author: "Rose Pritchard; based on Chris Kempson's Tomorrow Night Eighties",
    direction: "Neutral charcoal, light source and a balanced warm/cool accent set.",
    usage:
      "Use it as a restrained dark comparison for component examples. Review HTML tags, class names and function names as well as the main keyword and string colors.",
    notes: [
      [
        "More than the main groups",
        "The upstream palette gives tags and attributes a warm red, class names a yellow and function-name tokens their own blue. The preview retains those selector-specific details.",
      ],
      [
        "Adaptation is explicit",
        "The bundled tomorrow option is a Kamod adaptation. The gallery's archived CSS and swatches describe the pinned upstream theme, with no silent contrast adjustments.",
      ],
    ],
    builtIn: "tomorrow",
  },
  {
    id: "twilight",
    label: "Twilight",
    canvas: "dark",
    collection: "core",
    author: "Remy Bach; based on TextMate's Twilight",
    direction:
      "Near-black source with muted green strings, warm numbers and pale yellow structure.",
    usage:
      "Compare it with a brighter dark palette when source needs less saturation. Keep comments and low-emphasis tokens in the review rather than judging only the vivid samples.",
    notes: [
      [
        "Quiet does not mean one color",
        "Twilight separates tags, strings, numbers and at-rules through small hue changes. These relationships are easier to evaluate in a complete snippet than in isolated swatches.",
      ],
      [
        "Read at the intended size",
        "The original palette includes deliberately subdued comments. The existing Code twilight option uses a readable adaptation; this gallery keeps the original source values.",
      ],
    ],
    builtIn: "twilight",
  },
  {
    id: "dracula",
    label: "Dracula",
    canvas: "dark",
    collection: "community",
    author: "Zeno Rocha; Prism port by Albert Vallverdu",
    direction:
      "Purple-charcoal source with cyan keywords, pink properties and bright green/yellow details.",
    usage:
      "Try it for code-heavy examples where distinct token families should remain easy to spot. Compare real nested markup with the bare token swatches before choosing it.",
    notes: [
      [
        "A recognizable palette",
        "The familiar Dracula colors belong together with their charcoal canvas. Applying the accents to the application's general background would change the reading contrast.",
      ],
      [
        "Token roles stay precise",
        "Functions, keywords, attributes and punctuation use the source theme's selectors. Representative samples describe one token each; language overrides remain in the complete scoped CSS.",
      ],
    ],
  },
  {
    id: "nord",
    label: "Nord",
    canvas: "dark",
    collection: "community",
    author: "Arctic Ice Studio; Prism ports by Zane Hitchcox and Gabriel Ramos",
    direction: "Blue-gray polar tones with restrained cyan, green and warm accent notes.",
    usage:
      "Compare it with a neutral charcoal theme for a calmer source region. Keep enough surrounding separation that the cool canvas remains distinguishable from the page.",
    notes: [
      [
        "Cool rather than neutral",
        "Nord's canvas and plain text both carry a cool hue. The source surface is independent from an application preset, even when the page happens to use similar blues.",
      ],
      [
        "Comments need a real reading check",
        "The original comment tone is intentionally subdued. A calm palette still needs review at the actual text size, with selection and muted syntax included.",
      ],
    ],
  },
  {
    id: "night-owl",
    label: "Night Owl",
    canvas: "dark",
    collection: "community",
    author: "Sarah Drasner; Prism port by Sara Vieira, added by Souvik Mandal",
    direction: "Deep midnight blue with pale source, violet structure and warm string accents.",
    usage:
      "Use it to compare a blue-black reading surface with the flatter grays of One Dark or VS Code Dark+. Keep all source colors local to the reader.",
    notes: [
      [
        "Preserve the midnight canvas",
        "The dark blue surface contributes to Night Owl's identity. Moving only the token colors to another canvas would no longer reproduce this pinned source palette.",
      ],
      [
        "Keep the original credit",
        "The source retains Sarah Drasner's 2018 copyright and the port credits. Downloaded scoped CSS includes those notices alongside the collection's MIT license.",
      ],
    ],
  },
  {
    id: "one-dark",
    label: "One Dark",
    canvas: "dark",
    collection: "community",
    author: "Atom's One Dark authors; Prism port by Hoon Wei Ting",
    direction: "Cool charcoal with balanced green, blue, orange and violet syntax.",
    usage:
      "Compare it with One Light using the same language sample. The pair shares a design family, while the canvas, source ink and individual token values change deliberately.",
    notes: [
      [
        "Context matters",
        "The original file includes detailed CSS, JavaScript, JSON and markup overrides. A generic keyword or property swatch does not replace those language-specific rules.",
      ],
      [
        "Shared reader, original paint",
        "The gallery retains source colors and token emphasis while leaving fonts, layout and plugin controls to Code. The archived original includes the upstream plugin styling too.",
      ],
    ],
  },
  {
    id: "one-light",
    label: "One Light",
    canvas: "light",
    collection: "community",
    author: "Atom's One Light authors; Prism port by Hoon Wei Ting",
    direction: "A light neutral canvas with clear warm literals and cool language structure.",
    usage:
      "Read the same TSX, CSS and JSON samples beside One Dark. This is a separate authored palette rather than an automatic inversion of its dark counterpart.",
    notes: [
      [
        "A related light system",
        "One Light uses its own canvas and source values. The shared family is useful for comparison, but the light and dark files remain separate pinned sources.",
      ],
      [
        "Representative versus contextual",
        "Bare token swatches show a base color. The scoped stylesheet retains the source's more specific grammar selectors for nested tokens and language exceptions.",
      ],
    ],
  },
  {
    id: "ghcolors",
    label: "GHColors",
    canvas: "light",
    collection: "community",
    author: "Avi Aryan; inspired by GitHub syntax coloring",
    direction: "A clean white source surface with blue, red and green accents.",
    usage:
      "Try it in a prose-first guide where a familiar light source region should remain visually quiet. Its name describes this community Prism theme, not a live GitHub stylesheet.",
    notes: [
      [
        "A historical interpretation",
        "GHColors is the pinned community theme inspired by GitHub. It is not a claim to match every current GitHub product or appearance.",
      ],
      [
        "Inspect the quieter tokens",
        "A white background makes low-emphasis gray tokens visible as a separate design choice. Review comments, punctuation and selection alongside the stronger accent colors.",
      ],
    ],
  },
  {
    id: "vsc-dark-plus",
    label: "VS Code Dark+",
    canvas: "dark",
    collection: "community",
    author: "Tim Buckner; inspired by VS Code Dark+",
    direction: "Neutral dark gray with familiar blue, orange, green and yellow syntax cues.",
    usage:
      "Use it as an editor-like comparison for configuration and component snippets. This is a Prism port, so visible token grouping follows Prism's grammar rather than an editor's semantic tokens.",
    notes: [
      [
        "Grammar affects the result",
        "Prism and VS Code do not assign every identifier to identical token types. This reference preserves the port's CSS rather than promising a pixel-identical editor screenshot.",
      ],
      [
        "Keep source local",
        "The source canvas and accents stay fixed inside this reader. No VS Code extension, remote stylesheet or application-theme switch is required.",
      ],
    ],
  },
  {
    id: "material-dark",
    label: "Material Dark",
    canvas: "dark",
    collection: "community",
    author: "Oleg Dutchenko",
    direction: "A dark gray canvas with bright Material-style violet, cyan and warm highlights.",
    usage:
      "Compare it with Material Oceanic to isolate the effect of the source background. Include attributes, strings and property names in a real sample rather than relying only on keywords.",
    notes: [
      [
        "A neutral Material base",
        "This variant uses a gray reading surface. The exact upstream colors remain separate from the application's own Material-inspired or semantic theme tokens.",
      ],
      [
        "Color is not the grammar",
        "The palette supplies CSS for Prism token classes. It does not decide which source spans are numbers, methods, tags or properties; the active language grammar does.",
      ],
    ],
  },
  {
    id: "material-light",
    label: "Material Light",
    canvas: "light",
    collection: "community",
    author: "Oleg Dutchenko",
    direction: "A bright Material-style canvas with violet structure and green/cyan accents.",
    usage:
      "Compare this authored light palette with Material Dark on the same snippet. Keep the background with its text colors when copying the local CSS.",
    notes: [
      [
        "An authored light variant",
        "Material Light has explicit source and token values. It is not generated by flipping brightness or inverting another theme's colors.",
      ],
      [
        "Review full expressions",
        "Adjacent strings, operators, punctuation and keywords create the reading hierarchy. A single attractive accent is not enough to choose a source palette.",
      ],
    ],
  },
  {
    id: "material-oceanic",
    label: "Material Oceanic",
    canvas: "dark",
    collection: "community",
    author: "Oleg Dutchenko",
    direction: "A blue-green dark canvas with the Material accent vocabulary.",
    usage:
      "Compare its cool surface with Material Dark's gray one. The difference is useful when a page already contains colored panels and you need a source region with its own identity.",
    notes: [
      [
        "Canvas makes a difference",
        "The oceanic surface is part of the authored palette. Reusing its token colors on an arbitrary background would change the result shown here.",
      ],
      [
        "Keep UI chrome separate",
        "Toolbar buttons and surrounding descriptions continue to use the page's readable theme. The upstream syntax paint is restricted to source content.",
      ],
    ],
  },
  {
    id: "synthwave84",
    label: "Synthwave ’84",
    canvas: "dark",
    collection: "community",
    author: "Robb Owen; Prism port by Marc Backes",
    direction: "Deep purple source with neon pink, cyan and yellow accents and a visible glow.",
    usage:
      "Try it for a more expressive source treatment, then compare the same code with a restrained theme. Check whether the glow helps your content at the intended density.",
    notes: [
      [
        "Glow is part of the source",
        "The upstream token text-shadows are retained. They are static paint, not an animation, and the preview adds no timer or looping effect.",
      ],
      [
        "Exact rather than certified",
        "Bright accents can look strong while quieter tokens or glow remain hard to read. This gallery shows the original palette and does not claim every token meets a contrast target.",
      ],
    ],
  },
  {
    id: "gruvbox-dark",
    label: "Gruvbox Dark",
    canvas: "dark",
    collection: "community",
    author: "morhetz's Gruvbox; Prism adaptation by Azat S.",
    direction: "A warm dark surface with earthy yellow, green, orange and aqua syntax.",
    usage:
      "Compare it against cooler dark palettes when a warm page or long reading session calls for a different source atmosphere. Keep comments and nested tokens in the review.",
    notes: [
      [
        "Warm relationships",
        "The background, pale source and earthy accents create the Gruvbox direction together. Avoid treating the accent set as interchangeable with a neutral editor canvas.",
      ],
      [
        "Companion, not inversion",
        "Gruvbox Light is listed separately with its own source file and author credit. Switching between the pair changes an authored palette rather than an inversion filter.",
      ],
    ],
  },
  {
    id: "gruvbox-light",
    label: "Gruvbox Light",
    canvas: "light",
    collection: "community",
    author: "morhetz's Gruvbox; Prism adaptation by Michael Schnerring",
    direction: "Warm cream source with earthy dark accents and brown-gray supporting syntax.",
    usage:
      "Read it beside Gruvbox Dark with the same source language. The warm canvas makes a useful comparison to the white surfaces of GHColors and One Light.",
    notes: [
      [
        "Cream is deliberate",
        "The light canvas is part of this palette's identity. Keep its foreground and comment colors with it when copying the scoped stylesheet.",
      ],
      [
        "Trace the adaptation",
        "This port is based on Gruvbox and the community dark adaptation. The preserved file header and pinned source link retain that chain of credit.",
      ],
    ],
  },
  {
    id: "a11y-dark",
    label: "a11y Dark",
    canvas: "dark",
    collection: "community",
    author: "Eric W. Bailey; based on Okaidia",
    direction: "A dark source palette with deliberately clear, separated token accents.",
    usage:
      "Include it when comparing readability-focused palettes, then check your actual grammar, font size, selection and display. The name does not replace a contrast review of the rendered result.",
    notes: [
      [
        "Intent, not a blanket guarantee",
        "The theme's upstream accessibility intent is preserved along with its name. This gallery does not certify every token, language override or future combination against a contrast standard.",
      ],
      [
        "Keep the pairings intact",
        "The source canvas and foreground form the baseline. A token's readability depends on that background and its actual rendering, not on its hexadecimal value alone.",
      ],
    ],
  },
  {
    id: "duotone-light",
    label: "Duotone Light",
    canvas: "light",
    collection: "community",
    author: "Simurai; Prism conversion by Bram de Haan",
    direction: "A light two-family palette that groups syntax through restrained hue variation.",
    usage:
      "Compare it with a more colorful light theme when you want fewer competing syntax hues. Check that the quieter groups remain useful at the density of your examples.",
    notes: [
      [
        "Fewer hue families",
        "Duotone's small set of related accents creates hierarchy through tone as well as hue. Some roles intentionally share a color rather than receiving a unique accent.",
      ],
      [
        "Preserve the conversion credit",
        "The source records Simurai's Atom theme direction and Bram de Haan's Base2Tone conversion. Those credits remain alongside the pinned collection source and MIT license.",
      ],
    ],
  },
  {
    id: "atom-dark",
    label: "Atom Dark",
    canvas: "dark",
    collection: "community",
    author: "Joe Gibson; based on Atom's Atom Dark syntax theme",
    direction: "Near-black source with a familiar muted editor palette and warm/cool accents.",
    usage:
      "Compare it with One Dark to see two different Atom-inspired directions. Read a complete function and nested markup before choosing it for dense technical guides.",
    notes: [
      [
        "Two Atom families",
        "Atom Dark and One Dark are separate source palettes with different histories. Similar names do not make their foregrounds or token colors interchangeable.",
      ],
      [
        "Keep quiet source readable",
        "The original comment and punctuation colors stay unchanged. Review them at the final source size rather than brightening them silently in the gallery.",
      ],
    ],
  },
];

export const prismThemeId = (id: string) => `prism-theme-${id}`;

/** Checked-in upstream snapshots; constructing this catalog never fetches a stylesheet. */
export const prismThemes: readonly PrismThemeDefinition[] = entries.map((entry) => {
  const repository = prismSourceRepositories[entry.collection];
  const file = entry.file ?? `prism-${entry.id}.css`;
  const path = `themes/${file}`;
  const sourceUrl = `https://github.com/${repository.repository}/blob/${repository.revision}/${path}`;
  const sourceCss = prismSourceCss(file);
  return {
    id: entry.id,
    label: entry.label,
    canvas: entry.canvas,
    mode: entry.canvas,
    origin: entry.collection === "core" ? "Prism core" : "Prism community",
    author: entry.author,
    direction: entry.direction,
    usage: entry.usage,
    notes: entry.notes.map(([title, text]) => ({ title, text })),
    sourceUrl,
    licenseUrl: repository.licenseUrl,
    license: "MIT",
    source: {
      repository: repository.repository,
      revision: repository.revision,
      path,
      url: sourceUrl,
      licenseUrl: repository.licenseUrl,
      snapshot: `vendor/${file}.txt`,
    },
    scope: `[data-prism-theme="${entry.id}"]`,
    sourceCss,
    css: scopedPrismCss(
      entry.id,
      entry.label,
      sourceCss,
      sourceUrl,
      prismLicenseNotices[entry.collection],
    ),
    colors: prismSourceColors(sourceCss),
    builtIn: entry.builtIn,
    builtInNotes: entry.builtIn
      ? `Code syntaxTheme="${entry.builtIn}" is a bundled contrast-adjusted adaptation. The gallery previews the original upstream CSS instead.`
      : undefined,
  };
});
