/** Application Shell's existing destinations also define the shared guide navigation. */
import { ShellDesignReference, ShellExplanation } from "../ApplicationShellAbout";
import { ShellProps } from "../ApplicationShellProps";
import { ShellSetup, ShellUsage } from "../ApplicationShellSetup";
import type { BlockGuideSection } from "./types";

export const applicationShellSections: readonly BlockGuideSection[] = [
  {
    id: "application-shell-installation",
    label: "Add this block",
    eyebrow: "Getting started",
    Content: ShellSetup,
    children: [
      { id: "application-shell-copy", label: "Copy the block", step: 1 },
      { id: "application-shell-dependencies", label: "Install missing dependencies", step: 2 },
      { id: "application-shell-styles", label: "Set up styles and import", step: 3 },
    ],
  },
  { id: "application-shell-usage", label: "Usage", eyebrow: "Integration", Content: ShellUsage },
  {
    id: "application-shell-props",
    label: "Props and data",
    eyebrow: "API reference",
    Content: ShellProps,
    children: [
      { id: "application-shell-prop-reference", label: "Component props" },
      { id: "application-shell-navigation-data", label: "Type your navigation data" },
      { id: "application-shell-data-types", label: "Data type reference" },
      { id: "application-shell-callbacks", label: "Navigation and callbacks" },
      { id: "application-shell-state", label: "Sidebar state" },
    ],
  },
  {
    id: "application-shell-about",
    label: "About this block",
    eyebrow: "A closer look",
    Content: ShellExplanation,
    children: [
      { id: "application-shell-structure", label: "Structure and composition" },
      { id: "application-shell-navigation", label: "Navigation and routing" },
      { id: "application-shell-responsive", label: "Responsive behavior and state" },
      { id: "application-shell-account", label: "Account menu and page content" },
      { id: "application-shell-accessibility", label: "Accessibility and styling" },
      { id: "application-shell-demo", label: "Making it your own" },
    ],
  },
  {
    id: "application-shell-reference",
    label: "Design reference",
    eyebrow: "Design inspiration",
    Content: ShellDesignReference,
  },
];
