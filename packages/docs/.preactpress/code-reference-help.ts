/** Build-only source extraction for lazy help cards; the TypeScript compiler stays out of the client. */
import ts from "@typescript/typescript6";
import type { CodeReferenceSourceModule, CodeReferenceSourceSymbol } from "../src/references/types";
import { extractComponentTypes } from "./component-api-plugin";

const compact = (value: string, limit = 260) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= limit ? text : `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;
};
const clean = (value: string, limit = 260) =>
  compact(
    value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/React context/g, "component context"),
    limit,
  );

const jsDoc = (node: ts.Node) =>
  clean(
    (ts.getJSDocCommentsAndTags(node) as ts.JSDoc[])
      .map((doc) =>
        typeof doc.comment === "string"
          ? doc.comment
          : doc.comment?.map((part) => part.text).join(" "),
      )
      .filter(Boolean)
      .join(" "),
  );

const typeNames = (node: ts.Node) => {
  const names = new Set<string>();
  const visit = (child: ts.Node) => {
    if (ts.isTypeReferenceNode(child)) names.add(child.typeName.getText());
    ts.forEachChild(child, visit);
  };
  visit(node);
  return [...names];
};

/** Preserve declaration facts, not implementation bodies or inferred browser-time contracts. */
export function extractCodeReferenceSymbols(source: string, filePath: string) {
  const file = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const definitions = extractComponentTypes(source, filePath);
  const symbols: CodeReferenceSourceSymbol[] = definitions.map((definition) => ({
    name: definition.name,
    kind: "type",
    file: filePath,
    description: clean(definition.description),
    fields: definition.fields.map((field) => ({
      ...field,
      description: clean(field.description, 160),
    })),
    typeNames: [],
    typeId: `component-type-${filePath
      .split("/")
      .at(-1)!
      .replace(/\.[^.]+$/, "")}-${definition.name}`,
  }));
  for (const statement of file.statements) {
    if (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) {
      const symbol = symbols.find(({ name }) => name === statement.name.text);
      if (symbol) {
        symbol.typeNames = typeNames(statement);
        symbol.signature = compact(
          ts.isTypeAliasDeclaration(statement)
            ? statement.type.getText(file)
            : statement.heritageClauses?.map((clause) => clause.getText(file)).join(" ") ||
                "interface",
          180,
        );
      }
      continue;
    }
    if (
      !ts.canHaveModifiers(statement) ||
      !ts.getModifiers(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    )
      continue;
    const declarations = ts.isVariableStatement(statement)
      ? statement.declarationList.declarations
      : ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)
        ? [statement]
        : [];
    for (const declaration of declarations) {
      if (!declaration.name || !ts.isIdentifier(declaration.name)) continue;
      const name = declaration.name.text;
      const initializer = ts.isVariableDeclaration(declaration)
        ? declaration.initializer
        : declaration;
      const callable =
        initializer &&
        (ts.isArrowFunction(initializer) ||
          ts.isFunctionDeclaration(initializer) ||
          ts.isFunctionExpression(initializer));
      const kind =
        ts.isClassDeclaration(declaration) || (callable && /^[A-Z]/.test(name))
          ? "component"
          : callable || (initializer && ts.isCallExpression(initializer))
            ? "function"
            : "constant";
      const owner = definitions.find((definition) => definition.name === `${name}Props`);
      const parameters = callable ? initializer.parameters : [];
      const related = new Set(
        parameters.flatMap((parameter) => (parameter.type ? typeNames(parameter.type) : [])),
      );
      if (owner) related.add(owner.name);
      symbols.push({
        name,
        kind,
        file: filePath,
        description: jsDoc(statement) || jsDoc(declaration),
        signature: parameters.length
          ? compact(
              parameters
                .map((parameter) => parameter.type?.getText(file) || parameter.name.getText(file))
                .join(", "),
              180,
            )
          : undefined,
        typeNames: [...related],
        fields: owner?.fields.map((field) => ({
          ...field,
          description: clean(field.description, 160),
        })),
      });
    }
  }
  return symbols;
}

/** Installed declarations provide exact export kinds and hook signatures without inferring implementations. */
export function extractPackageReferenceSymbols(source: string, filePath: string) {
  let file = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const publicNames = new Set(
    file.statements.flatMap((statement) =>
      ts.isExportDeclaration(statement) &&
      !statement.moduleSpecifier &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
        ? statement.exportClause.elements.map(
            (element) => element.propertyName?.text || element.name.text,
          )
        : [],
    ),
  );
  const exportedLocals = file.statements
    .filter(
      (statement) =>
        "name" in statement &&
        statement.name &&
        ts.isIdentifier(statement.name as ts.Node) &&
        publicNames.has((statement.name as ts.Identifier).text) &&
        ts.canHaveModifiers(statement) &&
        !ts
          .getModifiers(statement)
          ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
    )
    .map((statement) => statement.getStart(file))
    .sort((left, right) => right - left);
  for (const offset of exportedLocals)
    source = `${source.slice(0, offset)}export ${source.slice(offset)}`;
  file = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const symbols = extractCodeReferenceSymbols(source, filePath);
  const signatures = new Set<string>();
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!declaration.type || !ts.isFunctionTypeNode(declaration.type)) continue;
        const symbol = symbols.find(({ name }) => name === declaration.name.getText(file));
        if (!symbol) continue;
        // Declaration files represent arrow-function exports as typed constants, without an initializer.
        symbol.kind = /^[A-Z]/.test(symbol.name) ? "component" : "function";
        symbol.signature = compact(`${symbol.name}: ${declaration.type.getText(file)}`, 220);
      }
      continue;
    }
    if (!ts.isFunctionDeclaration(statement) && !ts.isClassDeclaration(statement)) continue;
    const symbol = symbols.find(({ name }) => name === statement.name?.text);
    if (!symbol || signatures.has(symbol.name)) continue;
    signatures.add(symbol.name);
    if (ts.isClassDeclaration(statement)) {
      symbol.kind = statement.name?.text === "Component" ? "component" : "type";
      symbol.signature = compact(
        statement
          .getText(file)
          .split("{")[0]
          .replace(/^export\s+(?:declare\s+)?/, ""),
        220,
      );
    } else
      symbol.signature = compact(
        statement
          .getText(file)
          .replace(/^export\s+(?:declare\s+)?/, "")
          .replace(/;$/, ""),
        220,
      );
  }
  // Overloads are one export: prefer the first documented contract rather than repeated rows.
  return [...new Map(symbols.map((symbol) => [symbol.name, symbol])).values()].map((symbol) => {
    const first =
      symbols.find((entry) => entry.name === symbol.name && entry.description) ||
      symbols.find((entry) => entry.name === symbol.name)!;
    return {
      ...symbol,
      description: first.description,
      signature: first.signature,
      typeId: undefined,
    };
  });
}

const literalProperty = (node: ts.ObjectLiteralExpression, name: string) => {
  const property = node.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) && property.name.getText().replace(/["']/g, "") === name,
  );
  return property &&
    ts.isPropertyAssignment(property) &&
    ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : undefined;
};

/** Read authored guide text and real API-table titles without importing a page's component runtime. */
export function extractCodeReferenceGuide(source: string, slug: string) {
  const file = ts.createSourceFile(
    `${slug}-doc.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let title = slug;
  let description = "";
  const propsTitles = new Set<string>();
  const visit = (node: ts.Node) => {
    if (ts.isObjectLiteralExpression(node) && literalProperty(node, "slug") === slug) {
      title = literalProperty(node, "title") || title;
      description = clean(literalProperty(node, "usageLabel") || "");
    }
    if (ts.isCallExpression(node) && node.expression.getText(file) === "createGenericDocPage") {
      const config = node.arguments[0];
      if (config && ts.isObjectLiteralExpression(config)) {
        const genericTitle = literalProperty(config, "title");
        if (
          genericTitle &&
          config.properties.some(
            (property) =>
              ts.isPropertyAssignment(property) && property.name.getText(file) === "apiRows",
          )
        )
          propsTitles.add(genericTitle);
      }
    }
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      if (node.tagName.getText(file) === "ApiReference") {
        const attribute = node.attributes.properties.find(
          (property) => ts.isJsxAttribute(property) && property.name.getText(file) === "sections",
        );
        const expression =
          attribute &&
          ts.isJsxAttribute(attribute) &&
          attribute.initializer &&
          ts.isJsxExpression(attribute.initializer)
            ? attribute.initializer.expression
            : undefined;
        if (expression && ts.isArrayLiteralExpression(expression)) {
          for (const section of expression.elements) {
            if (!ts.isObjectLiteralExpression(section)) continue;
            const heading = literalProperty(section, "title");
            if (heading) propsTitles.add(heading);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return { title, description, propsTitles: [...propsTitles] };
}

/** Relate only actual local definitions; a dependency name alone is not a verified API anchor. */
export function createCodeReferenceSourceModule(
  slug: string,
  sources: { source: string; file: string }[],
  guideSource = "",
): CodeReferenceSourceModule {
  const guide = extractCodeReferenceGuide(guideSource, slug);
  const symbols = sources.flatMap(({ source, file }) => extractCodeReferenceSymbols(source, file));
  const names = new Set(symbols.filter(({ typeId }) => typeId).map(({ name }) => name));
  for (const symbol of symbols)
    symbol.typeNames = symbol.typeNames.filter((name) => names.has(name));
  const file = sources[0]?.file;
  const sourcePath = file?.match(/^packages\/core\/src\/components\/[^/]+/)?.[0] ?? file;
  return { slug, sourcePath, ...guide, symbols };
}
