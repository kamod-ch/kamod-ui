/** Source offsets, not a compiler AST. Literal content never becomes an identifier. */
export type ReferenceToken = {
  text: string;
  start: number;
  end: number;
  kind: "name" | "string" | "punctuation";
};

/** Scan JS/TS import/reference syntax without loading a compiler or the syntax highlighter. */
export function referenceTokens(source: string, jsx: boolean) {
  const tokens: ReferenceToken[] = [];
  let cursor = 0;
  const emit = (start: number, kind: ReferenceToken["kind"] = "punctuation") =>
    tokens.push({ text: source.slice(start, cursor), start, end: cursor, kind });
  const quoted = () => {
    const start = cursor++;
    const quote = source[start];
    while (cursor < source.length) {
      if (source[cursor++] === "\\") cursor++;
      else if (source[cursor - 1] === quote) break;
    }
    emit(start, "string");
  };
  const name = () => {
    const start = cursor++;
    while (/[\w$]/.test(source[cursor] ?? "")) cursor++;
    emit(start, "name");
  };
  const expression = (nested = false, depth = 0): void => {
    if (depth > 64) {
      cursor = source.length;
      return;
    }
    let braces = 0;
    while (cursor < source.length) {
      const start = cursor;
      const char = source[cursor];
      if (/\s/.test(char)) {
        cursor++;
        continue;
      }
      if (source.startsWith("//", cursor)) {
        cursor = source.indexOf("\n", cursor + 2);
        if (cursor < 0) cursor = source.length;
      } else if (source.startsWith("/*", cursor)) {
        const end = source.indexOf("*/", cursor + 2);
        cursor = end < 0 ? source.length : end + 2;
      } else if (char === '"' || char === "'") quoted();
      else if (char === "`") {
        cursor++;
        while (cursor < source.length) {
          if (source[cursor] === "\\") cursor += 2;
          else if (source[cursor++] === "`") break;
          else if (source[cursor - 1] === "$" && source[cursor] === "{") {
            const opening = cursor++;
            emit(opening);
            expression(true, depth + 1);
          }
        }
      } else if (
        char === "/" &&
        /^(?:=|\(|\[|\{|,|:|;|!|\?|=>|return|throw)$/.test(tokens.at(-1)?.text ?? "=")
      ) {
        cursor++;
        let inClass = false;
        while (cursor < source.length) {
          const current = source[cursor++];
          if (current === "\\") cursor++;
          else if (current === "[") inClass = true;
          else if (current === "]") inClass = false;
          else if (current === "/" && !inClass) break;
          else if (current === "\n") break;
        }
        while (/[a-z]/i.test(source[cursor] ?? "")) cursor++;
      } else if (
        jsx &&
        char === "<" &&
        /^<(?:[A-Za-z][\w.]*(?:\s|\/?>)|>)/.test(source.slice(cursor)) &&
        !/^<[\w]+>\s*\(/.test(source.slice(cursor))
      ) {
        element(depth + 1);
      } else if (/[A-Za-z_$]/.test(char)) name();
      else {
        cursor += source.startsWith("=>", cursor) ? 2 : 1;
        emit(start);
        if (char === "{") braces++;
        if (char === "}") {
          if (nested && braces === 0) return;
          braces--;
        }
      }
    }
  };
  const element = (depth: number): void => {
    if (depth > 64) {
      cursor = source.length;
      return;
    }
    // Tag names are references; attribute names, quoted values and JSX prose are not.
    const opening = cursor++;
    emit(opening);
    const closing = source[cursor] === "/";
    if (closing) {
      const slash = cursor++;
      emit(slash);
    }
    while (/[\w$.]/.test(source[cursor] ?? "")) {
      if (source[cursor] === ".") {
        const dot = cursor++;
        emit(dot);
      } else name();
    }
    while (cursor < source.length && source[cursor] !== ">") {
      if (source[cursor] === '"' || source[cursor] === "'") quoted();
      else if (source[cursor] === "{") {
        const brace = cursor++;
        emit(brace);
        expression(true, depth + 1);
      } else cursor++;
    }
    const selfClosing = source[cursor - 1] === "/";
    const end = cursor++;
    emit(end);
    if (closing || selfClosing) return;
    while (cursor < source.length) {
      if (source[cursor] === "<") {
        const done = source[cursor + 1] === "/";
        element(depth + 1);
        if (done) return;
      } else if (source[cursor] === "{") {
        const brace = cursor++;
        emit(brace);
        expression(true, depth + 1);
      } else cursor++;
    }
  };
  expression();
  return tokens;
}
