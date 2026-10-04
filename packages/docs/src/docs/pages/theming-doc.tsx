import foundationSource from "virtual:kamod-theming-guide";
import { withBasePath } from "../../base-path";
import { GuideArticle } from "../components/GuideArticle";
import { LibraryJumpLinks } from "../components/LibraryJumpLinks";
import { LibraryPageHeader } from "../components/LibraryPageHeader";
import { PathDisplay } from "../components/PathDisplay";
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
  // Keep established section routes discoverable by the static route generator.
  sections: [
    {
      id: "installation",
      title: "Choose your theme foundation",
      text: "Install missing packages and choose one theme CSS entry.",
    },
    {
      id: "usage",
      title: "Style components through their roles",
      text: "Combine component variants, local layout utilities and semantic colors.",
    },
    {
      id: "css-setup",
      title: "Set up Tailwind and theme CSS",
      text: "Connect global styles and source detection.",
    },
    {
      id: "token-overrides",
      title: "Shape your design with tokens",
      text: "Pair surfaces and foregrounds, then refine presets, typography and radius.",
    },
    {
      id: "provider-controls",
      title: "Manage appearance preferences",
      text: "Connect preset and scheme controls and keep the first render consistent.",
    },
    {
      id: "tailwind-preset",
      title: "Optional Tailwind preset",
      text: "Use configuration-based integration only when your project needs it.",
    },
    {
      id: "api-reference",
      title: "Theme runtime reference",
      text: "Public theme exports, provider options and persistence behavior.",
    },
    {
      id: "accessibility",
      title: "Troubleshoot and verify",
      text: "Check production styles, contrast, focus and saved appearance choices.",
    },
  ],
  guideContents: contents,
  guideTitle: title,
  renderMain: () => (
    <GuideArticle
      id="component-theming"
      title={title}
      sections={sections}
      contents={contents}
      header={
        <LibraryPageHeader
          parent={{ label: "Components", href: "/docs/components" }}
          label="Theming"
          eyebrow="Shared design foundation"
          focus="Configure · Customize · Check"
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
                This is the shared reference for <strong>components and complete blocks</strong>.
                Follow the CSS setup, token and runtime steps here once, then use the{" "}
                <a href={withBasePath("/blocks/theming")}>block theming guide</a> for copied-source
                checks, sidebar surfaces and preview behavior. There is no separate block theme to
                install. Add a{" "}
                <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle</a> for a
                compact Light/Dark action, or offer <strong>Light, Dark and System</strong> through
                your own settings. Keep paired tokens such as <code>--card</code> and{" "}
                <code>--card-foreground</code> readable, preserve focus feedback and verify the
                first render as well as saved preferences.
              </p>
            </>
          }
        >
          <LibraryJumpLinks
            class="block-guide-switcher"
            label="Theming guide sections"
            reference={{
              label: "Theme Toggle",
              href: withBasePath("/docs/theme-toggle/installation"),
            }}
          >
            <li>
              <a href="#css-setup">CSS setup</a>
            </li>
            <li>
              <a href="#token-overrides">Tokens & presets</a>
            </li>
            <li>
              <a href="#provider-controls">Appearance controls</a>
            </li>
          </LibraryJumpLinks>
        </LibraryPageHeader>
      }
    />
  ),
};
