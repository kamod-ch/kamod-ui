/** Application Shell's existing destinations also define the shared guide navigation. */
import { ShellDesignReference, ShellExplanation } from "../ApplicationShellAbout";
import { ShellProps } from "../ApplicationShellProps";
import { ShellSetup, ShellUsage } from "../ApplicationShellSetup";
import { shellProductionSection } from "./ShellProductionGuide";
import type { BlockGuideSection } from "./types";

export const applicationShellSections: readonly BlockGuideSection[] = [
  {
    id: "application-shell-installation",
    label: "Add This Block",
    eyebrow: "Getting Started",
    Content: ShellSetup,
    children: [
      { id: "application-shell-copy", label: "Copy the Block", step: 1 },
      { id: "application-shell-dependencies", label: "Install Missing Dependencies", step: 2 },
      { id: "application-shell-styles", label: "Set Up Styles and Import", step: 3 },
    ],
  },
  { id: "application-shell-usage", label: "Usage", eyebrow: "Integration", Content: ShellUsage },
  {
    id: "application-shell-props",
    label: "Props and Data",
    eyebrow: "API Reference",
    Content: ShellProps,
    children: [
      { id: "application-shell-prop-reference", label: "Component Props" },
      { id: "application-shell-navigation-data", label: "Type Your Navigation Data" },
      { id: "application-shell-data-types", label: "Data Type Reference" },
      { id: "application-shell-callbacks", label: "Navigation and Callbacks" },
      { id: "application-shell-state", label: "Sidebar State" },
    ],
  },
  {
    id: "application-shell-about",
    label: "About This Block",
    eyebrow: "A Closer Look",
    Content: ShellExplanation,
    children: [
      { id: "application-shell-structure", label: "Structure and Composition" },
      { id: "application-shell-navigation", label: "Navigation and Routing" },
      { id: "application-shell-responsive", label: "Responsive Behavior and State" },
      { id: "application-shell-account", label: "Account Menu and Page Content" },
      { id: "application-shell-accessibility", label: "Accessibility and Styling" },
      { id: "application-shell-demo", label: "Making It Your Own" },
    ],
  },
  shellProductionSection,
  {
    id: "application-shell-reference",
    label: "Design Reference",
    eyebrow: "Design Inspiration",
    Content: ShellDesignReference,
  },
];
