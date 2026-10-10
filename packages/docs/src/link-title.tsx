import { type ComponentChildren, cloneElement, Fragment, type VNode } from "preact";

const minorWords = new Set(
  "a an the and as at but by for from if in inside into nor of on onto or per so than that through to until via with without yet because over under versus vs within about between after before".split(
    " ",
  ),
);
const preservedWords = new Set([
  "shadcn",
  "npm",
  "pnpm",
  "npx",
  "yarn",
  "bun",
  "i18n",
  "kamod",
  "cn",
]);

/** Title-case English documentation labels, preserving brands, identifiers and literal paths. */
export function linkTitle(text: string, capitalizeFirst = true): string {
  let first = capitalizeFirst;
  return text.replace(/[^\s]+/g, (token) => {
    const match = token.match(/^([("“‘]*)(.*?)([)"”.,:;!?]*)$/)!;
    const [, prefix, word, suffix] = match;
    if (!/[a-zA-Z]/.test(word)) return token;
    const initial = first;
    first = false;
    if (
      preservedWords.has(word) ||
      word.startsWith("kamod-") ||
      /[/.@_`<>\d]|[a-z][A-Z]/.test(word)
    )
      return token;
    const title = word
      .split("-")
      .map((part, index) => {
        const lower = part.toLowerCase();
        if (!(initial && index === 0) && minorWords.has(lower)) return lower;
        return part.replace(/^[a-z]/, (letter) => letter.toUpperCase());
      })
      .join("-");
    return prefix + title + suffix;
  });
}

/** Preserve code, icons and custom components when a linked heading contains rich text. */
export function linkTitleChildren(children: ComponentChildren): ComponentChildren {
  let first = true;
  const visit = (child: ComponentChildren): ComponentChildren => {
    if (typeof child === "string") {
      const text = linkTitle(child, first);
      if (/[a-zA-Z]/.test(child)) first = false;
      return text;
    }
    if (Array.isArray(child)) return child.map(visit);
    if (!child || typeof child !== "object" || !("type" in child)) return child;
    const node = child as VNode<{ children?: ComponentChildren; "aria-hidden"?: boolean | string }>;
    if (node.props["aria-hidden"] === true || node.props["aria-hidden"] === "true") return child;
    if (
      node.type !== Fragment &&
      (typeof node.type !== "string" || !/^(span|strong|em|b|i)$/.test(node.type))
    ) {
      first = false;
      return child;
    }
    return cloneElement(node, { children: visit(node.props.children) });
  };
  return visit(children);
}
