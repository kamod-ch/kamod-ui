import type { CodeLanguage } from "./code-language";
import { type ReferenceToken, referenceTokens } from "./code-reference-tokens";

/** Resolve only destinations the host application actually owns or can verify. */
export type CodeReferenceResolver = (reference: {
  module: string;
  /** Original export name, even when a snippet uses an alias. Undefined identifies the module string. */
  imported?: string;
  local?: string;
  filePath?: string;
}) => string | undefined;
/** Source context lets hosts explain a link without reparsing or changing its copied text. */
export type CodeReference = {
  start: number;
  end: number;
  href: string;
  module?: string;
  imported?: string;
  local?: string;
  filePath?: string;
};
type Binding = { module: string; imported: string; local: string };

/** Conservative lexical references: complete static imports, aliases and namespace members. */
export function findCodeReferences(
  code: string,
  language: CodeLanguage,
  resolve: CodeReferenceResolver,
  filePath?: string,
) {
  if (
    !["javascript", "typescript", "jsx", "tsx"].includes(language) ||
    (!code.includes("import") && !code.includes("require"))
  )
    return [];
  const tokens = referenceTokens(code, language === "jsx" || language === "tsx");
  const bindings = new Map<string, Binding>();
  const imports = new Set<number>();
  const references: CodeReference[] = [];
  const link = (
    token: ReferenceToken,
    binding: Omit<Binding, "local"> & { local?: string },
    moduleString = false,
  ) => {
    const href = resolve({
      ...binding,
      imported: moduleString ? undefined : binding.imported,
      filePath,
    });
    // Never activate executable schemes, even if a custom resolver returns one.
    if (typeof href === "string" && /^(?:https?:\/\/|\/(?!\/)|#)/i.test(href))
      references.push({
        start: token.start + (moduleString ? 1 : 0),
        end: token.end - (moduleString ? 1 : 0),
        href,
        module: binding.module,
        imported: moduleString ? undefined : binding.imported,
        local: binding.local,
        filePath: binding.module.startsWith(".") ? filePath : undefined,
      });
  };
  for (let i = 0; i < tokens.length; i++) {
    if (!["import", "require"].includes(tokens[i].text)) continue;
    if (tokens[i - 1]?.text === ".") continue;
    if (
      tokens[i + 1]?.text === "(" &&
      tokens[i + 2]?.kind === "string" &&
      tokens[i + 3]?.text === ")"
    ) {
      const literal = tokens[i + 2];
      if (!literal.text.includes("\\"))
        link(literal, { module: literal.text.slice(1, -1), imported: "*" }, true);
      continue;
    }
    if (tokens[i].text !== "import") continue;
    let end = i + 1;
    if (["(", "."].includes(tokens[end]?.text)) continue;
    if (tokens[end]?.text !== '"' && tokens[end]?.kind !== "string") {
      while (end < tokens.length && tokens[end].text !== "from" && tokens[end].text !== ";") end++;
      if (tokens[end]?.text !== "from") continue;
      end++;
    }
    const moduleToken = tokens[end];
    if (moduleToken?.kind !== "string" || moduleToken.text.includes("\\")) continue;
    const module = moduleToken.text.slice(1, -1);
    for (let j = i; j <= end; j++) imports.add(j);
    link(moduleToken, { module, imported: "*" }, true);
    let cursor = i + 1;
    if (tokens[cursor].text === "type" && tokens[cursor + 1]?.text !== "from") cursor++;
    const bind = (exported: ReferenceToken, local = exported, imported = exported.text) => {
      const binding = { module, imported, local: local.text };
      bindings.set(local.text, binding);
      link(exported, binding);
      if (local !== exported) link(local, binding);
    };
    if (tokens[cursor]?.kind === "name" && tokens[cursor].text !== "from") {
      bind(tokens[cursor], tokens[cursor], "default");
      cursor++;
      if (tokens[cursor]?.text === ",") cursor++;
    }
    if (tokens[cursor]?.text === "*") {
      if (tokens[cursor + 1]?.text === "as" && tokens[cursor + 2]?.kind === "name")
        bind(tokens[cursor + 2], tokens[cursor + 2], "*");
    } else if (tokens[cursor]?.text === "{") {
      for (let j = cursor + 1; j < end && tokens[j].text !== "}"; j++) {
        if (tokens[j].kind !== "name" || ["type", "as"].includes(tokens[j].text)) continue;
        if (tokens[j + 1]?.text === "as" && tokens[j + 2]?.kind === "name") {
          bind(tokens[j], tokens[j + 2]);
          j += 2;
        } else bind(tokens[j]);
      }
    }
    i = end;
  }
  if (!bindings.size) return references;
  const shadows = referenceShadows(tokens, imports, bindings);
  const isShadowed = (name: string, token: ReferenceToken) =>
    shadows.get(name)?.some((s) => s.start <= token.start && s.end >= token.end);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (imports.has(i) || token.kind !== "name" || isShadowed(token.text, token)) continue;
    const previous = tokens[i - 1]?.text;
    if (previous === ".") {
      const namespace = bindings.get(tokens[i - 2]?.text);
      if (namespace?.imported === "*" && !isShadowed(namespace.local, token))
        link(token, { ...namespace, imported: token.text });
    } else if (!(tokens[i + 1]?.text === ":" && ["{", ","].includes(previous))) {
      const binding = bindings.get(token.text);
      if (binding) link(token, binding);
    }
  }
  return references.sort((a, b) => a.start - b.start);
}

/** Suppress common block declarations and function/arrow parameters that hide an import. */
function referenceShadows(
  tokens: ReferenceToken[],
  imports: Set<number>,
  bindings: Map<string, Binding>,
) {
  const shadows = new Map<string, { start: number; end: number }[]>();
  const stack: { open: number; close: number }[] = [];
  const pairs = new Map<number, number>();
  const openings: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (imports.has(i)) continue;
    if (["{", "("].includes(tokens[i].text)) openings.push(i);
    else if (["}", ")"].includes(tokens[i].text)) {
      const open = openings.pop();
      if (open !== undefined) {
        pairs.set(open, i);
        pairs.set(i, open);
      }
    }
  }
  const add = (index: number, start: number, end: number) => {
    const name = tokens[index]?.text;
    if (!bindings.has(name)) return;
    if (!shadows.has(name)) shadows.set(name, []);
    shadows.get(name)!.push({ start, end });
  };
  for (let i = 0; i < tokens.length; i++) {
    if (imports.has(i)) continue;
    const token = tokens[i];
    if (token.text === "{") {
      const close = pairs.get(i) ?? tokens.length - 1;
      stack.push({ open: i, close });
      const arrow = tokens[i - 1]?.text === "=>";
      const last = arrow ? i - 2 : i - 1;
      const paramOpen = tokens[last]?.text === ")" ? pairs.get(last) : undefined;
      const before = paramOpen === undefined ? undefined : tokens[paramOpen - 1]?.text;
      const fn =
        before === "function" ||
        tokens[(paramOpen ?? 0) - 2]?.text === "function" ||
        before === "catch";
      if (paramOpen !== undefined && (arrow || fn)) {
        for (let j = paramOpen + 1; j < last; j++)
          if (["(", ",", "{"].includes(tokens[j - 1]?.text))
            add(j, tokens[paramOpen].start, tokens[close].end);
      } else if (arrow) add(last, tokens[last].start, tokens[close].end);
    }
    if (token.text === "=>" && tokens[i + 1]?.text !== "{") {
      const last = i - 1;
      const open = tokens[last]?.text === ")" ? pairs.get(last) : undefined;
      let end = i + 1;
      while (end < tokens.length && ![";", ",", "}"].includes(tokens[end].text)) {
        end = ["(", "{"].includes(tokens[end].text) ? (pairs.get(end) ?? end) + 1 : end + 1;
      }
      const start = tokens[open ?? last].start;
      const finish = tokens[end]?.start ?? tokens.at(-1)!.end;
      if (open === undefined) add(last, start, finish);
      else
        for (let j = open + 1; j < last; j++)
          if (["(", ",", "{"].includes(tokens[j - 1]?.text)) add(j, start, finish);
    }
    if (["const", "let", "var", "function", "class", "type", "interface"].includes(token.text)) {
      if (["const", "let", "var"].includes(token.text) && tokens[i + 1]?.text === "{") {
        const end = pairs.get(i + 1) ?? i + 1;
        for (let j = i + 2; j < end; j++)
          if (tokens[j].kind === "name" && tokens[j + 1]?.text !== ":")
            add(
              j,
              tokens[stack.at(-1)?.open ?? 0].start,
              tokens[stack.at(-1)?.close ?? tokens.length - 1].end,
            );
      }
      add(
        i + 1,
        tokens[stack.at(-1)?.open ?? 0]?.start ?? 0,
        tokens[stack.at(-1)?.close ?? tokens.length - 1]?.end ?? 0,
      );
    }
    if (token.text === "}") stack.pop();
  }
  return shadows;
}
