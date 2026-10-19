/** Read authored examples and API rows without importing a documentation page or its demos. */
import ts from "@typescript/typescript6";
import { componentPropsId } from "../src/docs/components/component-detail/component-api-id.ts";
import { docUsageImport } from "../src/docs/doc-usage-import.ts";
import type { CodeReferenceHelpField, CodeReferenceHelpSection } from "../src/references/types.ts";
import { extractCodeReferenceProse } from "./code-reference-prose.ts";

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
  // A preview function's shadowed locals must never overwrite a module's authored table data.
  for (const statement of file.statements)
    if (ts.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (ts.isIdentifier(declaration.name) && declaration.initializer)
          locals.set(declaration.name.text, declaration.initializer);
  const literal = (
    node: ts.Expression | undefined,
    seen = new Set<string>(),
  ): Literal | undefined => {
    if (!node) return;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isJsxElement(node) || ts.isJsxFragment(node))
      return extractCodeReferenceProse(node, slug);
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
    // Read the known helper's literal configuration structurally; no page function is executed.
    if (ts.isCallExpression(node) && node.expression.getText(file) === "createGenericDocPage")
      return literal(node.arguments[0], seen);
    if (ts.isArrayLiteralExpression(node))
      return node.elements.flatMap((entry) => {
        const value = literal(entry as ts.Expression, seen);
        return value === undefined ? [] : [value];
      });
    if (ts.isObjectLiteralExpression(node)) {
      const entries: RecordLiteral = {};
      for (const property of node.properties) {
        if (ts.isSpreadAssignment(property)) {
          Object.assign(entries, record(literal(property.expression, seen)));
          continue;
        }
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
  let configDepth = Infinity;
  let generic = false;
  const visit = (node: ts.Node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const value = record(literal(node));
      let depth = 0;
      for (let parent: ts.Node | undefined = node.parent; parent; parent = parent.parent) depth++;
      if (value?.slug === slug && depth < configDepth) {
        config = value;
        configDepth = depth;
      }
    }
    if (ts.isCallExpression(node) && node.expression.getText(file) === "createGenericDocPage") {
      const value = record(literal(node.arguments[0]));
      if (value?.slug === slug) {
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
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  const command = string(config?.command) || (generic ? "pnpm add @kamod-ch/ui" : "");
  const authoredSections = Array.isArray(config?.sections) ? config.sections.map(record) : [];
  const installation = authoredSections.find((entry) => entry?.id === "installation");
  const usage = authoredSections.find((entry) => entry?.id === "usage");
  const installationText = string(config?.installationText || installation?.text);
  const usageText = string(config?.usageText || usage?.text);
  if (config && (installationText || usageText || command)) {
    const href = `/docs/${slug}/installation`;
    sections.push({
      title: "Installation & usage",
      detail: "From the guide",
      source: { label: "Installation and usage guide", href: `${href}#installation` },
      excerpts: [
        {
          title: "Installation",
          description: installationText || undefined,
          source: { label: "Installation", href: `${href}#installation` },
          code: command
            ? { language: "bash", value: command, caption: "Install package" }
            : undefined,
        },
        {
          title: "Usage",
          description: usageText || undefined,
          source: { label: "Usage guidance", href: `${href}#usage` },
          code: {
            language: "tsx",
            value: docUsageImport({
              slug,
              usageImportSnippet: string(config.usageImportSnippet) || undefined,
            }),
            caption: "Usage import",
          },
        },
      ],
      note: "Connect [theme CSS](/docs/theming/css-setup) once before rendering.",
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
              defaultValue: typeof row?.defaultValue === "string" ? row.defaultValue : undefined,
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
        note: "Defaults from this guide; requirements from source.",
      });
  }
  return sections;
}
