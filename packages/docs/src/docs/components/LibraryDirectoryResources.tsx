import {
  ArrowUpRightIcon,
  CheckIcon,
  CodeIcon,
  ComponentIcon,
  PaletteIcon,
} from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { linkTitle } from "../../link-title";
import { BrandText } from "./brand/BrandText";
import { DocsCallout } from "./DocsCallout";
import { LibrarySection } from "./LibrarySection";
import { LibrarySourceResources } from "./LibrarySourceResources";
import { PathDisplay } from "./PathDisplay";

export const libraryResourceContents = {
  id: "library-guides-title",
  label: "Make It Your Own",
  children: [
    { id: "connect-styles", label: "Connect Your Styles" },
    { id: "customize-theme", label: "Customize the Theme" },
    { id: "explore-icons", label: "Explore the Icon Library" },
    { id: "library-source-title", label: "Work with the Source" },
  ],
};

const guides = [
  {
    id: "connect-styles",
    title: "Connect Your Styles",
    check: "Borders, spacing and page surfaces render with your app’s styles.",
    action: "CSS setup",
    href: "/docs/theming/css-setup",
    icon: CodeIcon,
    label: "Foundation",
    description: (
      <>
        Connect{" "}
        <BrandText>
          <code>Tailwind CSS</code>
        </BrandText>
        , <strong>load the global styles and check source detection</strong> before your first
        render. Keep the stylesheet at your app’s entry point so every page shares the same
        foundation. When you copy a block into <PathDisplay path={"src/components"} />, make sure
        its files are included in source detection so the classes used by the layout are generated.
      </>
    ),
  },
  {
    id: "customize-theme",
    title: "Customize the Theme",
    check: "Text, controls and focus indicators stay readable in both modes.",
    action: "Theme guide",
    href: "/docs/theming/usage",
    icon: PaletteIcon,
    label: "Appearance",
    description: (
      <>
        Choose a preset, explore light and dark modes, then adjust shared tokens with{" "}
        <PathDisplay path={"@kamod-ch/themes"} />. Update <code>--primary</code> and other semantic
        tokens to carry your brand across the whole interface. Prefer{" "}
        <strong>shared tokens for recurring colors</strong> instead of restyling every component
        separately, and check muted text, borders and focus rings against your page background.
      </>
    ),
  },
  {
    id: "explore-icons",
    title: "Explore the Icon Library",
    check: "Icon-only buttons have clear accessible names.",
    action: "Icon guide",
    href: "/docs/icons-package/installation",
    icon: ComponentIcon,
    label: "Details",
    description: (
      <>
        Complete navigation and actions with typed <PathDisplay path={"@kamod-ch/icons"} /> that
        inherit your interface’s colors. Import the icons you need and keep their size and stroke
        consistent across related controls. Pair unfamiliar actions with visible labels; when space
        calls for an icon-only button, give it an <strong>accessible name</strong> with{" "}
        <code>aria-label</code> that describes the action.
      </>
    ),
  },
];

/** Shared next steps keep setup guidance useful on both library entry points. */
export function LibraryDirectoryResources({ guide = false }: { guide?: boolean }) {
  return (
    <LibrarySection
      guide={guide}
      id="library-guides"
      class="library-directory-resources"
      headingId="library-guides-title"
      title="Make It Your Own"
      label="Setup & Theming"
      meta="Shared foundations"
      description={
        <>
          <p>
            <BrandText>
              <strong>Set Up Once, Reuse Everywhere.</strong> These guides apply to individual
              components and complete blocks. Start with the global stylesheet and{" "}
              <code>Tailwind CSS</code> source detection, then choose your theme and finish with
              consistent icons. Following this order makes it easier to tell a setup issue from a
              change you want to make to the design.
            </BrandText>
          </p>
          <p>
            Keep your app’s existing conventions and connect the shared foundation before overriding
            local classes. Each guide below focuses on one part of that setup and includes a quick
            visual check. Once the basics look right, use real content to review spacing, contrast
            and keyboard behavior in both <code>light</code> and <code>dark</code> modes.
          </p>
        </>
      }
    >
      <nav aria-label="Library guides">
        {guides.map(({ id, title, href, icon: Icon, label, description, check, action }, index) => (
          <DocsCallout
            key={href}
            headingId={id}
            title={<BlockHeadingLink id={id}>{title}</BlockHeadingLink>}
            eyebrow={label}
            icon={<Icon />}
            meta={<span class="docs-callout-index">0{index + 1}</span>}
            footer={
              <>
                <span class="docs-callout-check">
                  <CheckIcon size={14} aria-hidden="true" />
                  {check}
                </span>
                <a class="docs-callout-action" href={withBasePath(href)}>
                  {linkTitle(action)}
                  <ArrowUpRightIcon size={14} aria-hidden="true" />
                </a>
              </>
            }
          >
            <p>{description}</p>
          </DocsCallout>
        ))}
      </nav>
      <DocsCallout
        class="docs-callout-spaced"
        title="Make the content yours"
        icon={<CheckIcon />}
        eyebrow="Before you ship"
      >
        <p>
          <strong>Check in Your App.</strong> Try real content, a narrow viewport and keyboard
          navigation before shipping. Use the{" "}
          <a href={withBasePath("/docs/theming/usage")}>Theme Guide</a> to check both{" "}
          <code>light</code> and <code>dark</code> appearances. Replace sample routes and service
          callbacks with your own, then check empty states and longer labels.{" "}
          <strong>Keep the Shared Behavior; Make the Content Yours.</strong>
        </p>
      </DocsCallout>
      <LibrarySourceResources />
    </LibrarySection>
  );
}
