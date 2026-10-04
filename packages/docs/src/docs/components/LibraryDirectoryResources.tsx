import {
  ArrowUpRightIcon,
  CheckIcon,
  CodeIcon,
  ComponentIcon,
  PaletteIcon,
} from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import { LibraryHeading } from "./LibraryHeading";
import { LibrarySection } from "./LibrarySection";
import { LibrarySourceResources } from "./LibrarySourceResources";
import { PathDisplay } from "./PathDisplay";

export const libraryResourceContents = {
  id: "library-guides-title",
  label: "Make it your own",
  children: [
    { id: "connect-styles", label: "Connect your styles" },
    { id: "customize-theme", label: "Customize the theme" },
    { id: "explore-icons", label: "Explore the icon library" },
    { id: "library-source-title", label: "Work with the source" },
  ],
};

const guides = [
  {
    id: "connect-styles",
    title: "Connect your styles",
    check: "Borders, spacing and page surfaces render with your app’s styles.",
    action: "CSS setup",
    href: "/docs/theming/css-setup",
    icon: CodeIcon,
    label: "Foundation",
    description: (
      <>
        Connect <code>Tailwind CSS</code>, load the global styles and check source detection before
        your first render. Keep the stylesheet at your app’s entry point so every page shares the
        same foundation. When you copy a block into <PathDisplay path={"src/components"} />, make
        sure its files are included in source detection so the classes used by the layout are
        generated.
      </>
    ),
  },
  {
    id: "customize-theme",
    title: "Customize the theme",
    check: "Text, controls and focus indicators stay readable in both modes.",
    action: "Theme guide",
    href: "/docs/theming/usage",
    icon: PaletteIcon,
    label: "Appearance",
    description: (
      <>
        Choose a preset, explore light and dark modes, then adjust shared tokens with{" "}
        <PathDisplay path={"@kamod-ch/themes"} />. Update <code>--primary</code> and other semantic
        tokens to carry your brand across the whole interface. Prefer shared tokens for recurring
        colors instead of restyling every component separately, and check muted text, borders and
        focus rings against your page background.
      </>
    ),
  },
  {
    id: "explore-icons",
    title: "Explore the icon library",
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
        calls for an icon-only button, give it an <code>aria-label</code> that describes the action.
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
      title="Make it your own"
      label="Setup & theming"
      meta="Shared foundations"
      description={
        <>
          <p>
            <strong>Set up once, reuse everywhere.</strong> These guides apply to individual
            components and complete blocks. Start with the global stylesheet and{" "}
            <code>Tailwind CSS</code> source detection, then choose your theme and finish with
            consistent icons. Following this order makes it easier to tell a setup issue from a
            change you want to make to the design.
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
          <article key={href} class="library-guide-card">
            <span class="library-guide-eyebrow">
              <Icon size={17} aria-hidden="true" />
              {label}
              <span class="library-guide-step">0{index + 1}</span>
            </span>
            <LibraryHeading id={id} level={3}>
              {title}
            </LibraryHeading>
            <p>{description}</p>
            <div class="library-guide-footer">
              <span>
                <CheckIcon size={13} aria-hidden="true" />
                <span>{check}</span>
              </span>
              <a class="library-guide-action" href={withBasePath(href)}>
                {action}
                <ArrowUpRightIcon size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </nav>
      <aside class="library-guide-check">
        <CheckIcon size={17} aria-hidden="true" />
        <p>
          <strong>Check in your app.</strong> Try real content, a narrow viewport and keyboard
          navigation before shipping. Use the{" "}
          <a href={withBasePath("/docs/theming/usage")}>theme guide</a> to check both{" "}
          <code>light</code> and <code>dark</code> appearances. Replace sample routes and service
          callbacks with your own, then check empty states and longer labels.{" "}
          <strong>Keep the shared behavior; make the content yours.</strong>
        </p>
      </aside>
      <LibrarySourceResources />
    </LibrarySection>
  );
}
