/** Overview metadata comes from the block registries without importing their demo components. */

import { appSidebarBlockMetadata } from "../../../blocks/src/app-sidebar/metadata.ts";
import { applicationShellBlockMetadata } from "../../../blocks/src/application-shell/metadata.ts";
import { catalogAuthBlockMetadata } from "../../../blocks/src/auth/catalog-metadata.ts";
import { commerceBlockMetadata } from "../../../blocks/src/commerce/metadata.ts";
import { communicationBlockMetadata } from "../../../blocks/src/communication/metadata.ts";
import { dashboardBlockMetadata } from "../../../blocks/src/dashboard/metadata.ts";
import { loginBlockMetadata } from "../../../blocks/src/login/metadata.ts";
import { marketingBlockMetadata } from "../../../blocks/src/marketing/metadata.ts";
import { sidebarBlockMetadata } from "../../../blocks/src/sidebar/metadata.ts";
import { signupBlockMetadata } from "../../../blocks/src/signup/metadata.ts";

/** The fields needed to link a registered block to its documentation. */
export type BlockOverviewEntry = {
  id: string;
  title: string;
  description: string;
  installCommand: string;
  dependencies: readonly string[];
  tags: readonly string[];
  features?: readonly string[];
  category?: string;
  files: readonly { label: string; path: string; kind?: string }[];
  preview?: { height: number; fullWidth?: boolean };
  props?: readonly { name: string; type: string; description: string }[];
  usage?: string;
};

export const blockCategories = {
  sidebar: {
    title: "Sidebar Navigation and Layout Blocks",
    description:
      "Choose a navigation layout that fits your application, from **Grouped Links and Nested Menus** to icon-only collapse, floating panels and inset sidebars. Each variant composes `Sidebar` primitives from `@kamod-ch/ui`, so you can adapt the navigation, branding and surrounding content together. Open a block to explore its **Responsive Behavior**, review the source and setup steps, then replace the sample destinations with your own routes.",
    label: "Sidebar",
    blocks: sidebarBlockMetadata,
  },
  "application-shell": {
    title: "Application Shells for Your Workspace",
    description:
      "Give your workspace a consistent frame with **Responsive Sidebar Navigation**, breadcrumbs and an account menu. Supply `navigationGroups` and `breadcrumbs` to describe your application, then render each page through `children` inside the shared layout. The shell leaves **Routing, Authentication and Account Actions** to your app. Explore the demo and typed examples to understand nested navigation, desktop collapse and the separate mobile navigation before connecting your own data.",
    label: "Application Shell",
    blocks: applicationShellBlockMetadata,
  },
  login: {
    title: "Login Forms and Sign-in Pages",
    description:
      "Find a sign-in layout that fits your entry point, from a compact form to a split page or an email-only flow. The examples include **Field Validation and Submission Feedback**; **Your Authentication Service Handles the Actual Sign-in**. Connect `onSubmit` and, where supported, `onSocialLogin` to your existing flow, then adapt the branding and account links. Each detail page provides the live demo, source files and setup guidance for that variant.",
    label: "Login",
    blocks: loginBlockMetadata,
  },
  signup: {
    title: "Signup Forms and Registration Pages",
    description:
      "Build a registration entry point around a compact form, a split layout or supported social-provider options. Each example includes **Validation and Submission Feedback While Leaving Account Creation to Your Service**. Connect `onSubmit` and, where available, `onSocialSignup`, then adapt the fields, branding and legal links to your product. Use the detail page to inspect the form behavior and required files before integrating the layout into your **Onboarding Flow**.",
    label: "Signup",
    blocks: signupBlockMetadata,
  },
  "app-sidebar": {
    title: "App Sidebar Blocks",
    description:
      "Preact-native application sidebars ported from the uipkge catalog. Existing Kamod sidebar-01…16 stay on the Sidebar page. Each variant composes `@kamod-ch/ui` sidebar primitives with typed navigation data. Open a block for its live preview, source files and setup steps.",
    label: "App Sidebar",
    blocks: appSidebarBlockMetadata as BlockOverviewEntry[],
  },
  auth: {
    title: "Auth Catalog Blocks",
    description:
      "Preact-native authentication screens ported from the uipkge catalog. The consumer owns network and session logic. These catalog variants complement the dedicated Login and Signup collections with additional MFA, OAuth and registration layouts.",
    label: "Auth",
    blocks: catalogAuthBlockMetadata as BlockOverviewEntry[],
  },
  marketing: {
    title: "Marketing Blocks",
    description:
      "Preact-native landing-page sections ported from the uipkge catalog. Contents are typed props, not schema renderers. Browse heroes, pricing, logos and contact sections, then copy the variant that fits your marketing site.",
    label: "Marketing",
    blocks: marketingBlockMetadata as BlockOverviewEntry[],
  },
  dashboard: {
    title: "Dashboard Blocks",
    description:
      "Preact-native dashboard utilities ported from the uipkge catalog. Chart blocks ship dummy data, empty states and accessible summaries. Pick metrics grids, calendars, kanban boards and layout shells for your workspace.",
    label: "Dashboard",
    blocks: dashboardBlockMetadata as BlockOverviewEntry[],
  },
  communication: {
    title: "Communication Blocks",
    description:
      "Preact-native chat, inbox, and LLM blocks. Consumer data is controlled; fixtures live in previews. Streaming uses AbortSignal. Explore thread, two-pane, inbox and AI chat layouts before wiring your backend.",
    label: "Communication",
    blocks: communicationBlockMetadata as BlockOverviewEntry[],
  },
  commerce: {
    title: "Commerce Blocks",
    description:
      "Payment UI, saved tokenized cards, and a checkout state machine. PAN/CVC never persist in these demos. Use the previews to understand callbacks and state before connecting your payment service provider.",
    label: "Commerce",
    blocks: commerceBlockMetadata as BlockOverviewEntry[],
  },
} satisfies Record<
  string,
  { title: string; description: string; label: string; blocks: readonly BlockOverviewEntry[] }
>;

export type BlockCategory = keyof typeof blockCategories;

export const catalogBlockCategories = [
  "app-sidebar",
  "auth",
  "marketing",
  "dashboard",
  "communication",
  "commerce",
] as const satisfies readonly BlockCategory[];

export type CatalogBlockCategory = (typeof catalogBlockCategories)[number];

export function isCatalogBlockCategory(category: BlockCategory): category is CatalogBlockCategory {
  return (catalogBlockCategories as readonly string[]).includes(category);
}

/** Resolve only registered legacy anchors; unknown or malformed fragments stay on the overview. */
export function legacyBlockDestination(category: BlockCategory, hash: string): string | undefined {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return undefined;
  }
  return blockCategories[category].blocks.some((block) => block.id === id)
    ? `/blocks/${category}/${id}#${id}`
    : undefined;
}
