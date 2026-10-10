import type { HTMLAttributes } from "preact";
import { BrandText } from "./brand/BrandText";
import { KamodReference } from "./brand/KamodReference";
import { hasKamodNamespace, kamodReferenceHref } from "./brand/kamod-references";
import { fileIconForPath, fileTypeForPath } from "./file-icon";
import { InlineCodeLink, type InlineCodeSize } from "./InlineCodeLink";
import { inlineReference } from "./inline-reference-catalog";

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
  /** Disable inside an existing link or interactive control. */
  link?: boolean;
  /** File inventories also contain extensionless names such as LICENSE. */
  file?: boolean;
  /** Explain the file type on code-header icons, including keyboard focus. */
  fileTypeTooltip?: boolean;
  /** Size of a linked inline path; file headers keep their own typography. */
  size?: InlineCodeSize;
};

/**
 * Render an exact path with only its middle eligible for ellipsis.
 * CSS handles sizing without observers; exceptionally long endpoints wrap instead of being hidden.
 */
export function PathDisplay({
  path,
  as: Tag = "code",
  class: className,
  link = true,
  file = false,
  fileTypeTooltip = false,
  size,
  ...props
}: PathDisplayProps) {
  const { root, middle, end } = splitDisplayPath(path);
  const href = kamodReferenceHref(path);
  const kamod = Boolean(href) || hasKamodNamespace(path);
  const fileIcon = !kamod && (file || (!/[\s<>"'`{}=()]/.test(path) && /\.[a-z\d]+$/i.test(path)));
  const FileIcon = fileIconForPath(path);
  const fileType = fileTypeTooltip ? fileTypeForPath(path) : undefined;
  const parts = (
    <>
      {root && <span data-path-part="root">{root}</span>}
      {middle && <span data-path-part="middle">{middle}</span>}
      {end && <span data-path-part="end">{end}</span>}
    </>
  );
  return (
    <Tag
      {...props}
      class={`path-display ${kamod ? "docs-kamod-path" : ""} ${className ?? ""}`}
      title={(href && link) || fileTypeTooltip ? undefined : path}
      dir="ltr"
      data-path-middle={!kamod && middle ? "true" : undefined}
      data-path-icon={fileIcon ? "true" : undefined}
      data-inline-code-size={size}
    >
      {fileIcon && (
        <FileIcon
          class="path-display-icon"
          size="0.9em"
          aria-hidden={fileTypeTooltip ? undefined : true}
          role={fileTypeTooltip ? "img" : undefined}
          tabIndex={fileTypeTooltip ? 0 : undefined}
          aria-label={fileType}
          data-tooltip={fileType}
        />
      )}
      {kamod ? (
        <KamodReference
          href={link ? href : undefined}
          label={path}
          showArrow={Boolean(href) || !link}
        >
          <span class="path-display" data-path-middle={middle ? "true" : undefined}>
            {parts}
          </span>
        </KamodReference>
      ) : (
        parts
      )}
    </Tag>
  );
}

/** Inline prose keeps normal code styling unless its entire value is a standalone path. */
export function InlineCode({ children }: { children: string }) {
  const reference = inlineReference(children);
  if (reference) return <InlineCodeLink href={reference.href}>{children}</InlineCodeLink>;
  return isDisplayPath(children) ? (
    <PathDisplay path={children} />
  ) : (
    <BrandText>
      <code>{children}</code>
    </BrandText>
  );
}
