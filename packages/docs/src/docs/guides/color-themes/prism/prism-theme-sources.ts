import coreLicense from "./vendor/LICENSE.prism.txt?raw";
import communityLicense from "./vendor/LICENSE.prism-themes.txt?raw";

export const PRISM_CORE_VERSION = "1.30.0";
export const PRISM_CORE_REVISION = "v1.30.0";
export const PRISM_COMMUNITY_REVISION = "447479fc7b2be2051fe27e561aceed7cc87a589f";
export const prismLicenseNotices = { core: coreLicense, community: communityLicense } as const;
export const prismSourceRepositories = {
  core: {
    repository: "PrismJS/prism",
    revision: PRISM_CORE_REVISION,
    url: `https://github.com/PrismJS/prism/tree/${PRISM_CORE_REVISION}/themes`,
    licenseUrl: `https://github.com/PrismJS/prism/blob/${PRISM_CORE_REVISION}/LICENSE`,
  },
  community: {
    repository: "PrismJS/prism-themes",
    revision: PRISM_COMMUNITY_REVISION,
    url: `https://github.com/PrismJS/prism-themes/tree/${PRISM_COMMUNITY_REVISION}/themes`,
    licenseUrl: `https://github.com/PrismJS/prism-themes/blob/${PRISM_COMMUNITY_REVISION}/LICENSE`,
  },
} as const;

const sourceFiles = import.meta.glob<string>("./vendor/*.css.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function prismSourceCss(file: string) {
  const source = sourceFiles[`./vendor/${file}.txt`];
  if (!source) throw new Error(`Missing checked-in Prism source: ${file}`);
  return source;
}

export type PrismColorToken = {
  id: string;
  label: string;
  value: string;
  selector: string;
  description: string;
  inherited?: boolean;
};
type Rule = { selectors: string[]; declarations: Record<string, string>; conditions: string[] };

/** Split CSS lists without splitting functional colors, selectors or quoted data URLs. */
function splitOutside(text: string, delimiter: string) {
  let quote = "";
  let depth = 0;
  let start = 0;
  const parts: string[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === delimiter && depth === 0) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

/** A bounded parser for these pinned stylesheets, not a general CSS rewriting API. */
export function prismSourceRules(source: string, conditions: string[] = []): Rule[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  let start = 0;
  let quote = "";
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char !== "{") continue;
    const selector = css.slice(start, index).trim();
    const bodyStart = index + 1;
    let depth = 1;
    for (index += 1; index < css.length && depth; index += 1) {
      const next = css[index];
      if (quote) {
        if (next === "\\") index += 1;
        else if (next === quote) quote = "";
      } else if (next === '"' || next === "'") quote = next;
      else if (next === "{") depth += 1;
      else if (next === "}") depth -= 1;
    }
    const body = css.slice(bodyStart, index - 1);
    if (/^@(?:media|supports)\b/.test(selector))
      rules.push(...prismSourceRules(body, [...conditions, selector]));
    else if (!selector.startsWith("@")) {
      const declarations: Record<string, string> = {};
      for (const declaration of splitOutside(body, ";")) {
        const colon = declaration.indexOf(":");
        if (colon > 0)
          declarations[declaration.slice(0, colon).trim()] = declaration.slice(colon + 1).trim();
      }
      rules.push({ selectors: splitOutside(selector, ","), declarations, conditions });
    }
    start = index;
    index -= 1;
  }
  return rules;
}

const withoutImportant = (value: string) => value.replace(/\s*!important\s*$/, "").trim();
const hasPlugin = (selector: string) =>
  /\.(?:code-toolbar|line-numbers|line-numbers-rows|line-highlight|command-line|prism-previewer[\w-]*|rainbow-braces|diff-highlight)\b/.test(
    selector,
  );
