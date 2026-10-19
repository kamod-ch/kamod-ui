/** Serialize a small authored JSX vocabulary into safe reference prose without executing page code. */
import ts from "@typescript/typescript6";

export function extractCodeReferenceProse(node: ts.Node, slug: string): string | undefined {
  const literal = (value: ts.Node | undefined): string | undefined => {
    if (!value) return "";
    if (ts.isStringLiteralLike(value) || ts.isNumericLiteral(value)) return value.text;
    if (ts.isParenthesizedExpression(value)) return literal(value.expression);
  };
  const children = (nodes: readonly ts.Node[]): string | undefined => {
    const parts = nodes.map(prose);
    return parts.some((part) => part === undefined) ? undefined : parts.join("");
  };
  const prose = (value: ts.Node): string | undefined => {
    if (ts.isJsxText(value)) return value.text.replace(/\s+/g, " ");
    if (ts.isJsxExpression(value)) return literal(value.expression);
    if (ts.isJsxFragment(value)) return children(value.children);
    if (!ts.isJsxElement(value)) return;
    const tag = value.openingElement.tagName.getText();
    if (!["span", "strong", "b", "code", "a"].includes(tag)) return;
    const text = children(value.children);
    if (text === undefined) return;
    if (tag === "strong" || tag === "b") return `**${text.trim()}**`;
    if (tag === "code") return `\`${text.trim()}\``;
    if (tag !== "a") return text;
    const attribute = value.openingElement.attributes.properties.find(
      (entry) => ts.isJsxAttribute(entry) && entry.name.getText() === "href",
    );
    if (!attribute || !ts.isJsxAttribute(attribute)) return;
    const initializer = attribute.initializer;
    const expression =
      initializer && ts.isJsxExpression(initializer) ? initializer.expression : initializer;
    // withBasePath is a known path wrapper. Reading its literal argument does not call it.
    const target =
      expression &&
      ts.isCallExpression(expression) &&
      expression.expression.getText() === "withBasePath"
        ? literal(expression.arguments[0])
        : literal(expression);
    if (!target || !/^(?:https?:\/\/|\/(?!\/)|#)/.test(target)) return;
    const href = target.startsWith("#") ? `/docs/${slug}/installation${target}` : target;
    return `[${text.trim()}](${href})`;
  };
  return prose(node)?.replace(/\s+/g, " ").trim();
}
