/** Canonical supported grammars plus escaped plain text. Aliases resolve to these values. */
export const codeLanguages = [
  "text",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "css",
  "markup",
  "markdown",
  "bash",
  "yaml",
  "diff",
] as const;

export type CodeLanguage = (typeof codeLanguages)[number];

const fileLanguages = {
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "tsx",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "jsx",
  json: "json",
  jsonc: "json",
  css: "css",
  svg: "markup",
  html: "markup",
  htm: "markup",
  xml: "markup",
  md: "markdown",
  markdown: "markdown",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  yml: "yaml",
  yaml: "yaml",
  diff: "diff",
  patch: "diff",
} as const satisfies Record<string, CodeLanguage>;

const languageAliases: Record<string, CodeLanguage> = {
  ...fileLanguages,
  typescript: "typescript",
  javascript: "javascript",
  markup: "markup",
  shell: "bash",
  shellscript: "bash",
  console: "bash",
  terminal: "bash",
  shellsession: "bash",
  text: "text",
  txt: "text",
  plain: "text",
  plaintext: "text",
  none: "text",
  auto: "text",
};

const commandLanguages = new Set([
  "bash",
  "sh",
  "zsh",
  "fish",
  "shell",
  "shellscript",
  "shellsession",
  "console",
  "terminal",
  "command",
  "commands",
  "git",
  "powershell",
  "pwsh",
  "ps1",
  "bat",
  "batch",
  "cmd",
]);

