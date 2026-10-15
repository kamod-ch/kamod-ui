import foundationSource from "virtual:kamod-theming-guide";
import { withBasePath } from "../../base-path";
import { GuideArticle } from "../components/GuideArticle";
import { LibraryPageHeader } from "../components/LibraryPageHeader";
import { PathDisplay } from "../components/PathDisplay";
import { ColorThemeGallery } from "../guides/color-themes/ColorThemeGallery";
import { createComponentThemingSections } from "../guides/component-theming";
import type { DocPageModule } from "../types";

const title = "Theming & Tailwind for your entire app";
const sections = createComponentThemingSections(foundationSource);
const contents = sections.map(({ id, title, children }) => ({ id, label: title, children }));

export const themingDocPage: DocPageModule = {
  slug: "theming",
  title: "Theming",
  command: "pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals",
  usageLabel:
    "Use shared tokens, built-in presets and light/dark controls across Preact components.",
  packagePath: "@kamod-ch/themes",
  exampleSectionIds: [],
  // Keep established section routes discoverable by the static route generator.
  sections: [
    {
      id: "installation",
      title: "Choose Your Theme Foundation",
      text: "Install missing packages and choose one theme CSS entry.",
    },
    {
      id: "usage",
      title: "Style Components through Their Roles",
      text: "Combine component variants, local layout utilities and semantic colors.",
    },
    {
      id: "css-setup",
      title: "Set Up Tailwind and Theme CSS",
      text: "Connect global styles and source detection.",
    },
    {
      id: "color-theme-presets",
      title: "Color Theme Presets",
      text: "Compare eight design directions through light/dark composition studies, type, shape and practical guidance.",
      children: [
        { id: "color-theme-kamod", label: "Kamod" },
        { id: "color-theme-shadcn", label: "shadcn (Geist)" },
        { id: "color-theme-ocean", label: "Ocean" },
        { id: "color-theme-sunset", label: "Sunset" },
        { id: "color-theme-cursor-warm", label: "Cursor warm" },
        { id: "color-theme-voltage", label: "Voltage" },
        { id: "color-theme-watson", label: "Watson" },
        { id: "color-theme-professional", label: "Professional (Electronics)" },
        { id: "themes-on-this-page", label: "How Themes Work on This Page" },
      ],
    },
    {
      id: "token-overrides",
      title: "Shape Your Design with Tokens",
      text: "Pair surfaces and foregrounds, then refine presets, typography and radius.",
    },
    {
      id: "provider-controls",
      title: "Manage Appearance Preferences",
      text: "Connect preset and scheme controls and keep the first render consistent.",
    },
    {
      id: "tailwind-preset",
      title: "Optional Tailwind Preset",
      text: "Use configuration-based integration only when your project needs it.",
    },
    {
      id: "api-reference",
      title: "Theme Runtime Reference",
      text: "Public theme exports, provider options and persistence behavior.",
    },
    {
      id: "accessibility",
      title: "Troubleshoot and Verify",
      text: "Check production styles, contrast, focus and saved appearance choices.",
    },
  ],
  guideContents: contents,
  guideTitle: title,
  renderMain: () => (
    <GuideArticle
      sections={sections}
      sectionContent={{ "color-theme-presets": <ColorThemeGallery /> }}
      header={
        <LibraryPageHeader
          parent={{ label: "Components", href: "/docs/components" }}
          label="Theming"
          eyebrow="Shared design foundation"
          title={title}
          description={
            <>
              <p>
                Give buttons, forms, cards and menus a consistent foundation with{" "}
                <code>Tailwind CSS v4</code>, semantic tokens and{" "}
                <PathDisplay path={"@kamod-ch/themes"} />. Connect your stylesheet once, then choose{" "}
                <strong>shared colors, typography and appearance preferences</strong> that work
                across the interface. Start with a built-in preset and refine its roles rather than
                repeating individual color values in every component.
              </p>
              <p>
                Start with the foundation, compare the eight design studies, then refine the tokens
                and connect runtime preferences. This reference serves{" "}
                <strong>components and complete blocks</strong>; use the{" "}
                <a href={withBasePath("/blocks/theming")}>Block Theming Guide</a> for copied-source
                checks, sidebar surfaces and preview behavior. Keep pairs such as{" "}
                <code>--card</code> and <code>--card-foreground</code> together. For a compact
                appearance control, see{" "}
                <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle</a>.
              </p>
            </>
          }
        >
          <nav class="theme-reading-path" aria-label="Theming guide reading paths">
            <a href="#installation">
              <span>01</span>Choose a foundation
            </a>
            <a href="#color-theme-presets">
              <span>02</span>Explore the palettes
            </a>
            <a href="#token-overrides">
              <span>03</span>Understand the tokens
            </a>
            <a href="#provider-controls">
              <span>04</span>Connect preferences
            </a>
          </nav>
        </LibraryPageHeader>
      }
    />
  ),
};
