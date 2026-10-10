import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ComponentIcon,
  GlobeIcon,
  HardDriveIcon,
  HashIcon,
  LanguagesIcon,
  LayersIcon,
  MousePointerClickIcon,
  PackageIcon,
  PanelLeftIcon,
  PanelsTopLeftIcon,
  TextCursorInputIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { RouteIcon, ToggleLeftIcon } from "@kamod-ch/icons/tabler/outline";
import { withBasePath } from "../../base-path";
import { hasKamodNamespace } from "./brand/kamod-references";
import { inlineReference } from "./inline-reference-catalog";
import { type PackageApiIcon, packageApiReferences } from "./package-api-references";

const apiIcons = {
  toggle: ToggleLeftIcon,
  counter: HashIcon,
  storage: HardDriveIcon,
  language: LanguagesIcon,
  state: RouteIcon,
} satisfies Record<PackageApiIcon, typeof HashIcon>;

export type InlineCodeSize = "compact" | "regular";

/** Shared content also decorates authored links without nesting another anchor. */
export function InlineReferenceCode({
  children,
  size,
}: {
  children: string;
  size?: InlineCodeSize;
}) {
  const reference = inlineReference(children);
  const label = reference?.label ?? children;
  const api = reference?.kind === "api" ? packageApiReferences[label] : undefined;
  const Icon = hasKamodNamespace(children)
    ? BrandGithubIcon
    : api
      ? apiIcons[api.icon]
      : reference?.kind === "block"
        ? LayersIcon
        : reference?.kind === "package"
          ? PackageIcon
          : reference?.kind === "guide"
            ? BookOpenIcon
            : reference?.kind === "external"
              ? GlobeIcon
              : label.startsWith("Button")
                ? MousePointerClickIcon
                : /^(Input|Textarea|Field|Label)/.test(label)
                  ? TextCursorInputIcon
                  : label.startsWith("Sidebar")
                    ? PanelLeftIcon
                    : /^(Dialog|AlertDialog|Drawer|Sheet|Popover)/.test(label)
                      ? PanelsTopLeftIcon
                      : ComponentIcon;
  return (
    <code class="docs-reference-code" data-inline-code-size={size}>
      <Icon class="docs-reference-icon" size="1em" aria-hidden="true" />
      <span>{label}</span>
      <ArrowUpRightIcon class="docs-reference-arrow" size="1em" aria-hidden="true" />
    </code>
  );
}

/** A reference with the same quiet code surface as the surrounding documentation. */
export function InlineCodeLink({
  href,
  children,
  hint,
  title,
  size,
}: {
  href: string;
  children: string;
  hint?: string;
  title?: string;
  /** Omit to use the shared prose or compact-context size. */
  size?: InlineCodeSize;
}) {
  const link = (
    <a
      class="docs-inline-code-link"
      href={href.startsWith("/") ? withBasePath(href) : href}
      title={title}
    >
      <InlineReferenceCode size={size}>{children}</InlineReferenceCode>
    </a>
  );
  return hint ? (
    <span class="docs-code-reference">
      {link}
      <small>{hint}</small>
    </span>
  ) : (
    link
  );
}
