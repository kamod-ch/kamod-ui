import foundationSource from "virtual:kamod-theming-guide";
import { withBasePath } from "../../base-path";
import { GuideArticle } from "../components/GuideArticle";
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
                <strong>Shared Colors, Typography and Appearance Preferences</strong> that work
                across the interface. Start with a built-in preset and refine its roles rather than
                repeating individual color values in every component.
              </p>
              <p>
                This is the shared reference for <strong>Components and Complete Blocks</strong>.
                Follow the CSS setup, token and runtime steps here once, then use the{" "}
                <a href={withBasePath("/blocks/theming")}>Block Theming Guide</a> for copied-source
                checks, sidebar surfaces and preview behavior. There is no separate block theme to
                install. Add a compact Light/Dark action, or offer{" "}
                <strong>Light, Dark and System</strong> through your own settings. Keep paired
                tokens such as <code>--card</code> and <code>--card-foreground</code> readable,
                preserve focus feedback and verify the first render as well as saved preferences.
                For the control’s API and examples, see{" "}
                <a href={withBasePath("/docs/theme-toggle/installation")}>Theme Toggle</a>.
              </p>
            </>
          }
        />
      }
    />
  ),
};
