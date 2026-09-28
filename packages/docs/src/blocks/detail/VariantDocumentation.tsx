/** Standard guide assembly; category-specific content shares the same section and navigation contract. */
import { useMemo } from "preact/hooks";
import { type BlockCategory, type BlockOverviewEntry, blockCategories } from "../block-categories";
import { BlockDocumentation } from "./BlockDocumentation";
import { sidebarGuideProfiles } from "./sidebar-guide-profiles";
import type { BlockGuideSection } from "./types";
import { VariantAbout, VariantBehavior, VariantSource } from "./VariantAbout";
import { VariantApi } from "./VariantApi";
import { VariantSetup, VariantUsage } from "./VariantSetup";
import { getVariantApi } from "./variant-api";

export type VariantGuide = ReturnType<typeof createVariantGuide>;

/** Resolve once per variant. The same IDs drive rendered headings, examples and the contents sidebar. */
export function createVariantGuide(
  category: Exclude<BlockCategory, "application-shell">,
  block: BlockOverviewEntry,
) {
  const registry = blockCategories[category].blocks.find((entry) => entry.id === block.id);
  if (!registry) throw new Error(`Missing guide metadata: ${block.id}`);
  return {
    category,
    block,
    files: registry.files,
    anchor: (section: string) => `${block.id}-${section}`,
    component: block.id
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(""),
    sidebar:
      category === "sidebar"
        ? sidebarGuideProfiles[block.id as keyof typeof sidebarGuideProfiles]
        : undefined,
    api: getVariantApi(category, block.id),
  };
}

/** One guide per route; stable section definitions preserve contents and disclosure state during renders. */
export function VariantDocumentation({
  category,
  block,
}: {
  category: Exclude<BlockCategory, "application-shell">;
  block: BlockOverviewEntry;
}) {
  const sections = useMemo(() => {
    const guide = createVariantGuide(category, block);
    const heading = (id: string, label: string, step?: number) => ({
      id: guide.anchor(id),
      label,
      step,
    });
    return [
      {
        ...heading("installation", "Add this block"),
        eyebrow: "Getting started",
        Content: () => <VariantSetup guide={guide} />,
        children: [
          heading("copy", "Copy the block", 1),
          heading("dependencies", "Install missing dependencies", 2),
          heading("styles", "Set up styles and import", 3),
        ],
      },
      {
        ...heading("usage", "Usage"),
        eyebrow: "Integration",
        Content: () => <VariantUsage guide={guide} />,
        children:
          category === "sidebar"
            ? []
            : [
                heading("render", "Render the page or form"),
                heading("connect-app", "Connect your authentication service"),
                heading("verify-flow", "Check the complete flow"),
              ],
      },
      {
        ...heading("props", "Props and data"),
        eyebrow: "API reference",
        Content: () => <VariantApi guide={guide} />,
        children: [
          heading("prop-reference", category === "sidebar" ? "Local props and data" : "Form props"),
          heading("data-types", "Data type reference"),
        ],
      },
      {
        ...heading(
          "behavior",
          guide.sidebar?.title ??
            (category === "signup"
              ? "Registration and consent"
              : block.id === "login-05"
                ? "Email-only sign-in"
                : "Sign-in and provider callbacks"),
        ),
        eyebrow: "Variant details",
        Content: () => <VariantBehavior guide={guide} />,
      },
      {
        ...heading("about", "About this block"),
        eyebrow: "A closer look",
        Content: () => <VariantAbout guide={guide} />,
        children: [
          heading("structure", "Composition and customization"),
          heading("responsive", "Responsive behavior"),
          heading("accessibility", "Accessibility"),
          heading("production", "Replace the demo behavior"),
        ],
      },
      {
        ...heading("source", "Source and customization"),
        eyebrow: "Keep building",
        Content: () => <VariantSource guide={guide} />,
      },
    ] satisfies BlockGuideSection[];
  }, [category, block]);
  return <BlockDocumentation block={block} category={category} sections={sections} />;
}
