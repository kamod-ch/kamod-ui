import type { ApplicationShellBlock } from "../application-shell-config";
import { type ShellVariantId, shellVariantGuides } from "./application-shell-profiles";
import { shellProductionSection } from "./ShellProductionGuide";
import { ShellThreeSetup, ShellThreeUsage } from "./ShellThreeQuickstart";
import { ShellVariantAbout } from "./ShellVariantAbout";
import { ShellVariantProps } from "./ShellVariantProps";
import { ShellVariantReference } from "./ShellVariantReference";
import { ShellVariantSetup } from "./ShellVariantSetup";
import { ShellVariantUsage } from "./ShellVariantUsage";
import type { BlockGuideSection } from "./types";

export { type ShellVariantId, shellVariantGuides } from "./application-shell-profiles";
export { shellUsageCode } from "./application-shell-usage-code";

/** Section definitions memoized by the detail page for each block identity. */
export function createShellVariantSections(
  block: ApplicationShellBlock,
): readonly BlockGuideSection[] {
  const id = block.id as ShellVariantId;
  const profile = shellVariantGuides[id];
  return [
    {
      id: "application-shell-installation",
      label: "Add This Block",
      eyebrow: "Getting Started",
      Content:
        id === "application-shell-3" ? ShellThreeSetup : () => <ShellVariantSetup block={block} />,
      children: [
        {
          id: "application-shell-copy",
          label: id === "application-shell-3" ? "Download and Add the Folder" : "Copy the Source",
          step: id === "application-shell-3" ? 1 : undefined,
        },
        {
          id: "application-shell-dependencies",
          label: id === "application-shell-3" ? "Check Your Dependencies" : "Dependencies",
          step: id === "application-shell-3" ? 2 : undefined,
        },
        {
          id: "application-shell-styles",
          label: id === "application-shell-3" ? "Check Your Styles" : "Styles and Import",
          step: id === "application-shell-3" ? 3 : undefined,
        },
      ],
    },
    {
      id: "application-shell-usage",
      label: id === "application-shell-3" ? "Your First Working Screen" : "Render and Connect",
      eyebrow: "Integration",
      Content:
        id === "application-shell-3" ? ShellThreeUsage : () => <ShellVariantUsage block={block} />,
      children: [
        {
          id: "application-shell-render",
          label: id === "application-shell-3" ? "Paste the Example" : "Working Example",
        },
        {
          id: "application-shell-connect",
          label: id === "application-shell-3" ? "Make It Yours" : "Routes and Services",
        },
        {
          id: "application-shell-state",
          label: id === "application-shell-3" ? "Try the Navigation" : "Responsive State",
        },
      ],
    },
    {
      id: "application-shell-props",
      label: "Props and Data",
      eyebrow: "API Reference",
      Content: () => <ShellVariantProps block={block} />,
      children: [
        { id: "application-shell-prop-reference", label: "Component Props" },
        { id: "application-shell-data-contracts", label: "Data Contracts" },
      ],
    },
    {
      id: "application-shell-about",
      label: `About the ${profile.name}`,
      eyebrow: "A Closer Look",
      Content: () => <ShellVariantAbout block={block} />,
      children: [
        { id: "application-shell-fit", label: "When to Choose It" },
        { id: "application-shell-structure", label: "Composition" },
        { id: "application-shell-appearance", label: "Appearance" },
        { id: "application-shell-review", label: "Verify the Journey" },
      ],
    },
    shellProductionSection,
    {
      id: "application-shell-reference",
      label: "Source and Next Steps",
      eyebrow: "Keep Building",
      Content: () => <ShellVariantReference block={block} />,
    },
  ];
}
