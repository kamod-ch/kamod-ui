/** Extract documentation metadata during development/build; no compiler ships to the browser. */
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import ts from "@typescript/typescript6";
import type { Plugin } from "vite";

/** Keep declarations verbatim and mark only required fields declared directly in a type. */
export function extractComponentTypes(source: string, filePath: string) {
  const file = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const docs = (node: ts.Node) =>
    (ts.getJSDocCommentsAndTags(node) as ts.JSDoc[])
      .map((doc) => (typeof doc.comment === "string" ? doc.comment : ""))
      .filter(Boolean)
      .join(" ");
  const members = (node: ts.Node): ts.TypeElement[] => {
    if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) return [...node.members];
    if (ts.isIntersectionTypeNode(node)) return node.types.flatMap(members);
    if (ts.isParenthesizedTypeNode(node)) return members(node.type);
    return [];
  };
  return file.statements.flatMap((node) => {
    if (!ts.isTypeAliasDeclaration(node) && !ts.isInterfaceDeclaration(node)) return [];
    const exported =
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    if (!exported && !node.name.text.endsWith("Props")) return [];
    return [
      {
        name: node.name.text,
        source: node.getFullText(file).trim(),
        filePath,
        exported,
        description: docs(node),
        fields: members(ts.isTypeAliasDeclaration(node) ? node.type : node).flatMap((member) => {
          if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) return [];
          return [
            {
              name: ts.isStringLiteral(member.name) ? member.name.text : member.name.getText(file),
              type: ts.isPropertySignature(member)
                ? (member.type?.getText(file) ?? "unknown")
                : member.getText(file),
              required: !member.questionToken,
              description: docs(member),
            },
          ];
        }),
      },
    ];
  });
}

export function componentApiPlugin(): Plugin {
  const repoRoot = resolve(import.meta.dirname, "../../..");
  return {
    name: "kamod-component-api",
    enforce: "pre",
    async load(id) {
      if (!id.endsWith("?component-api")) return;
      const file = id.slice(0, -"?component-api".length);
      this.addWatchFile(file);
      const definitions = extractComponentTypes(
        await readFile(file, "utf8"),
        relative(repoRoot, file).replaceAll("\\", "/"),
      );
      return `export default ${JSON.stringify(definitions)};`;
    },
  };
}
