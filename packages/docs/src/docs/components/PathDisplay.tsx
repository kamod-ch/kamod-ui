import type { HTMLAttributes } from "preact";

/** Split without normalizing: separators, relative prefixes and trailing slashes remain copyable. */
export function splitDisplayPath(path: string) {
  const root = path.match(/^(?:[\\/]+|(?:\.{1,2}|[A-Za-z]:)[\\/]+)?[^\\/]+[\\/]+/)?.[0] ?? "";
  const endIndex = path.replace(/[\\/]+$/, "").search(/[\\/][^\\/]*$/);
  if (!root || endIndex < root.length) return { root, middle: "", end: path.slice(root.length) };
  return { root, middle: path.slice(root.length, endIndex), end: path.slice(endIndex) };
}

/** Identify standalone paths in prose, never commands, URLs or source expressions. */
export function isDisplayPath(value: string) {
  return (
    !/[\s<>"'`{}=()]/.test(value) &&
    !value.includes("://") &&
    /^(?:@[^/\\]*[/\\]|\.{0,2}[/\\]|[A-Za-z]:[/\\]|(?:src|packages|public|components|assets|node_modules|data|branding|auth|shared|app|tests|test|lib)[/\\])/.test(
      value,
    )
  );
}

type PathDisplayProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  path: string;
  /** Use a span where the surrounding UI already provides code typography. */
  as?: "code" | "span";
};

/**
 * Render an exact path with only its middle eligible for ellipsis.
 * CSS handles sizing without observers; exceptionally long endpoints wrap instead of being hidden.
 */
export function PathDisplay({
  path,
  as: Tag = "code",
  class: className,
  ...props
}: PathDisplayProps) {
  const { root, middle, end } = splitDisplayPath(path);
  return (
    <Tag
      {...props}
      class={`path-display ${className ?? ""}`}
      title={path}
      dir="ltr"
      data-path-middle={middle ? "true" : undefined}
    >
      {root && <span data-path-part="root">{root}</span>}
      {middle && <span data-path-part="middle">{middle}</span>}
      {end && <span data-path-part="end">{end}</span>}
    </Tag>
  );
}

/** Inline prose keeps normal code styling unless its entire value is a standalone path. */
export function InlineCode({ children }: { children: string }) {
  return isDisplayPath(children) ? <PathDisplay path={children} /> : <code>{children}</code>;
}
