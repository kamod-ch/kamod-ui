import foundationSource from "virtual:kamod-theming-guide";
import { withBasePath } from "../../base-path";
import { GuideArticle } from "../components/GuideArticle";
import { LibraryPageHeader } from "../components/LibraryPageHeader";
import { PathDisplay } from "../components/PathDisplay";
import { ColorThemeGallery } from "../guides/color-themes/ColorThemeGallery";
import { createComponentThemingSections } from "../guides/component-theming";
import { ThemingOutro } from "../guides/ThemingOutro";
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
      children: [{ id: "tailwind-preset", label: "Optional Tailwind Preset" }],
    },
    {
      id: "color-theme-presets",
      title: "Color Theme Presets",
      text: "Explore eight application palettes through complete color references and local playgrounds, then compare 24 source-backed Prism syntax themes with scoped reader recipes.",
      children: [
        { id: "color-theme-kamod", label: "Kamod" },
        { id: "color-theme-shadcn", label: "shadcn (Geist)" },
        { id: "color-theme-ocean", label: "Ocean" },
        { id: "color-theme-sunset", label: "Sunset" },
        { id: "color-theme-cursor-warm", label: "Cursor warm" },
        { id: "color-theme-voltage", label: "Voltage" },
        { id: "color-theme-watson", label: "Watson" },
        { id: "color-theme-professional", label: "Professional (Electronics)" },
        {
          id: "prism-color-themes",
          label: "Prism syntax themes",
          collapsible: true,
          children: [
            { id: "prism-theme-default", label: "Prism Default" },
            { id: "prism-theme-coy", label: "Coy" },
            { id: "prism-theme-dark", label: "Prism Dark" },
            { id: "prism-theme-funky", label: "Funky" },
            { id: "prism-theme-okaidia", label: "Okaidia" },
            { id: "prism-theme-solarized-light", label: "Solarized Light" },
            { id: "prism-theme-tomorrow", label: "Tomorrow Night Eighties" },
            { id: "prism-theme-twilight", label: "Twilight" },
            { id: "prism-theme-dracula", label: "Dracula" },
            { id: "prism-theme-nord", label: "Nord" },
            { id: "prism-theme-night-owl", label: "Night Owl" },
            { id: "prism-theme-one-dark", label: "One Dark" },
            { id: "prism-theme-one-light", label: "One Light" },
            { id: "prism-theme-ghcolors", label: "GHColors" },
            { id: "prism-theme-vsc-dark-plus", label: "VS Code Dark+" },
            { id: "prism-theme-material-dark", label: "Material Dark" },
            { id: "prism-theme-material-light", label: "Material Light" },
            { id: "prism-theme-material-oceanic", label: "Material Oceanic" },
            { id: "prism-theme-synthwave84", label: "Synthwave ’84" },
            { id: "prism-theme-gruvbox-dark", label: "Gruvbox Dark" },
            { id: "prism-theme-gruvbox-light", label: "Gruvbox Light" },
            { id: "prism-theme-a11y-dark", label: "a11y Dark" },
            { id: "prism-theme-duotone-light", label: "Duotone Light" },
            { id: "prism-theme-atom-dark", label: "Atom Dark" },
          ],
        },
        { id: "prism-theme-resources", label: "Prism sources & credits" },
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
      id: "api-reference",
      title: "Theme Runtime Reference",
      text: "Public theme exports, provider options and persistence behavior.",
    },
    {
      id: "accessibility",
      title: "Troubleshoot and Verify",
      text: "Check production styles, contrast, focus and saved appearance choices.",
    },
    {
      id: "finish-with-a-theme-review",
      title: "From Palette to Product",
      text: "Keep the core decisions in view, review your app and choose what to build next.",
    },
  ],
  guideContents: contents,
  guideTitle: title,
  renderMain: () => (
    <GuideArticle
      sections={sections}
      sectionContent={{
        "color-theme-presets": <ColorThemeGallery />,
        "finish-with-a-theme-review": <ThemingOutro />,
      }}
      header={
        <LibraryPageHeader
          parent={{ label: "Components", href: "/docs/components" }}
          label="Theming"
          eyebrow="Shared design foundation"
          title={title}
          description={
            <>
              <p>
                Connect <code>Tailwind CSS v4</code> and <PathDisplay path={"@kamod-ch/themes"} />{" "}
                once, then share colors, typography and appearance preferences across your
                interface. Start with a preset, refine its semantic roles and keep Light, Dark and
                System working together. For copied layouts, continue with{" "}
                <a href={withBasePath("/blocks/theming")}>Block Theming</a>.
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
