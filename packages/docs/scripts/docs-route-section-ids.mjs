import ts from "@typescript/typescript6";

const SECTION_TREE_KEYS = new Set(["sections", "exampleSections", "guideContents"]);

/** @param {ts.SourceFile} ast */
const stringLiteralText = (node) =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : undefined;

/** @param {ts.ObjectLiteralExpression} object @param {ts.SourceFile} ast */
const readIdProperty = (object, ast) => {
  for (const prop of object.properties) {
    if (!ts.isPropertyAssignment(prop) || prop.name.getText(ast) !== "id") continue;
    return stringLiteralText(prop.initializer);
  }
};

/** @param {ts.ArrayLiteralExpression} array @param {ts.SourceFile} ast @param {Set<string>} ids */
const collectIdsFromSectionTree = (array, ast, ids) => {
  for (const element of array.elements) {
    if (!ts.isObjectLiteralExpression(element)) continue;
    const id = readIdProperty(element, ast);
    if (id) ids.add(id);
    for (const prop of element.properties) {
      if (
        !ts.isPropertyAssignment(prop) ||
        prop.name.getText(ast) !== "children" ||
        !ts.isArrayLiteralExpression(prop.initializer)
      ) {
        continue;
      }
      collectIdsFromSectionTree(prop.initializer, ast, ids);
    }
  }
};

/** @param {ts.Node} ast */
const collectExtraSectionIds = (ast, ids) => {
  const visit = (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.length === 1 &&
      ts.isIdentifier(node.declarationList.declarations[0].name)
    ) {
      const name = node.declarationList.declarations[0].name.text;
      const init = node.declarationList.declarations[0].initializer;
      if (name === "UI_MOTION_EXAMPLE_SECTION_IDS" && ts.isArrayLiteralExpression(init)) {
        collectIdsFromSectionTree(init, ast, ids);
        return;
      }
      if (name === "iconsGuideLegacyEnding" && ts.isObjectLiteralExpression(init)) {
        const id = readIdProperty(init, ast);
        if (id) ids.add(id);
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
};

/**
 * Section route IDs from page metadata trees only — not demo data or snippet literals.
 * @param {string} source
 * @param {string} file
 */
export const collectSectionIds = (source, file) => {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const ids = new Set();

  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      SECTION_TREE_KEYS.has(node.name.getText(ast)) &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      collectIdsFromSectionTree(node.initializer, ast, ids);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  collectExtraSectionIds(ast, ids);
  return [...ids];
};
