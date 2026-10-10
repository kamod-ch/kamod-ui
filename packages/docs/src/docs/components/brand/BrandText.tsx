import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import {
  BrandDockerIcon,
  BrandFigmaIcon,
  BrandGithubIcon,
  BrandGitIcon,
  BrandJavascriptIcon,
  BrandNextjsIcon,
  BrandNodejsIcon,
  BrandNpmIcon,
  BrandPnpmIcon,
  BrandReactIcon,
  BrandTailwindIcon,
  BrandTypescriptIcon,
  BrandViteIcon,
  BrandYarnIcon,
} from "@kamod-ch/icons/tabler/outline";
import { type ComponentChildren, cloneElement, Fragment, type VNode } from "preact";
import { InlineCodeLink, InlineReferenceCode } from "../InlineCodeLink";
import { inlineReference, proseReferencePattern } from "../inline-reference-catalog";
import { brandLabel, brandName, brandReferences, industryProsePattern } from "./brand-references";
import { KamodReference } from "./KamodReference";
import { hasKamodNamespace, kamodReferenceHref, kamodReferencePattern } from "./kamod-references";

const brandIcons = {
  Preact: BrandReactIcon,
  React: BrandReactIcon,
  TypeScript: BrandTypescriptIcon,
  Tailwind: BrandTailwindIcon,
  JavaScript: BrandJavascriptIcon,
  GitHub: BrandGithubIcon,
  Git: BrandGitIcon,
  Vite: BrandViteIcon,
  pnpm: BrandPnpmIcon,
  npm: BrandNpmIcon,
  Yarn: BrandYarnIcon,
  "Node.js": BrandNodejsIcon,
  "Next.js": BrandNextjsIcon,
  Figma: BrandFigmaIcon,
  Docker: BrandDockerIcon,
};

export const brandPattern = new RegExp(
  `${industryProsePattern}|${kamodReferencePattern.source}|${proseReferencePattern.source}`,
  "g",
);
export const isBrandLabel = (text: string) =>
  hasKamodNamespace(text) || Boolean(kamodReferenceHref(text)) || Boolean(brandName(text));

/** A decorative brand mark and its official destination inherit their surrounding typography. */
export function BrandLink({ children, link = true }: { children: string; link?: boolean }) {
  if (hasKamodNamespace(children) || kamodReferenceHref(children)) {
    const href = kamodReferenceHref(children);
    return (
      <KamodReference
        href={link ? href : undefined}
        label={children}
        showArrow={Boolean(href) || !link}
      >
        {children}
      </KamodReference>
    );
  }
  const name = brandName(children);
  if (!name) return children;
  const Icon = brandIcons[name];
  const { href } = brandReferences[name];
  const Tag = link ? "a" : "span";
  return (
    <Tag class="docs-brand-link" href={link ? href : undefined}>
      <Icon class="docs-brand-icon" size="1em" aria-hidden="true" />
      {brandLabel(children)}
      <ArrowUpRightIcon class="docs-reference-arrow" size="1em" aria-hidden="true" />
    </Tag>
  );
}

export function ReferenceLink({ children }: { children: string }) {
  const reference = inlineReference(children);
  if (reference) return <InlineCodeLink href={reference.href}>{children}</InlineCodeLink>;
  return isBrandLabel(children) ? (
    <code>
      <BrandLink>{children}</BrandLink>
    </code>
  ) : (
    children
  );
}

function brandWords(text: string): ComponentChildren {
  const matches = [...text.matchAll(brandPattern)];
  if (!matches.length) return text;
  const parts: ComponentChildren[] = [];
  let end = 0;
  for (const match of matches) {
    parts.push(
      text.slice(end, match.index),
      <ReferenceLink key={match.index}>{match[0]}</ReferenceLink>,
    );
    end = match.index + match[0].length;
  }
  parts.push(text.slice(end));
  return parts;
}

/**
 * Decorate authored prose without DOM scanning, effects or changing its copied text.
 * Existing links, controls, custom components and source code remain ownership boundaries.
 */
export function BrandText({ children }: { children: ComponentChildren }): ComponentChildren {
  if (typeof children === "string") return brandWords(children);
  if (Array.isArray(children)) return children.map((child) => BrandText({ children: child }));
  if (!children || typeof children !== "object" || !("type" in children)) return children;
  const node = children as VNode<{
    children?: ComponentChildren;
    "aria-hidden"?: boolean | string;
    href?: string;
    class?: string;
  }>;
  if (node.props["aria-hidden"] || (node.type !== Fragment && typeof node.type !== "string"))
    return node;
  // Respect explicit destinations (including section anchors) and existing decorated links.
  if (node.type === "a") {
    const child = node.props.children;
    const label =
      typeof child === "string"
        ? child
        : child && typeof child === "object" && "type" in child && child.type === "code"
          ? (child.props as { children?: ComponentChildren }).children
          : undefined;
    if (typeof label !== "string" || (!inlineReference(label) && !isBrandLabel(label))) return node;
    return cloneElement(node, {
      class: `${node.props.class ?? ""} docs-inline-code-link`.trim(),
      children: inlineReference(label) ? (
        <InlineReferenceCode>{label}</InlineReferenceCode>
      ) : (
        <code>
          <BrandLink link={false}>{label}</BrandLink>
        </code>
      ),
    });
  }
  if (node.type === "code") {
    const label = node.props.children;
    if (typeof label !== "string") return node;
    const reference = inlineReference(label);
    if (reference) return <InlineCodeLink href={reference.href}>{label}</InlineCodeLink>;
    return isBrandLabel(label)
      ? cloneElement(node, { children: <BrandLink>{label}</BrandLink> })
      : node;
  }
  if (
    typeof node.type === "string" &&
    !/^(p|span|strong|em|b|i|small|div|section|aside|ul|ol|li|dl|dt|dd|table|thead|tbody|tr|td|th|blockquote)$/.test(
      node.type,
    )
  )
    return node;
  return cloneElement(node, { children: BrandText({ children: node.props.children }) });
}
