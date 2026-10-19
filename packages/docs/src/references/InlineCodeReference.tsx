import type { ComponentChildren, HTMLAttributes } from "preact";
import type { InlineCodeSize } from "../docs/components/InlineCodeLink";
import { inlineSourceReference, referenceAttributes } from "./inline-references";
import type { CodeReferenceHelpRequest } from "./types";

/** Private inline equivalent of a source token: exact text, native navigation and lazy shared help. */
export function InlineCodeReference({
  children,
  href,
  reference,
  size,
  content,
  codeProps,
}: {
  children: string;
  href?: string;
  reference?: CodeReferenceHelpRequest;
  size?: InlineCodeSize;
  content?: ComponentChildren;
  codeProps?: Omit<HTMLAttributes<HTMLElement>, "children"> & {
    "data-path-middle"?: string;
  };
}): ComponentChildren {
  const request = reference ?? inlineSourceReference(children, href);
  return request ? (
    <a
      class="kamod-code-reference docs-inline-source-reference transition-all"
      href={request.href}
      {...referenceAttributes(request)}
    >
      <code {...codeProps} data-inline-code-size={size}>
        {content ?? children}
      </code>
    </a>
  ) : (
    <code data-inline-code-size={size}>{children}</code>
  );
}