/** Command metadata wins over a filename; keep syntax checks bounded like language inference. */
export function isCommandCode(code: string, language?: string, filePath?: string): boolean {
  const hint = (language ?? "")
    .trim()
    .split(/\s+/, 1)[0]
    .toLowerCase()
    .replace(/^language-/, "");
  const path = (filePath ?? "")
    .trim()
    .toLowerCase()
    .replace(/[?#].*$/, "")
    .replace(/:\d+(?::\d+)?$/, "");
  if (
    commandLanguages.has(hint) ||
    commandLanguages.has(path) ||
    /(?:\.(?:sh|bash|zsh|fish|ps1|bat|cmd)|(?:^|[/\\])\.(?:bashrc|zshrc|profile))$/.test(path)
  )
    return true;
  const source = code.slice(0, 16_384).trimStart();
  return (
    /^#![^\n]*\b(?:bash|sh|zsh|dash|fish|pwsh|powershell)\b/.test(source) ||
    /^\$\s+\S/.test(source) ||
    /^(?:(?:sudo|corepack|env)\s+|[A-Z_][A-Z\d_]*=\S+\s+)*(?:pnpm|npm|npx|yarn|bun|git|curl|wget|node|deno|docker|podman|kubectl|make|cargo|go|python3?|pip3?|uv|mkdir|cd|ls|cp|mv|rm|echo|printf)(?:\s|$)/.test(
      source,
    ) ||
    /^export\s+\w+=/.test(source)
  );
}

/** Choose a grammar from the final file extension, ignoring URL and source-position metadata. */
export function codeLanguageForFile(path: string): CodeLanguage {
  const clean = path.replace(/[?#].*$/, "").replace(/:\d+(?::\d+)?$/, "");
  const extension = clean.match(/\.([^./\\]+)$/)?.[1].toLowerCase() ?? "";
  return Object.hasOwn(fileLanguages, extension)
    ? fileLanguages[extension as keyof typeof fileLanguages]
    : "text";
}

/** Accept fence aliases, language classes and path-only fence labels without trusting arbitrary names. */
export function normalizeCodeLanguage(label?: string): CodeLanguage {
  const name = (label ?? "")
    .trim()
    .split(/\s+/, 1)[0]
    .toLowerCase()
    .replace(/^language-/, "");
  return Object.hasOwn(languageAliases, name) ? languageAliases[name] : codeLanguageForFile(name);
}

const typescriptSyntax =
  /\b(?:interface\s+\w+\s*(?:extends\s+[^\n{]+)?\{|type\s+\w+(?:<[^\n>]+>)?\s*=|(?:const|let|var)\s+\w+\s*:\s*\w+|(?:\w|\))\s*:\s*(?:string|number|boolean|unknown|never|void|ComponentChildren)\b|import\s+type\b|satisfies\s+\w+|\bas\s+const\b)/;
/** Ignore closed strings/comments without rescanning every escaped, unfinished quote. */
function syntaxOutsideStrings(code: string) {
  const parts: string[] = [];
  const failedUntil: Record<string, number> = {};
  let unterminatedComment = false;
  let retainedFrom = 0;
  for (let cursor = 0; cursor < code.length; cursor += 1) {
    const character = code[cursor];
    let end: number | undefined;
    if (character === '"' || character === "'" || character === "`") {
      if (cursor < (failedUntil[character] ?? 0)) continue;
      let closing = cursor + 1;
      while (closing < code.length && code[closing] !== character) {
        if (code[closing] === "\\") {
          const escaped = code[closing + 1];
          if (escaped === undefined || "\n\r\u2028\u2029".includes(escaped)) {
            failedUntil[character] = closing + 2;
            break;
          }
          closing += 2;
        } else closing += 1;
      }
      if (closing >= code.length) failedUntil[character] = code.length;
      else if (code[closing] === character) end = closing + 1;
    } else if (character === "/" && code[cursor + 1] === "/") {
      const newline = code.indexOf("\n", cursor + 2);
      end = newline === -1 ? code.length : newline;
    } else if (character === "/" && code[cursor + 1] === "*" && !unterminatedComment) {
      const closing = code.indexOf("*/", cursor + 2);
      if (closing === -1) unterminatedComment = true;
      else end = closing + 2;
    }
    if (end !== undefined) {
      parts.push(code.slice(retainedFrom, cursor), " ");
      retainedFrom = end;
      cursor = end - 1;
    }
  }
  return parts.length ? parts.join("") + code.slice(retainedFrom) : code;
}

const javascriptSyntax =
  /(?:^|[\n;])\s*(?:(?:export\s+(?:default\s+)?)?(?:async\s+)?(?:function\s+\w*\s*\(|(?:const|let|var)\s+[\w{[][^\n]*=|class\s+\w+)|export\s+(?:default\s+|\{|\*)|import\s+(?:["'{*]|[\w]+\s+from\b)|(?:return|throw)\s+\S|(?:console|JSON|Math|Object|window|document)\.\w+\s*\()|=>/;

/** Detect JSX without mistaking a generic type such as `Array<T>` for a tag. */
function hasJsx(code: string) {
  const fragment = code.indexOf("<>");
  if (fragment !== -1 && code.indexOf("</>", fragment + 2) !== -1) return true;
  const opening = /<[A-Z][\w.:-]*(?:\s[^<>]*)?>/.exec(code);
  if (opening && /<\/[A-Z]/.test(code.slice(opening.index + opening[0].length))) return true;
  // Separate opening/closing searches and non-overlapping whitespace prevent
  // repeated rescans of incomplete tags while the author is editing a snippet.
  return /<[a-z][\w.:-]*(?=[\s/>])[^<>]*>\s*\{|<[A-Z][\w.:-]*(?:\s[^<>]*)?\/>|<[a-zA-Z][\w.:-]*(?=[\s/>])[^<>]*(?:=\s*\{|\bclassName=)/.test(
    code,
  );
}

const cssSelectorCharacter = /[\w\s.#:[\]="'()>+~*,-]/;

/** Check each declaration's selector once instead of retrying a multiline prefix. */
function hasCssRule(source: string) {
  if (/^@(?:import|tailwind|theme|layer|media|supports|utility|apply)\b/m.test(source)) return true;
  for (const declaration of source.matchAll(/\{\s*(?:--[\w-]+|[a-z-]+)\s*:/g)) {
    let start = declaration.index;
    while (start > 0 && cssSelectorCharacter.test(source[start - 1])) start -= 1;
    // A selector must begin on a new line, not partway through unrelated syntax.
    if (start > 0 && source[start - 1] !== "\n") {
      const newline = source.indexOf("\n", start);
      if (newline === -1 || newline >= declaration.index) continue;
      start = newline + 1;
    }
    const selector = source.slice(start, declaration.index);
    if (/^[.#:*]/m.test(selector) || /(?:^|\n)[a-z][\w-]*(?:\s+[a-z][\w-]*)?\s*$/.test(selector))
      return true;
  }
  return false;
}

/** Small, bounded syntax checks; no parser or multi-grammar guessing on the rendering path. */
function inferCodeLanguage(code: string): CodeLanguage {
  const source = code.slice(0, 16_384).trim();
  if (!source) return "text";
  if (isCommandCode(source)) return "bash";
  const syntax = syntaxOutsideStrings(source);
  if (/^diff --git |^@@ [+-]\d|^--- [^\n]+\n\+\+\+ /m.test(source)) return "diff";
  if (/^[{[]/.test(source)) {
    try {
      JSON.parse(source);
      return "json";
    } catch {
      /* Partial source can still have another recognizable grammar. */
    }
    if (/^\{\s*(?:\/\/[^\n]*\n\s*)?"[^"\n]+"\s*:/.test(source)) return "json";
  }
  const typed = typescriptSyntax.test(syntax) || /[,(]\s*\w+\??\s*:\s*[A-Z][\w.]*/.test(syntax);
  if (hasJsx(syntax)) return typed ? "tsx" : "jsx";
  // Lowercase HTML embedded in a function is JSX; standalone HTML/XML stays markup.
  const markup = /^\s*(?:<!doctype\b|<\?xml\b|<!--|<[a-z][\w:-]*(?:\s[^<>]*)?\/?>)/i.test(source);
  if (markup && /<\/[\w:-]+\s*>|\/\s*>|<!doctype\b|<\?xml\b/i.test(source)) return "markup";
  const script = javascriptSyntax.test(syntax) || /^import\s+["']/.test(source);
  if (script || typed)
    return /<[a-z][\w-]*[\s>]/.test(syntax)
      ? typed
        ? "tsx"
        : "jsx"
      : typed
        ? "typescript"
        : "javascript";
  if (hasCssRule(source)) return "css";
  if (
    /^(?:#{1,6}\s+\S|```|~~~)/m.test(source) ||
    /\[[^\]\n]+\]\((?:https?:|\/|#)[^)]+\)/.test(source)
  )
    return "markdown";
  // YAML needs multiple keys or explicit structure; a prose sentence with a colon is not enough.
  if (
    /^(?:---\s*\n)?[\w.-]+:\s*(?:\n[ \t]+\S|[>|]\s*\n)/.test(source) ||
    (source.match(/^[\w.-]+:\s+[^\n]+$/gm)?.length ?? 0) >= 2
  )
    return "yaml";
  return "text";
}

/** Explicit grammar → file metadata → recognizable syntax. Never rewrites the source string. */
export function resolveCodeLanguage(
  code: string,
  language?: string,
  filePath?: string,
): CodeLanguage {
  const declared = normalizeCodeLanguage(language);
  const file = filePath ? codeLanguageForFile(filePath) : "text";
  const resolved = declared !== "text" ? declared : file;
  if (resolved !== "text") {
    if (
      (resolved === "javascript" || resolved === "typescript") &&
      hasJsx(syntaxOutsideStrings(code.slice(0, 16_384)))
    )
      return resolved === "typescript" ? "tsx" : "jsx";
    return resolved;
  }
  return inferCodeLanguage(code);
}