const specificity = (selector: string) => {
  const clean = selector.replace(/\[[^\]]*\]/g, "[");
  return (
    (clean.match(/#[\w-]+/g)?.length ?? 0) * 10000 +
    (clean.match(/\.[\w-]+|\[|:(?!:)[\w-]+/g)?.length ?? 0) * 100 +
    (clean.match(/(?:^|[\s>+~])(?:pre|code)\b/g)?.length ?? 0)
  );
};

type Paint = { value: string; selector: string; priority: number };
function choose(previous: Paint | undefined, selector: string, value: string) {
  const priority = specificity(selector) + (/!important\s*$/.test(value) ? 1000000 : 0);
  return !previous || priority >= previous.priority
    ? { value: withoutImportant(value), selector, priority }
    : previous;
}
function solidColor(value: string | undefined) {
  if (!value || /^(?:none|transparent|inherit|initial)$/.test(value)) return;
  // These pinned base declarations use one CSS color, never gradient color-stop guesses.
  if (/^(?:#[\da-f]+|[a-z]+)$/i.test(value) || /^(?:rgba?|hsla?|oklch|color)\(/.test(value))
    return value;
}

/** Representative bare token classes; language-specific exceptions remain in the scoped CSS. */
export function prismSourceColors(source: string, label = "Pinned Prism theme"): PrismColorToken[] {
  const rules = prismSourceRules(source).filter((rule) => rule.conditions.length === 0);
  let foreground: Paint | undefined;
  let codeBackground: Paint | undefined;
  let preBackground: Paint | undefined;
  for (const rule of rules)
    for (const selector of rule.selectors) {
      if (
        hasPlugin(selector) ||
        /\.token|\.[\w-]+|::|:(?:not|before|after)|\[data-/.test(selector) ||
        !/\b(?:pre|code)\b/.test(selector)
      )
        continue;
      const isCode = /\bcode(?:\b|\[)/.test(selector);
      const color = rule.declarations.color;
      if (isCode && color && color !== "inherit") foreground = choose(foreground, selector, color);
      const background =
        solidColor(rule.declarations["background-color"] ?? rule.declarations.background) ??
        rule.declarations["background-image"]?.match(
          /^(?:repeating-)?(?:linear|radial|conic)-gradient\([\s\S]+\)$/,
        )?.[0];
      if (background) {
        if (isCode) codeBackground = choose(codeBackground, selector, background);
        else preBackground = choose(preBackground, selector, background);
      }
    }
  if (!foreground || !(codeBackground ?? preBackground))
    throw new Error(`${label} is missing a source foreground or canvas.`);
  const canvas = codeBackground ?? preBackground!;
  const result: PrismColorToken[] = [
    {
      id: "canvas",
      label: "Canvas",
      value: canvas.value,
      selector: canvas.selector,
      description: /gradient\(/.test(canvas.value)
        ? "The exact upstream gradient reading surface. It stays independent from the application palette. A single solid ink/canvas contrast ratio would not describe this background accurately."
        : "The upstream source-reading surface. It stays independent from the application palette and page appearance.",
    },
    {
      id: "text",
      label: "Plain text",
      value: foreground.value,
      selector: foreground.selector,
      description:
        "The upstream base source color. Bare text and token classes without their own declaration inherit this ink.",
    },
  ];
  const groups = [
    [
      "comment",
      "Comments",
      "Commentary, prologs and supporting explanations. The original theme may intentionally make these quieter than executable source.",
    ],
    [
      "punctuation",
      "Punctuation",
      "Brackets, separators and structural punctuation. Nested grammar-specific punctuation can have a more specific upstream rule.",
    ],
    [
      "property",
      "Properties",
      "A representative property token. Tags, attributes and class names can have their own upstream colors rather than sharing this one.",
    ],
    [
      "number",
      "Numbers",
      "A representative numeric literal. Boolean, null and constant tokens may follow different grammar rules.",
    ],
    [
      "string",
      "Strings",
      "A representative string token. CSS strings, URLs, template strings and JSON properties can receive language-specific overrides.",
    ],
    [
      "operator",
      "Operators",
      "A representative operator token. Some upstream themes deliberately change this color for JavaScript or JSON.",
    ],
    [
      "keyword",
      "Keywords",
      "A representative language keyword. Builtins, at-rules and special keywords can have their own more specific upstream declarations.",
    ],
    [
      "function",
      "Functions",
      "A representative function token. Function names, methods and declarations depend on the active Prism grammar.",
    ],
    [
      "variable",
      "Variables",
      "A representative variable token. Many ordinary identifiers remain plain text because the grammar does not label every identifier as a variable.",
    ],
  ];
  for (const [id, label, description] of groups) {
    let paint: Paint | undefined;
    for (const rule of rules)
      for (const selector of rule.selectors) {
        if (selector.trim() === `.token.${id}` && rule.declarations.color)
          paint = choose(paint, selector, rule.declarations.color);
      }
    const inherited = !paint || paint.value === "inherit" || paint.value === "currentColor";
    result.push({
      id,
      label,
      value: inherited ? foreground.value : paint!.value,
      selector: inherited ? foreground.selector : paint!.selector,
      description: inherited
        ? `${description} No separate bare .token.${id} color is declared; it inherits the base source ink.`
        : description,
      inherited: inherited || undefined,
    });
  }
  return result;
}

function hasExternalResource(value: string) {
  const urls = [...value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)];
  return urls.some(
    (match) => !(match[1] ?? match[2] ?? match[3]).trim().toLowerCase().startsWith("data:"),
  );
}

const paintProperties = new Set([
  "color",
  "background",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "background-origin",
  "background-attachment",
  "text-shadow",
  "font-style",
  "font-weight",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-style",
  "opacity",
]);

/** Color-faithful local adapter. Code retains layout, typography scale and toolbar ownership. */
export function scopedPrismCss(
  id: string,
  label: string,
  source: string,
  sourceUrl: string,
  license: string,
) {
  if (!/^[a-z][a-z\d-]*$/.test(id)) throw new Error("Invalid Prism theme identity.");
  const scope = `[data-prism-theme="${id}"]`;
  // Keep original paint above the docs' legacy html.dark syntax rules in either
  // application appearance, while requiring an actual Code reader boundary.
  const readerScope = `${scope} .kamod-code[data-syntax-theme]`;
  const colors = prismSourceColors(source, label);
  const canvas = colors.find((color) => color.id === "canvas")!.value;
  const foreground = colors.find((color) => color.id === "text")!.value;
  const originalHeader = source.match(/^(?:\s*\/\*[\s\S]*?\*\/\s*)+/)?.[0] ?? "";
  const header = `/*!\n * ${label} — local Prism color adapter.\n * Source: ${sourceUrl}\n * Exact upstream paint; shared Code owns layout and controls.\n * SPDX-License-Identifier: MIT\n *\n${license
    .trim()
    .split("\n")
    .map((line) => ` * ${line}`)
    .join("\n")}\n */\n${originalHeader}`;
  const resets = `${scope} .kamod-code {\n  --kamod-code-source-surface: ${canvas};\n  --kamod-code-prism-foreground: ${foreground};\n  --kamod-code-foreground: ${foreground};\n${["comment", "punctuation", "property", "number", "string", "operator", "keyword", "function", "variable"].map((token) => `  --kamod-code-${token}: currentColor;`).join("\n")}\n}\n`;
  const output: string[] = [];
  for (const rule of prismSourceRules(source)) {
    const selectors = rule.selectors.filter(
      (selector) =>
        !hasPlugin(selector) && /\b(?:pre|code)\b|\.(?:token|namespace)\b/.test(selector),
    );
    const declarations = Object.entries(rule.declarations).filter(
      ([property, value]) => paintProperties.has(property) && !hasExternalResource(value),
    );
    if (!selectors.length || !declarations.length) continue;
    const scoped = selectors.map(
      (selector) =>
        `${readerScope} ${selector.replace(/pre\[class\*=["']language-["']\]/g, ':is(pre[class*="language-"], pre.docs-code)')}`,
    );
    let css = `${scoped.join(",\n")} {\n${declarations.map(([property, value]) => `  ${property}: ${value};`).join("\n")}\n}`;
    for (const condition of [...rule.conditions].reverse()) css = `${condition} {\n${css}\n}`;
    output.push(css);
  }
  return `${header}\n${resets}\n${output.join("\n\n")}\n`;
}
