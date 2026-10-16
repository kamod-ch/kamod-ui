/** Read authored examples and API rows without importing a documentation page or its demos. */
import ts from "@typescript/typescript6";
import { componentPropsId } from "../src/docs/components/component-detail/component-api-id";
import type { CodeReferenceHelpField, CodeReferenceHelpSection } from "../src/references/types";

type Literal = string | Literal[] | { [key: string]: Literal };
type RecordLiteral = { [key: string]: Literal };
const record = (value: Literal | undefined): RecordLiteral | undefined =>
  value && !Array.isArray(value) && typeof value === "object" ? value : undefined;
const string = (value: Literal | undefined) => (typeof value === "string" ? value : "");

/** Only local literals are followed; calls, getters, imports and template expressions stay unread. */
export function extractCodeReferenceSections(
  source: string,
  slug: string,
): CodeReferenceHelpSection[] {
  const file = ts.createSourceFile(
    `${slug}-doc.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const locals = new Map<string, ts.Expression>();
  const collect = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer)
      locals.set(node.name.text, node.initializer);
    ts.forEachChild(node, collect);
  };
  collect(file);
  const literal = (
    node: ts.Expression | undefined,
    seen = new Set<string>(),
  ): Literal | undefined => {
    if (!node) return;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node)
    )
      return literal(node.expression, seen);
    if (ts.isIdentifier(node) && !seen.has(node.text)) {
      const next = new Set(seen).add(node.text);
      return literal(locals.get(node.text), next);
    }
    if (ts.isArrayLiteralExpression(node))
      return node.elements.flatMap((entry) => {
        const value = literal(entry as ts.Expression, seen);
        return value === undefined ? [] : [value];
      });
    if (ts.isObjectLiteralExpression(node)) {
      const entries: RecordLiteral = {};
      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property))
          continue;
        const value = literal(
          ts.isShorthandPropertyAssignment(property) ? property.name : property.initializer,
          seen,
        );
        if (value !== undefined)
          entries[property.name.getText(file).replace(/^["']|["']$/g, "")] = value;
      }
      return entries;
    }
  };
  const sections: CodeReferenceHelpSection[] = [];
  const tables = new Map<string, RecordLiteral>();
  let config: RecordLiteral | undefined;
  let generic = false;
  let installationCode = "";
  const visit = (node: ts.Node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const value = record(literal(node));
      if (value && value.slug === slug) config = value;
    }
    if (ts.isCallExpression(node) && node.expression.getText(file) === "createGenericDocPage") {
      const value = record(literal(node.arguments[0]));
      if (value?.slug === slug) {
        config = value;
        generic = true;
        tables.set(string(value.title), { title: value.title, rows: value.apiRows ?? [] });
      }
    }
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const attribute = (name: string) => {
        const entry = node.attributes.properties.find(
          (entry) => ts.isJsxAttribute(entry) && entry.name.getText(file) === name,
        );
        return entry &&
          ts.isJsxAttribute(entry) &&
          entry.initializer &&
          ts.isJsxExpression(entry.initializer)
          ? literal(entry.initializer.expression)
          : undefined;
      };
      if (node.tagName.getText(file) === "ApiReference") {
        const value = attribute("sections");
        if (Array.isArray(value))
          for (const entry of value) {
            const section = record(entry);
            if (section && string(section.title)) tables.set(string(section.title), section);
          }
      }
      if (node.tagName.getText(file) === "CodeBlock") {
        let parent: ts.Node | undefined = node.parent;
        while (parent && !ts.isIfStatement(parent)) parent = parent.parent;
        if (
          parent &&
          ts.isIfStatement(parent) &&
          /===\s*["']installation["']/.test(parent.expression.getText(file))
        )
          installationCode ||= string(attribute("code"));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  const examples = config?.exampleSections;
  const firstExample = Array.isArray(examples) ? record(examples[0]) : undefined;
  const installExample = record(config?.installationExample);
  installationCode ||= string(installExample?.code);
  if (!installationCode && generic) {
    // The generic guide's first example supplies its actual imports, not an invented module path.
    installationCode = string(config?.previewCode || firstExample?.code)
      .split("\n")
      .filter((line) => /^import\b/.test(line))
      .join("\n");
  }
  const command = string(config?.command) || (generic ? "pnpm add @kamod-ch/ui" : "");
  if (installationCode || command) {
    const installation = Array.isArray(config?.sections)
      ? config.sections.map(record).find((entry) => entry?.id === "installation")
      : undefined;
    sections.push({
      title: "Install & import",
      detail: "Guide setup",
      source: { label: "Installation guide", href: `/docs/${slug}/installation#installation` },
      description: string(config?.installationText || installation?.text) || undefined,
      code: installationCode
        ? { language: "tsx", value: installationCode.slice(0, 6000), caption: "Guide import" }
        : undefined,
      rows: command ? [{ label: "Install", value: `\`${command}\`` }] : undefined,
      note: "Keep one owner for shared theme styles; [CSS setup](/docs/theming/installation#css-setup) covers the stylesheet import and build integration.",
    });
  }
  for (const [title, section] of tables) {
    const rows = section.rows;
    const fields: CodeReferenceHelpField[] = Array.isArray(rows)
      ? rows.flatMap((entry) => {
          const row = record(entry);
          const name = string(row?.prop);
          if (!name || !string(row?.type)) return [];
          return [
            {
              name,
              type: string(row?.type),
              required: false,
              description: string(row?.description),
              defaultValue: string(row?.defaultValue),
            },
          ];
        })
      : [];
    if (fields.length)
      sections.push({
        title: "Props & defaults",
        detail: title,
        contractName: title,
        source: {
          label: `${title} documented props`,
          href: `/docs/${slug}/installation#${componentPropsId(slug, title)}`,
        },
        description: string(section.description) || undefined,
        fields,
        note: "Documented defaults belong to this guide; directly declared requirements come from the source type.",
      });
  }
  return sections;
}
